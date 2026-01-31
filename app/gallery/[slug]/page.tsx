import { getGalleryItem, getGalleryItems } from '@/lib/data';
import { css } from '@/styled-system/css';
import { notFound } from 'next/navigation';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import { flex, container } from '@/styled-system/patterns';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Metadata } from 'next';

export async function generateStaticParams() {
    const items = getGalleryItems();
    return items.map((item) => ({
        slug: item.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const item = getGalleryItem(slug);

    if (!item) {
        return {
            title: 'Image Not Found',
        };
    }

    return {
        title: item.name,
        openGraph: {
            title: item.name,
            images: item.image ? [{ url: item.image }] : [],
        },
    };
}

const mainContainerStyle = container({ maxWidth: '4xl', py: '60px' });

const backLinkStyle = flex({
    align: 'center',
    gap: '8px',
    color: 'text.secondary',
    mb: '30px',
    _hover: { color: 'primary' },
});

const imageContainerStyle = css({
    mb: '40px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
    border: '1px solid token(colors.border.default)',
});

const imageStyle = css({
    width: '100%',
    height: 'auto',
    display: 'block',
});

const headerContainerStyle = css({ mb: '30px' });

const titleStyle = css({
    fontSize: { base: '2rem', md: '3rem' },
    fontWeight: '800',
    lineHeight: '1.2',
    mb: '16px',
    color: 'text.primary',
});

const buttonStyle = css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    bg: 'text.primary', // Inverted
    color: 'bg.primary',
    px: '20px',
    py: '12px',
    borderRadius: '8px',
    fontWeight: '600',
    transition: 'opacity 0.2s',
    _hover: {
        opacity: 0.9,
    },
});

const contentStyle = css({
    '& > *': { mb: '20px' },
    '& h1': {
        fontSize: '2rem',
        fontWeight: 'bold',
        mt: '40px',
        mb: '20px',
        color: 'text.primary',
    },
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
    '& ul': {
        pl: '20px',
        ml: '20px',
        mb: '20px',
        listStyleType: 'disc',
    },
    '& ol': {
        pl: '20px',
        ml: '20px',
        mb: '20px',
        listStyleType: 'decimal',
    },
    '& li': {
        mb: '8px',
        color: 'text.primary',
        fontSize: '1.1rem',
        lineHeight: '1.8',
    },
    '& a': {
        color: 'primary',
        textDecoration: 'underline',
        _hover: { opacity: 0.8 },
    },
});

export default async function GalleryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const item = getGalleryItem(slug);

    if (!item) {
        notFound();
    }

    let contentHtml = '';
    if (item.content) {
        const processedContent = await unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkHtml)
            .process(item.content);
        contentHtml = processedContent.toString();
    }

    return (
        <main className={mainContainerStyle}>
            <Link
                href="/"
                className={backLinkStyle}
            >
                <ArrowLeft size={20} />
                Back to Gallery
            </Link>

            <article>
                <div className={imageContainerStyle}>
                    <Image
                        src={item.image}
                        alt={item.name}
                        width={1000}
                        height={1000}
                        priority
                        className={imageStyle}
                    />
                </div>

                <div className={headerContainerStyle}>
                    <h1 className={titleStyle}>
                        {item.name}
                    </h1>
                </div>

                {item.link && (
                    <div className={css({ mb: '40px' })}>
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                            className={buttonStyle}
                        >
                            <ExternalLink size={18} />
                            Visit Externally
                        </a>
                    </div>
                )}

                {contentHtml && (
                    <div
                        className={contentStyle}
                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                )}
            </article>
        </main>
    );
}
