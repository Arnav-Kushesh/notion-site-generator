
import { getNavbarPages, getNavbarPage } from '@/lib/data';
import { processMarkdown } from '@/lib/markdown';
import { postContentStyle } from '@/components/shared/post-styles';
import { notFound } from 'next/navigation';
import { css } from '@/styled-system/css';
import { Metadata } from 'next';

export const dynamicParams = false;

// Generate params for Navbar Pages
export async function generateStaticParams() {
    const pages = getNavbarPages();
    return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    // We treat this as a generic page from navbarPages
    const post = getNavbarPage(slug);
    if (!post) return {};
    return {
        title: post.title,
        description: post.description,
    };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getNavbarPage(slug);

    if (!post) {
        notFound();
    }

    const content = await processMarkdown(post.content);

    return (
        <article className={css({ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', minHeight: '60vh' })}>
            <header className={css({ marginBottom: '40px', textAlign: 'center' })}>
                <h1 className={css({ fontSize: '4xl', fontWeight: 'bold', marginBottom: '4' })}>
                    {post.title}
                </h1>
            </header>

            <div
                className={postContentStyle}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </article>
    );
}
