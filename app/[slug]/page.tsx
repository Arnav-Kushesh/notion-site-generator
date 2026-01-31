import { getNavbarPages, getPost } from '@/lib/data';
import { css } from '@/styled-system/css';
import { notFound } from 'next/navigation';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import { container } from '@/styled-system/patterns';

import { Metadata } from 'next';

export async function generateStaticParams() {
    const pages = getNavbarPages();
    return pages.map((page) => ({
        slug: page.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const page = getPost(slug, 'navbarPages');

    if (!page) {
        return {
            title: 'Page Not Found',
        };
    }

    return {
        title: page.title,
        description: page.description || `${page.title} - Notion Portfolio`,
    };
}

export default async function GenericPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = getPost(slug, 'navbarPages');

    if (!page) {
        notFound();
    }

    const processedContent = await unified()
        .use(remarkParse)
        .use(remarkHtml)
        .process(page.content);
    const contentHtml = processedContent.toString();

    return (
        <main className={container({ maxWidth: '4xl', py: '60px' })}>
            <article>
                <div className={css({ mb: '40px' })}>
                    <h1
                        className={css({
                            fontSize: { base: '2.5rem', md: '3.5rem' },
                            fontWeight: '800',
                            lineHeight: '1.2',
                            mb: '16px',
                            color: 'text.primary',
                        })}
                    >
                        {page.title}
                    </h1>
                </div>

                <div
                    className={css({
                        '& > *': { mb: '20px' },
                        '& h2': {
                            fontSize: '1.8rem',
                            fontWeight: 'bold',
                            mt: '40px',
                            mb: '20px',
                            color: 'text.primary',
                        },
                        '& h3': {
                            fontSize: '1.4rem',
                            fontWeight: 'bold',
                            mt: '30px',
                            mb: '16px',
                            color: 'text.primary',
                        },
                        '& p': {
                            fontSize: '1.1rem',
                            lineHeight: '1.8',
                            color: 'text.primary',
                        },
                        '& ul, & ol': {
                            pl: '20px',
                            ml: '20px',
                            mb: '20px',
                            listStyleType: 'disc',
                            color: 'text.primary',
                        },
                        '& li': {
                            mb: '8px',
                        },
                        '& a': {
                            color: 'primary',
                            textDecoration: 'underline',
                            _hover: { opacity: 0.8 },
                        },
                        '& img': {
                            borderRadius: '8px',
                            maxWidth: '100%',
                            height: 'auto',
                        }
                    })}
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
            </article>
        </main>
    );
}
