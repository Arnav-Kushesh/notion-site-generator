import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'notion_state/content');
const dataDirectory = path.join(process.cwd(), 'notion_state/data');

// Re-export specific interfaces if needed for cleaner imports
export interface HeroConfig {
    tagline: string;
    long_bio: string;
    profile_image: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
    email?: string;
    instagram?: string;
    youtube?: string;
    facebook?: string;
    twitch?: string;
    alignment?: 'left' | 'center';
}

export interface BlogsConfig {
    title: string;
    show_section: string;
    view_type: string;
    show_images?: boolean | string;
}

export interface InfoConfig {
    title: string;
    description: string;
    logo?: string;
    favicon: string;
    keywords: string;
    og_image: string;
    sidebar_navigation?: string;
    tagline?: string;
    default_theme?: 'light' | 'dark' | 'system';
    default_color_mode?: string; // allow any string for theming
    disable_logo_in_sidebar?: string;
    disable_logo_in_topbar?: string;
    social_github?: string;
    social_twitter?: string;
    social_linkedin?: string;
    social_email?: string;
    social_instagram?: string;
    social_youtube?: string;
    social_facebook?: string;
    social_twitch?: string;
}

export interface InfoSectionData {
    type: 'info_section';
    id: string;
    title: string;
    description: string;
    link?: string;
    image?: string;
    view_type?: 'col_centered_view' | 'col_left_view' | 'row_reverse_view' | 'row_view';
}

export interface DynamicSectionData {
    type: 'dynamic_section';
    id: string;
    title: string;
    collection_name: string;
    view_type?: 'list_view' | 'card_view' | 'grid_view' | 'minimal_list_view';
}

export type SectionData = InfoSectionData | DynamicSectionData;

export interface HomeData {
    info?: InfoConfig;
    sections: SectionData[];
}

export interface Post {
    slug: string;
    title: string;
    date: string;
    description: string;
    content: string;
    cover?: {
        image?: string;
        alt?: string;
    };
    thumbnail?: string; // For projects
    image?: string; // Generic image field
    link?: string; // For external project links
    tools?: string; // For projects
    collection?: string; // Collection name
    order?: number; // Sort order
    tags?: string[] | any[]; // Tags
}

export interface GalleryItem {
    slug: string;
    name: string;
    image: string;
    link?: string;
    content?: string;
}

export function getHomeData(): HomeData {
    const fullPath = path.join(dataDirectory, 'home.json');
    if (fs.existsSync(fullPath)) {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const homeData = JSON.parse(fileContents);

        // Load side-wide info as well which might be in a separate file or merged
        const sitePath = path.join(dataDirectory, 'site.json');
        if (fs.existsSync(sitePath)) {
            const siteFile = fs.readFileSync(sitePath, 'utf8');
            const siteData = JSON.parse(siteFile);
            return { ...homeData, ...siteData };
        }
        return homeData;
    }
    return {} as HomeData;
}

export function getGalleryItems(): GalleryItem[] {
    const dirPath = path.join(contentDirectory, 'gallery');
    if (!fs.existsSync(dirPath)) return [];

    const fileNames = fs.readdirSync(dirPath);
    return fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, '');
            const fullPath = path.join(dirPath, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data } = matter(fileContents);

            return {
                slug,
                name: data.name,
                image: data.image,
                link: data.link,
                order: data.order || 0,
            };
        })
        .sort((a, b) => {
            if (a.order !== b.order) {
                return a.order - b.order;
            }
            return a.name.localeCompare(b.name);
        });
}

// Generic getPosts (can be used for any collection)
export function getPosts(section: string): Post[] {
    const dirPath = path.join(contentDirectory, section);
    if (!fs.existsSync(dirPath)) return [];

    const fileNames = fs.readdirSync(dirPath);
    const allPosts = fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, '');
            const fullPath = path.join(dirPath, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            return {
                slug,
                content,
                title: data.title,
                date: data.date ? new Date(data.date).toISOString() : '',
                description: data.description || data.summary || '',
                tools: data.tools || '',
                cover: data.cover,
                thumbnail: data.thumbnail,
                image: data.image,
                link: data.link,
                collection: section,
                ...data,
            } as Post;
        });

    // Sort posts by date
    return allPosts.sort((a, b) => {
        // Sort by order if available
        if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
        }
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getPost(slug: string, section: string): Post | null {
    const dirPath = path.join(contentDirectory, section);
    const fullPath = path.join(dirPath, `${slug}.md`);

    console.log(`[getPost] Checking path: ${fullPath}`);

    if (!fs.existsSync(fullPath)) {
        console.log(`[getPost] File does not exist: ${fullPath}`);
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
        slug,
        content,
        title: data.title,
        date: data.date ? new Date(data.date).toISOString() : '',
        description: data.description || data.summary || '',
        tools: data.tools || '',
        cover: data.cover,
        thumbnail: data.thumbnail,
        link: data.link,
        ...data,
    } as Post;
}

export function getGalleryItem(slug: string): GalleryItem | null {
    const dirPath = path.join(contentDirectory, 'gallery');
    const fullPath = path.join(dirPath, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
        slug,
        name: data.name,
        image: data.image,
        link: data.link,
        content, // Include content
    };
}

export function getNavbarPages(): { slug: string; title: string }[] {
    const pagesDir = path.join(contentDirectory, 'navbarPages');
    // Pages are in the 'navbarPages' subdirectory
    if (!fs.existsSync(pagesDir)) return [];

    const fileNames = fs.readdirSync(pagesDir);
    return fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, '');
            const fullPath = path.join(pagesDir, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data } = matter(fileContents);

            return {
                slug,
                title: data.title,
            };
        });
}

export function getNavbarPage(slug: string): Post | null {
    const dirPath = path.join(contentDirectory, 'navbarPages');
    const fullPath = path.join(dirPath, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
        slug,
        content,
        title: data.title,
        date: data.date ? new Date(data.date).toISOString() : '',
        description: data.description || '',
        ...data,
    } as Post;
}
