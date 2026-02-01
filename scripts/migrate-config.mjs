
import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const ROOT_PAGE_ID = process.env.ROOT_PAGE_ID;

if (!process.env.NOTION_API_KEY || !ROOT_PAGE_ID) {
    console.error("Missing env vars");
    process.exit(1);
}

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

async function findFullPageDb(name) {
    const children = await fetchAllChildren(ROOT_PAGE_ID);
    const db = children.find(b => b.type === 'child_database' && b.child_database.title === name);
    return db ? db.id : null;
}

async function fetchAllDatabasePages(databaseId) {
    let results = [];
    let cursor = undefined;
    do {
        const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ start_cursor: cursor })
        });
        const data = await response.json();
        results.push(...data.results);
        cursor = data.next_cursor;
    } while (cursor);
    return results;
}

async function main() {
    console.log("Migrating Config...");
    const configDbId = await findFullPageDb("Config");
    if (!configDbId) {
        console.error("Config DB not found!");
        return;
    }

    const pages = await fetchAllDatabasePages(configDbId);

    // We need to:
    // 1. Rename 'site_title' -> 'site_name'
    // 2. Add 'description'
    // 3. Rename/Add 'logo' (was profile_image?) 
    //    User said "config page ... no longer needs profile_image field, logo field is now doing that task".
    //    This implies I should DELETE profile_image and ADD logo.
    //    Or RENAME `profile_image` key to `logo`?
    //    The user said "logo field is now doing that task". So replacing it.

    // Logic: Look for pages by Name (Key)

    for (const page of pages) {
        const props = page.properties;
        const key = props.Name?.title?.[0]?.plain_text;

        if (!key) continue;

        if (key === 'site_title' || key === 'site_name') {
            const newKey = 'title';
            console.log(`Renaming ${key} -> ${newKey}`);
            // Check if 'title' already exists?
            // If we are renaming, we are changing the property name of the existing property.
            // But if 'title' already exists, this might fail or merge.
            // Let's assume user is following steps.
            await notion.pages.update({
                page_id: page.id,
                properties: {
                    Name: { title: [{ text: { content: newKey } }] }
                }
            });
        }
        else if (key === 'profile_image') {
            console.log("Renaming profile_image -> logo");
            // Rename to 'logo'? Or delete and create new?
            // User provided 'logo' default in dummy-data? 
            // If I renamed it, I keep the image if user uploaded one.
            // Let's rename it to 'logo' to preserve any upload (if consistent), 
            // or just swap the key.
            await notion.pages.update({
                page_id: page.id,
                properties: {
                    Name: { title: [{ text: { content: 'logo' } }] }
                }
            });
        }
        else if (key === 'site_description') {
            // Check if user meant renaming 'site_description' to 'description'?
            // User said "also add a description field". 
            // In dummy data I kept both? No, I removed site_description in dummy-data.
            // So safe to assume rename site_description -> description.
            console.log("Renaming site_description -> description");
            await notion.pages.update({
                page_id: page.id,
                properties: {
                    Name: { title: [{ text: { content: 'description' } }] }
                }
            });
        }
    }

    // Now check if 'logo' or 'description' exist (in case rename didn't happen because missing)
    // If not, create them?
    // Re-fetch pages to see current state
    const updatedPages = await fetchAllDatabasePages(configDbId);
    const keys = updatedPages.map(p => p.properties.Name?.title?.[0]?.plain_text);

    if (!keys.includes('description')) {
        console.log("Adding description...");
        await notion.pages.create({
            parent: { database_id: configDbId },
            properties: {
                Name: { title: [{ text: { content: 'description' } }] },
                Value: { rich_text: [{ text: { content: 'A portfolio site.' } }] }
            }
        });
    }

    if (!keys.includes('logo')) {
        console.log("Adding logo...");
        await notion.pages.create({
            parent: { database_id: configDbId },
            properties: {
                Name: { title: [{ text: { content: 'logo' } }] },
                Media: { files: [{ name: 'logo', external: { url: 'https://placehold.co/100' } }] }
            }
        });
    }

    console.log("Done.");
}

main();
