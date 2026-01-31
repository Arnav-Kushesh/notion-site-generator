import { MetadataRoute } from 'next';
import { getNavbarPages, getPosts } from '@/lib/data';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // 1. Static Pages
    const pages = getNavbarPages().map((page) => ({
        url: `${baseUrl}/${page.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    // 2. Projects
    const projects = getPosts('projects').map((project) => ({
        url: `${baseUrl}/project/${project.slug}`,
        lastModified: new Date(project.date || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // 3. Blogs
    const blogs = getPosts('blogs').map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: new Date(blog.date || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // 4. Root
    const root = {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    };

    return [root, ...pages, ...projects, ...blogs];
}
