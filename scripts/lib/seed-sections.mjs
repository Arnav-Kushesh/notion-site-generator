// Seed Sections
// Generic function for creating any section database in Notion.
// Schema is defined in section-schema.mjs.

import {
    plainText,
    codeBlock,
} from './notion-blocks.mjs';
import { SECTION_SCHEMA, buildNotionProperties } from './section-schema.mjs';

/**
 * Create any section database in Notion and seed its first row.
 * Dispatches based on section.type using the centralized schema.
 */
export async function createAnySection(notion, parentId, section) {
    const sectionType = section.type;
    const schema = SECTION_SCHEMA[sectionType];

    if (!schema) {
        console.log(`     ! Unknown section type: ${sectionType}`);
        return;
    }

    console.log(`     - Creating ${sectionType}: ${section.title}`);

    // 1. Create database with properties from schema
    const properties = buildNotionProperties(sectionType);
    const db = await notion.databases.create({
        parent: { type: 'page_id', page_id: parentId },
        title: plainText(section.title),
        is_inline: true,
        properties,
    });

    // 2. Seed data row
    if (section.data && section.data.length > 0) {
        const item = section.data[0];
        const props = {};
        const children = [];

        for (const propDef of schema.properties) {
            const { name, notionType } = propDef;

            // code_block properties go as page children, not DB properties
            if (notionType === 'code_block') {
                if (item[name]) children.push(codeBlock(item[name], 'html'));
                continue;
            }

            // Get value from item data (also check 'image' as legacy alias for 'media')
            let value = item[name];
            if (value === undefined && name === 'media' && item.image) {
                value = item.image;
            }

            // Build Notion property value based on type
            if (notionType === 'title') {
                props[name] = { title: plainText(value || section.title) };
            } else if (notionType === 'rich_text') {
                props[name] = { rich_text: plainText(value ?? '') };
            } else if (notionType === 'checkbox') {
                // 'enabled' comes from the parent section object, others from item
                const boolVal = name === 'enabled'
                    ? section.enabled === 'true'
                    : (value || false);
                props[name] = { checkbox: boolVal };
            } else if (notionType === 'select') {
                if (value) props[name] = { select: { name: value } };
            } else if (notionType === 'url') {
                props[name] = { url: value || null };
            } else if (notionType === 'number') {
                props[name] = { number: value ?? propDef.default ?? 0 };
            } else if (notionType === 'files' && value) {
                props[name] = {
                    files: [{ type: 'external', name: 'Media', external: { url: value } }],
                };
            }
        }

        // Always set section_type
        props.section_type = { select: { name: sectionType } };

        await notion.pages.create({
            parent: { database_id: db.id },
            properties: props,
            children: children.length > 0 ? children : undefined,
        });
    }
}
