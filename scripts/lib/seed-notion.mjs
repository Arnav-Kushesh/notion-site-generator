import { dummyHero, dummyProjectConfig, dummyBlogConfig, dummyGalleryConfig, dummyProjects, dummyBlogs, dummyGalleryItems, dummySiteInfo } from './dummy-data.mjs';

/**
 * Checks if a block is effectively empty (empty paragraph or heading).
 */
function isEmptyBlock(block) {
    const type = block.type;
    // Only consider text blocks as potentially "empty" safe to ignore
    if (!['paragraph', 'heading_1', 'heading_2', 'heading_3', 'quote', 'callout'].includes(type)) {
        return false;
    }

    const content = block[type];
    const richText = content.rich_text;

    // If no rich text, it's empty
    if (!richText || richText.length === 0) return true;

    // Check if all text elements are just whitespace
    return richText.every(text => !text.plain_text || text.plain_text.trim() === '');
}

/**
 * Checks if the root page is empty and supports seeding.
 */
export async function ensureSiteStructure(rootPageId, notion) {
    if (!rootPageId || !notion) {
        console.log("❌ Missing Root Page ID or Notion Client.");
        return;
    }

    console.log("🔍 Checking root page validity...");

    // Check if root page is empty
    const blocks = await notion.blocks.children.list({ block_id: rootPageId });

    // Filter out empty blocks
    const nonEmptyBlocks = blocks.results.filter(block => !isEmptyBlock(block));

    if (nonEmptyBlocks.length > 0) {
        console.log("Root page is NOT empty. Skipping seeding to prevent data loss.");
        console.log(`ℹ️ Found ${nonEmptyBlocks.length} non-empty blocks on the root page (out of ${blocks.results.length} total).`);
        process.exit(0);
    }

    if (blocks.results.length > 0) {
        console.log(`ℹ️ Found ${blocks.results.length} blocks, but all are empty. Proceeding...`);
    }

    console.log("✅ Root page is ready. Proceeding with seeding...");
    await seedNotion(rootPageId, notion);
}

export async function seedNotion(rootPageId, notion) {
    console.log("🚀 Starting seeding process...");

    await createHomePage(rootPageId, notion);
    await createNavbarPagesContainer(rootPageId, notion);
    await createGallery(rootPageId, notion);
    await createProjects(rootPageId, notion);
    await createBlogs(rootPageId, notion);
    await createConfig(rootPageId, notion);

    console.log("✨ Seeding process completed successfully!");
}

const heading1 = (content) => ({
    object: 'block',
    type: 'heading_1',
    heading_1: { rich_text: [{ type: 'text', text: { content } }] }
});

const heading2 = (content) => ({
    object: 'block',
    type: 'heading_2',
    heading_2: { rich_text: [{ type: 'text', text: { content } }] }
});

const textBlock = (content) => ({
    object: 'block',
    type: 'paragraph',
    paragraph: { rich_text: [{ type: 'text', text: { content } }] }
});



const bulletedListItem = (content) => ({
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: { rich_text: [{ type: 'text', text: { content } }] }
});

const quoteBlock = (content) => ({
    object: 'block',
    type: 'quote',
    quote: { rich_text: [{ type: 'text', text: { content } }] }
});

const heading3 = (content) => ({
    object: 'block',
    type: 'heading_3',
    heading_3: { rich_text: [{ type: 'text', text: { content } }] }
});

const codeBlock = (content, language = "plain text") => ({
    object: 'block',
    type: 'code',
    code: {
        rich_text: [{ type: 'text', text: { content } }],
        language: language
    }
});

const imageBlock = (url, caption = "") => ({
    object: 'block',
    type: 'image',
    image: {
        type: "external",
        external: { url },
        caption: caption ? [{ type: 'text', text: { content: caption } }] : []
    }
});

function buildBlocks(contentArray) {
    if (!contentArray || !Array.isArray(contentArray)) {
        // Fallback for simple string content (backwards compatibility)
        if (typeof contentArray === 'string') return [textBlock(contentArray)];
        return [];
    }

    return contentArray.map(item => {
        switch (item.type) {
            case 'heading_1': return heading1(item.content);
            case 'heading_2': return heading2(item.content);
            case 'heading_3': return heading3(item.content);
            case 'paragraph': return textBlock(item.content);
            case 'bullet_list_item': return bulletedListItem(item.content);
            case 'quote': return quoteBlock(item.content);
            case 'code': return codeBlock(item.content, item.language);
            case 'image': return imageBlock(item.url, item.caption);
            default: return textBlock(item.content || '');
        }
    });
}

async function appendBlock(notion, parentId, block) {
    const res = await notion.blocks.children.append({
        block_id: parentId,
        children: [block]
    });
    return res.results[0].id;
}

// Helper to create an inline database for configuration
// usedIn: Config (Theming), HomePage (Hero, Projects, Blogs)
async function createInlineConfigDB(notion, parentId, title, includeMedia = false) {
    console.log(`   > Creating Inline DB: "${title}"...`);

    const properties = {
        Name: { title: {} },
        Value: { rich_text: {} },
    };

    if (includeMedia) {
        properties.Media = { files: {} };
    }

    const db = await notion.databases.create({
        parent: { type: 'page_id', page_id: parentId },
        title: [{ type: 'text', text: { content: title } }],
        is_inline: true,
        initial_data_source: {
            properties
        }
    });
    return db.id;
}

async function seedConfigDB(notion, dbId, data) {
    // Reverse data so that the first item in the array is created LAST.
    // This allows it to appear at the TOP of the database if sorted by "Newest First" (Notion default).
    const reversedData = [...data].reverse();

    for (const item of reversedData) {
        const props = {
            Name: { title: [{ text: { content: item.field } }] },
            Value: { rich_text: [{ text: { content: item.value || '' } }] }
        };

        if (item.media) {
            props.Media = {
                files: [
                    {
                        type: "external",
                        name: "Image",
                        external: { url: item.media }
                    }
                ]
            };
        }

        await notion.pages.create({
            parent: { database_id: dbId },
            properties: props
        });
    }
}


// --- Creators ---

// Don't forget to update imports at the top of the file!
// But for this block:

async function createConfig(rootPageId, notion) {
    console.log("\n📦 Creating Database: Config...");

    // Create Database directly (Full Page)
    const db = await notion.databases.create({
        parent: { type: 'page_id', page_id: rootPageId },
        title: [{ type: 'text', text: { content: 'Config' } }],
        initial_data_source: {
            properties: {
                Name: { title: {} },
                Value: { rich_text: {} },
                Media: { files: {} }
            }
        }
    });

    await notion.databases.update({
        database_id: db.id,
        icon: {
            type: "emoji",
            emoji: "⚙️",
        },
    });

    console.log(`   ✅ Config Database created (ID: ${db.id})`);

    console.log("   > Seeding Config data...");
    await seedConfigDB(notion, db.id, dummySiteInfo);
}

async function createHomePage(rootPageId, notion) {
    console.log("\n📦 Creating Page: Home Page...");

    // Create Page
    const page = await notion.pages.create({
        parent: { page_id: rootPageId },
        properties: { title: { title: [{ text: { content: 'Home Page' } }] } },
        icon: { type: "emoji", emoji: "🏠" },
    });
    console.log(`   ✅ Home Page created (ID: ${page.id})`);

    // Hero Section
    const heroDBId = await createInlineConfigDB(notion, page.id, "Hero Settings", true);
    console.log("   > Seeding Hero data...");
    await seedConfigDB(notion, heroDBId, dummyHero);



    // Spacer
    await notion.blocks.children.append({ block_id: page.id, children: [textBlock("")] });

    // Gallery Section (Added below Hero as requested)
    const galleryDBId = await createInlineConfigDB(notion, page.id, "Gallery Settings");
    console.log("   > Seeding Gallery Config data...");
    await seedConfigDB(notion, galleryDBId, dummyGalleryConfig);

    // Spacer
    await notion.blocks.children.append({ block_id: page.id, children: [textBlock("")] });

    // Projects Section
    const projDBId = await createInlineConfigDB(notion, page.id, "Projects Settings");
    console.log("   > Seeding Projects Config data...");
    await seedConfigDB(notion, projDBId, dummyProjectConfig);

    // Spacer
    await notion.blocks.children.append({ block_id: page.id, children: [textBlock("")] });

    // Blogs Section
    const blogDBId = await createInlineConfigDB(notion, page.id, "Blogs Settings");
    console.log("   > Seeding Blogs Config data...");
    await seedConfigDB(notion, blogDBId, dummyBlogConfig);
}

async function createNavbarPagesContainer(rootPageId, notion) {
    console.log("\n📦 Creating Page: Navbar Pages (Navbar Pages Container)...");

    // Create Page
    const page = await notion.pages.create({
        parent: { page_id: rootPageId },
        properties: { title: { title: [{ text: { content: 'Navbar Pages' } }] } },
        icon: { type: "emoji", emoji: "📑" },
    });
    console.log(`   ✅ Navbar Pages Container created (ID: ${page.id})`);

    console.log("   > Creating Navbar Pages (About, Contact)...");

    await notion.pages.create({
        parent: { page_id: page.id },
        properties: { title: { title: [{ text: { content: 'About' } }] } },
        icon: { type: "emoji", emoji: "👋" },
        children: [heading1("About Me"), textBlock("I am a developer who loves building things.")]
    });

    await notion.pages.create({
        parent: { page_id: page.id },
        properties: { title: { title: [{ text: { content: 'Contact' } }] } },
        icon: { type: "emoji", emoji: "📬" },
        children: [heading1("Get in Touch"), textBlock("Email me at hello@example.com")]
    });
}

async function createProjects(rootPageId, notion) {
    console.log("\n📦 Creating Database: Projects...");

    // Create a Database
    const db = await notion.databases.create({
        parent: { type: "page_id", page_id: rootPageId },
        title: [{ type: "text", text: { content: "Projects" } }],
        initial_data_source: {
            properties: {
                "Project Name": { title: {} },
                Status: {
                    select: {
                        options: [
                            { name: "Draft", color: "gray" },
                            { name: "Reviewing", color: "yellow" },
                            { name: "Published", color: "green" },
                            { name: "Archived", color: "red" },
                        ],
                    },
                },
                Description: { rich_text: {} },
                Slug: { rich_text: {} },
                Tools: { rich_text: {} },
                Link: { url: {} },
                Thumbnail: { files: {} }
            }
        }
    });

    await notion.databases.update({
        database_id: db.id,
        icon: {
            type: "emoji",
            emoji: "🗃️",
        },
    });

    console.log(`   ✅ Projects Database created (ID: ${db.id})`);


    console.log("   > Seeding sample projects...");

    // Seed dummy projects (using the loop properly)
    // We'll just seed a 'Published' one and a 'Work in Progress' (which we map to Draft/Reviewing for demo)

    // Flatten dummyProjects for seeding
    const allProjects = [
        ...dummyProjects['Live'].map(p => ({ ...p, status: 'Published' })),
        ...dummyProjects['Work in Progress'].map(p => ({ ...p, status: 'Draft' }))
    ];

    for (const p of allProjects) {
        await notion.pages.create({
            parent: { database_id: db.id },
            icon: { type: "emoji", emoji: "🚀" },
            properties: {
                'Project Name': { title: [{ text: { content: p.title } }] },
                Status: { select: { name: p.status } },
                Description: { rich_text: [{ text: { content: p.description } }] },
                Slug: { rich_text: [{ text: { content: p.slug || p.title.toLowerCase().replace(/ /g, '-') } }] },
                Tools: { rich_text: [{ text: { content: p.tools } }] },
                Link: { url: p.link },
                Thumbnail: {
                    files: p.image ? [{
                        type: "external",
                        name: "Thumbnail",
                        external: { url: p.image }
                    }] : []
                }
            },
            children: buildBlocks(p.content)
        });
        console.log(`     - Created '${p.status}' project: ${p.title}`);
    }
}

async function createBlogs(rootPageId, notion) {
    console.log("\n📦 Creating Database: Blogs...");

    // Create a Database
    const db = await notion.databases.create({
        parent: { type: 'page_id', page_id: rootPageId },
        title: [{ type: 'text', text: { content: 'Blogs' } }],
        initial_data_source: {
            properties: {
                Title: { title: {} },
                Status: {
                    select: {
                        options: [
                            { name: "Draft", color: "gray" },
                            { name: "Reviewing", color: "yellow" },
                            { name: "Published", color: "green" },
                            { name: "Archived", color: "red" },
                        ]
                    }
                },
                Description: { rich_text: {} },
                Slug: { rich_text: {} },
                'Published Date': { date: {} },
                Cover: { files: {} }
            }
        }
    });

    await notion.databases.update({
        database_id: db.id,
        icon: {
            type: "emoji",
            emoji: "📃",
        },
    });

    console.log(`   ✅ Blogs Database created (ID: ${db.id})`);

    console.log("   > Seeding sample blogs...");

    const allBlogs = [
        ...dummyBlogs['Live'].map(p => ({ ...p, status: 'Published' }))
    ];

    for (const p of allBlogs) {
        await notion.pages.create({
            parent: { database_id: db.id },
            icon: { type: "emoji", emoji: "📝" },
            properties: {
                Title: { title: [{ text: { content: p.title } }] },
                Status: { select: { name: p.status } },
                Description: { rich_text: [{ text: { content: p.description } }] },
                Slug: { rich_text: [{ text: { content: p.slug || p.title.toLowerCase().replace(/ /g, '-') } }] },
                'Published Date': { date: { start: p.date } },
                Cover: {
                    files: p.coverImage ? [{
                        type: "external",
                        name: "Cover",
                        external: { url: p.coverImage }
                    }] : []
                }
            },
            children: [
                heading1(p.title),
                ...buildBlocks(p.content)
            ]
        });
        console.log(`     - Created '${p.status}' blog: ${p.title}`);
    }
}

async function createGallery(rootPageId, notion) {
    console.log("\n📦 Creating Database: Gallery...");

    // Create a Database
    const db = await notion.databases.create({
        parent: { type: 'page_id', page_id: rootPageId },
        title: [{ type: 'text', text: { content: 'Gallery' } }],
        initial_data_source: {
            properties: {
                Name: { title: {} },
                Order: { number: { format: 'number' } },
                Slug: { rich_text: {} },
                Image: { files: {} },
                Link: { url: {} }
            }
        }
    });

    await notion.databases.update({
        database_id: db.id,
        icon: {
            type: "emoji",
            emoji: "🖼️",
        },
    });

    console.log(`   ✅ Gallery Database created (ID: ${db.id})`);
    console.log("   > Seeding sample gallery items...");

    for (const item of dummyGalleryItems) {
        await notion.pages.create({
            parent: { database_id: db.id },
            icon: { type: "emoji", emoji: "🎨" },
            properties: {
                Name: { title: [{ text: { content: item.name } }] },
                Order: { number: item.order || 0 },
                Slug: { rich_text: [{ text: { content: item.slug || item.name.toLowerCase().replace(/ /g, '-') } }] },
                Link: { url: item.link || null },
                Image: {
                    files: item.image ? [{
                        type: "external",
                        name: "Image",
                        external: { url: item.image }
                    }] : []
                }
            },
            children: buildBlocks(item.content)
        });
        console.log(`     - Created gallery item: ${item.name}`);
    }
}
