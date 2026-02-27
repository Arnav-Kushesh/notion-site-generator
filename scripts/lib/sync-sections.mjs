// Sync Sections
// Generic function for fetching section data from Notion databases.
// Schema is defined in section-schema.mjs.

import path from 'path';
import {
    downloadImage,
    fetchAllChildren,
    fetchAllDatabasePages,
    fetchDatabaseDetails,
} from './sync-helpers.mjs';
import {
    SECTION_SCHEMA,
    readAllProperties,
    getFileProperties,
    getCodeBlockProperties,
} from './section-schema.mjs';

// --- Generic Section Data Fetcher ---

export async function fetchSectionData(sectionType, dbId) {
    const schema = SECTION_SCHEMA[sectionType];
    if (!schema) return null;

    const pages = await fetchAllDatabasePages(dbId);
    if (pages.length === 0) return null;

    const page = pages[0];
    const props = page.properties;

    // Read all simple properties (non-files, non-code_block)
    const data = readAllProperties(sectionType, props);

    // Handle file downloads
    for (const fileProp of getFileProperties(sectionType)) {
        const namesToTry = [fileProp.name, ...(fileProp.aliases || [])];
        let mediaFiles;
        for (const n of namesToTry) {
            mediaFiles = props[n]?.files;
            if (mediaFiles?.length > 0) break;
        }

        data[fileProp.name] = '';
        if (mediaFiles?.length > 0) {
            const file = mediaFiles[0];
            const rawUrl = file.file?.url || file.external?.url;
            if (rawUrl) {
                const ext = path.extname(file.name || '') || path.extname(rawUrl.split('?')[0]) || '.jpg';
                const prefix = sectionType.replace('_section', '');
                const filename = `${prefix}-${dbId.slice(0, 8)}${ext}`;
                data[fileProp.name] = await downloadImage(rawUrl, filename);
            }
        }
    }

    // Handle code block reading (e.g. html_code in html_section)
    for (const codeProp of getCodeBlockProperties(sectionType)) {
        const children = await fetchAllChildren(page.id);
        const codeBlocks = children
            .filter(b => b.type === 'code')
            .map(b => b.code.rich_text.map(t => t.plain_text).join(''));
        data[codeProp.name] = codeBlocks.join('\n');
    }

    return data;
}

// --- Section Processing ---

export async function processSectionsFromPage(pageId) {
    const sections = [];
    const childrenBlocks = await fetchAllChildren(pageId);
    const databases = childrenBlocks.filter(b => b.type === 'child_database');

    for (const dbBlock of databases) {
        const dbId = dbBlock.id;
        const dbTitle = dbBlock.child_database.title;

        console.log(`   > Processing: ${dbTitle}`);

        // Fetch database schema to check if section_type property exists
        const dbDetails = await fetchDatabaseDetails(dbId);
        const schemaProps = dbDetails.properties || {};

        // Read section_type from the first row of the database (not from schema)
        let sectionType = null;
        if (schemaProps['section_type'] || schemaProps['Section Type']) {
            const rows = await fetchAllDatabasePages(dbId);
            if (rows.length > 0) {
                const rowProps = rows[0].properties;
                sectionType = rowProps['section_type']?.select?.name || rowProps['Section Type']?.select?.name || null;
            }
        }

        let section = null;

        if (sectionType && SECTION_SCHEMA[sectionType]) {
            // Known section type — use generic fetcher
            const data = await fetchSectionData(sectionType, dbId);
            if (data) {
                section = { type: sectionType, id: dbId, title: data.title || dbTitle, ...data };
            }
        } else {
            // Fallback to property check (legacy/inference)
            if (schemaProps['collection_name']) {
                const data = await fetchSectionData('dynamic_section', dbId);
                if (data) section = { type: 'dynamic_section', id: dbId, title: data.title || dbTitle, ...data };
            } else if ((schemaProps['description'] && schemaProps['title']) || (schemaProps['Description'] && schemaProps['Title'])) {
                const data = await fetchSectionData('info_section', dbId);
                if (data) section = { type: 'info_section', id: dbId, title: dbTitle, ...data };
            } else {
                console.log(`     ! Unknown database type: ${dbTitle}`);
            }
        }

        if (section) sections.push(section);
    }

    return sections;
}
