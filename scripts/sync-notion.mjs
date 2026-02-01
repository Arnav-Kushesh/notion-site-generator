
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

// Load .env
dotenv.config({ path: '.env' });

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });
const ROOT_PAGE_ID = process.env.ROOT_PAGE_ID;

if (!process.env.NOTION_API_KEY || !ROOT_PAGE_ID) {
    console.error("Missing NOTION_API_KEY or ROOT_PAGE_ID");
    console.log("Please ensure .env exists and is populated.");
    process.exit(1);
}

console.log("DEBUG: Checking Notion Client...");
console.log("DEBUG: notion.databases keys:", Object.keys(notion.databases || {}));
console.log("DEBUG: notion.databases.query type:", typeof notion.databases?.query);


// Helpers
const slugify = (text) => text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

async function ensureDir(dir) {
    await fs.mkdir(dir, { recursive: true });
}

async function downloadImage(url, filename) {
    if (!url) return '';
    try {
        // Let's download every time for now to ensure freshness.

        // Define path for images (kept public for serving)
        // NOTE: If we want images inside notion_state too, we'd need to copy them or serve from there.
        // For Next.js public folder is best for static serving. Let's keep images in public/images for now
        // as that is standard for Next.js SSG. 
        // IF the user wanted EVERYTHING in notion_state, we'd need a way to serve it. 
        // Assuming user means CONTENT and DATA json/md files.
        await ensureDir('public/images');
        const filepath = path.join('public/images', filename);

        // Simple check: if file exists, we might skip. But Notion URLs expire, so we should re-download if it's a signed URL.
        // However, generic "Is this the same image?" is hard without hashing.
        // For static site generation, downloading every time is safer for correctness, but slower.
        // Let's download every time for now to ensure freshness.

        // NOTE: In a real app, you might check if the file exists and is recent, or hash the URL.

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText} `);

        const buffer = Buffer.from(await response.arrayBuffer());
        await fs.writeFile(filepath, buffer);

        console.log(`     -> Downloaded: ${filename} `);
        return `/images/${filename}`;
    } catch (error) {
        console.error(`     ! Failed to download ${filename}: `, error.message);
        return url; // Fallback to original URL
    }
}

// Custom Transformer for Content Images
n2m.setCustomTransformer('image', async (block) => {
    const { image } = block;
    const url = image.file?.url || image.external?.url;
    const caption = image.caption ? image.caption.map(c => c.plain_text).join("") : "";

    if (!url) {
        return "";
    }

    try {
        // Extract extension or default to .jpg
        // Notion URLs often end with path/to/file.png?query
        const urlBase = url.split('?')[0];
        const ext = path.extname(urlBase) || '.jpg';
        const filename = `content-${block.id}${ext}`;

        const localUrl = await downloadImage(url, filename);

        return `![${caption}](${localUrl})`;
    } catch (e) {
        console.warn(`    ! Failed to transform/download content image ${block.id}: ${e.message}`);
        return `![${caption}](${url})`; // Fallback to remote URL
    }
});

// Data Extractors
// Pagination Helpers
async function fetchAllChildren(blockId) {
    let results = [];
    let cursor = undefined;
    do {
        const response = await notion.blocks.children.list({
            block_id: blockId,
            start_cursor: cursor
        });
        results.push(...response.results);
        cursor = response.next_cursor;
    } while (cursor);
    return results;
}

async function fetchAllDatabasePages(databaseId, filter, sorts) {
    if (!databaseId) {
        console.warn("   ! fetchAllDatabasePages called with missing ID");
        return [];
    }
    let results = [];
    let cursor = undefined;

    // Check if global fetch is available (Node 18+)
    if (typeof fetch === 'undefined') {
        throw new Error("Global fetch not found. Please use Node.js 18+");
    }

    do {
        const body = {
            start_cursor: cursor,
        };
        if (filter) body.filter = filter;
        if (sorts) body.sorts = sorts;

        const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Notion API Query Failed: ${response.status} ${response.statusText} - ${err}`);
        }

        const data = await response.json();
        results.push(...data.results);
        cursor = data.next_cursor;
    } while (cursor);
    return results;
}

// Data Extractors
async function getPageByName(parentId, name) {
    const children = await fetchAllChildren(parentId);
    // This is naive, finding a child page by title requires iterating or search. 
    // Search is better but global. Let's try to search by parent + title if possible, 
    // or just list children and filter if it's a small site. 
    // For robust 'Config' finding, let's look at recent pages or assume structure.

    // Better approach: Use Search API restricted to immediate children if possible? No.
    // We will list children of ROOT.

    for (const block of children) {
        if (block.type === 'child_page' && block.child_page.title === name) {
            return block.id;
        }
    }
    return null;
}

// Find Inline DB directly on Page

async function fetchConfigKV(dbId, prefix = 'config') {
    if (!dbId) return {};
    const pages = await fetchAllDatabasePages(dbId);
    const data = {};
    for (const page of pages) {
        // Assume Name (Title) and Value (RichText) and optional Media (Files)
        const props = page.properties;
        const key = props.Name?.title?.[0]?.plain_text;
        if (!key) continue;

        let val = props.Value?.rich_text?.[0]?.plain_text || '';

        // If there's a file, prefer that or add it
        if (props.Media?.files?.length > 0) {
            const rawUrl = props.Media.files[0].file?.url || props.Media.files[0].external?.url;
            if (rawUrl) {
                const ext = path.extname(rawUrl.split('?')[0]) || '.jpg';
                const filename = `${prefix}-${slugify(key)}${ext}`;
                val = await downloadImage(rawUrl, filename);
            }
        }

        data[key] = val;
    }
    return data;
}

async function syncConfig() {
    console.log("Syncing Config...");
    // Find the Config Database directly (Full Page)
    const configDbId = await findFullPageDb("Config");

    if (!configDbId) {
        console.warn("Config database not found! (Checking for legacy page...)");
        // Fallback or just warn? Given we want to enforce full page, let's just warn.
        // But if the user hasn't run seed yet, it won't be there.
        // The script relies on existing structure.
        return;
    }

    const siteInfo = await fetchConfigKV(configDbId, 'site');

    const configData = {
        info: siteInfo
    };

    await ensureDir('notion_state/data');
    await fs.writeFile('notion_state/data/site.json', JSON.stringify(configData, null, 2));
}

async function findFullPageDb(name) {
    const children = await fetchAllChildren(ROOT_PAGE_ID);
    const db = children.find(b => b.type === 'child_database' && b.child_database.title === name);
    return db ? db.id : null;
}

// New Helper to fetch Info Section Data
async function fetchInfoSectionData(dbId) {
    const pages = await fetchAllDatabasePages(dbId);
    if (pages.length === 0) return null;

    const page = pages[0];
    const props = page.properties;

    const data = {
        title: props.title?.title?.[0]?.plain_text || props.Title?.title?.[0]?.plain_text || '',
        description: props.description?.rich_text?.[0]?.plain_text || props.Description?.rich_text?.[0]?.plain_text || '',
        link: props.link?.url || props.Link?.url || '',
        view_type: props.view_type?.select?.name || props['View Type']?.select?.name || 'col_centered_view',
    };

    const imageProp = props.image?.files || props.Image?.files;
    if (imageProp?.length > 0) {
        const rawUrl = imageProp[0].file?.url || imageProp[0].external?.url;
        if (rawUrl) {
            const ext = path.extname(rawUrl.split('?')[0]) || '.jpg';
            const filename = `info-${dbId}-${slugify(data.title).slice(0, 20)}${ext}`;
            data.image = await downloadImage(rawUrl, filename);
        }
    }

    return data;
}

// New Helper to fetch Dynamic Section Data (Config only)
async function fetchDynamicSectionData(dbId) {
    const pages = await fetchAllDatabasePages(dbId);
    if (pages.length === 0) return null;

    const page = pages[0];
    const props = page.properties;

    return {
        collection_name: props.collection_name?.title?.[0]?.plain_text || '',
        section_title: props.section_title?.rich_text?.[0]?.plain_text || '',
        view_type: props.view_type?.select?.name || 'list_view',
    };
}

// Helper to retrieve DB details with explicit version (to ensure properties)
async function fetchDatabaseDetails(databaseId) {
    if (typeof fetch === 'undefined') {
        throw new Error("Global fetch not found. Please use Node.js 18+");
    }
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Notion API Retrieve DB Failed: ${response.status} ${err}`);
    }
    return await response.json();
}

// Updated syncHomePage
async function syncHomePage() {
    console.log("Syncing Home Page...");
    const homePageId = await getPageByName(ROOT_PAGE_ID, "Home Page");
    if (!homePageId) {
        console.warn("Home Page not found!");
        return;
    }

    const sections = [];

    // Fetch all children
    const homeChildrenBlocks = await fetchAllChildren(homePageId);
    const databases = homeChildrenBlocks.filter(b => b.type === 'child_database');

    console.log(`   > Found ${databases.length} databases on Home Page.`);

    for (const dbBlock of databases) {
        const dbId = dbBlock.id;
        const dbTitle = dbBlock.child_database.title;

        console.log(`   > Processing: ${dbTitle}`);

        // introspect DB properties to determine type
        // Use manual fetch to ensure we get properties regardless of library version
        const dbDetails = await fetchDatabaseDetails(dbId);

        const props = dbDetails.properties || {};

        // Check for explicit section_type first
        const sectionType = props['section_type']?.select?.name || props['Section Type']?.select?.name;

        if (sectionType === 'dynamic_section') {
            const data = await fetchDynamicSectionData(dbId);
            if (data) {
                sections.push({
                    type: 'dynamic_section',
                    id: dbId,
                    title: data.section_title || dbTitle,
                    ...data
                });
            }
        } else if (sectionType === 'info_section') {
            const data = await fetchInfoSectionData(dbId);
            if (data) {
                sections.push({
                    type: 'info_section',
                    id: dbId,
                    title: dbTitle,
                    ...data
                });
            }
        } else {
            // Fallback to property check (legacy/inference)
            if (props['collection_name']) {
                // Dynamic Section
                const data = await fetchDynamicSectionData(dbId);
                if (data) {
                    sections.push({
                        type: 'dynamic_section',
                        id: dbId,
                        title: data.section_title || dbTitle,
                        ...data
                    });
                }
            } else if ((props['description'] && props['title']) || (props['Description'] && props['Title'])) {
                // Info Section
                const data = await fetchInfoSectionData(dbId);
                if (data) {
                    sections.push({
                        type: 'info_section',
                        id: dbId,
                        title: dbTitle,
                        ...data
                    });
                }
            } else {
                console.log(`     ! Unknown database type: ${dbTitle}`);
            }
        }
    }

    const homeData = { sections };
    await ensureDir('notion_state/data');
    await fs.writeFile('notion_state/data/home.json', JSON.stringify(homeData, null, 2));
}


// Generic Collection Syncer
async function syncAllCollections() {
    console.log("Syncing All Collections...");
    const collectionsPageId = await getPageByName(ROOT_PAGE_ID, "Collections");
    if (!collectionsPageId) {
        console.warn("   ! Collections Page not found in Root");
        return;
    }

    const children = await fetchAllChildren(collectionsPageId);
    const databases = children.filter(b => b.type === 'child_database');

    console.log(`   > Found ${databases.length} collections.`);

    for (const dbBlock of databases) {
        const dbTitle = dbBlock.child_database.title;
        const dbId = dbBlock.id;
        const slug = slugify(dbTitle); // e.g. "Projects" -> "projects"

        console.log(`   > Syncing Collection: ${dbTitle} (${slug})...`);

        // Introspect DB to check structure? 
        // We assume shared schema for simplicity as per plan: Title, Description, Image, Tags, Link, Order
        // If schema differs, we do best effort mapping.

        const pages = await fetchAllDatabasePages(dbId, undefined, [
            { property: 'Order', direction: 'ascending' }
        ]);

        await ensureDir(`notion_state/content/${slug}`);

        for (const page of pages) {
            const mdBlocks = await n2m.pageToMarkdown(page.id);
            const mdString = n2m.toMarkdownString(mdBlocks);

            // Map properties generically
            const props = page.properties;
            const itemTitle = props.Title?.title?.[0]?.plain_text || 'Untitled';
            const itemSlug = props.Slug?.rich_text?.[0]?.plain_text || slugify(itemTitle); // Prefer explicit slug if available

            // Image/Cover
            const rawImage = props.Image?.files?.[0]?.file?.url || props.Image?.files?.[0]?.external?.url;
            let image = '';
            if (rawImage) {
                const ext = path.extname(rawImage.split('?')[0]) || '.jpg';
                image = await downloadImage(rawImage, `${slug}-${itemSlug}${ext}`);
            }

            const tags = props.Tags?.multi_select?.map(o => o.name) || [];
            const link = props.Link?.url || '';
            const description = props.Description?.rich_text?.[0]?.plain_text || '';
            const order = props.Order?.number || 0;

            const frontmatter = {
                slug: itemSlug,
                title: itemTitle,
                collection: slug, // Add collection name to frontmatter
                date: page.created_time,
                description,
                image, // Generic name
                cover: { image: image, alt: itemTitle }, // Compat
                thumbnail: image, // Compat
                tags,
                link,
                tools: tags.join(', '), // Compat for projects
                order
            };

            const fileContent = `---\n${JSON.stringify(frontmatter, null, 2)}\n---\n\n${mdString.parent}`;
            await fs.writeFile(`notion_state/content/${slug}/${itemSlug}.md`, fileContent);
        }
    }
}

async function syncNavbarPagesContainer() {
    console.log("Syncing Navbar Pages Container...");
    const pagesContainerId = await getPageByName(ROOT_PAGE_ID, "Navbar Pages");
    if (!pagesContainerId) {
        console.warn("Navbar Pages Container not found!");
        return;
    }

    // ... (rest same, just wrapping up)
    const children = await fetchAllChildren(pagesContainerId);
    for (const block of children) {
        if (block.type === 'child_page') {
            const pageId = block.id;
            const title = block.child_page.title;
            const slug = slugify(title);

            console.log(`     - Fetching page: ${title}`);
            const mdBlocks = await n2m.pageToMarkdown(pageId);
            const mdString = n2m.toMarkdownString(mdBlocks);

            const frontmatter = {
                title,
                date: new Date().toISOString(),
                menu: "main"
            };

            const fileContent = `---\n${JSON.stringify(frontmatter, null, 2)}\n---\n\n${mdString.parent}`;
            await ensureDir('notion_state/content/navbarPages');
            await fs.writeFile(`notion_state/content/navbarPages/${slug}.md`, fileContent);
        }
    }
}


async function main() {
    try {
        await syncConfig();
        await syncHomePage();
        await syncNavbarPagesContainer();
        await syncAllCollections();
        console.log("Completed sync.");
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main();
