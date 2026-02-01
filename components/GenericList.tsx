
'use client';

import React from 'react';
import Link from 'next/link';
import { css } from '../styled-system/css';
import { Post, GalleryItem } from '../lib/data';
import { format } from 'date-fns';
import { ArrowUpRight } from 'lucide-react';

interface GenericListProps {
    items: (Post | GalleryItem)[];
    viewType: string;
}

export function GenericList({ items, viewType }: GenericListProps) {
    if (viewType === 'grid_view') {
        return (
            <div className={css({
                display: 'grid',
                gridTemplateColumns: { base: 'repeat(auto-fill, minmax(300px, 1fr))', lg: 'repeat(3, 1fr)' },
                gap: '8',
                width: '100%' // Ensure grid takes full width
            })}>
                {items.map((item) => (
                    <Link
                        key={item.slug}
                        href={`/${(item as Post).collection || 'gallery'}/${item.slug}`}
                        className={css({
                            display: 'block',
                            position: 'relative',
                            aspectRatio: 'square',
                            borderRadius: 'xl',
                            overflow: 'hidden',
                            boxShadow: 'md',
                            transition: 'all 0.3s ease',
                            _hover: { transform: 'scale(1.02)', boxShadow: 'lg' }
                        })}
                    >
                        <img
                            src={item.image}
                            alt={(item as any).name || (item as any).title}
                            className={css({ width: '100%', height: '100%', objectFit: 'cover' })}
                        />
                        <div className={css({
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: '4',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                            color: 'white'
                        })}>
                            <h3 className={css({ fontWeight: 'bold', fontSize: 'lg' })}>
                                {(item as any).name || (item as any).title}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>
        );
    }

    if (viewType === 'card_view') {
        return (
            <div className={css({
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '6',
                // max 2 columns logic handled by grid auto-fill approx 
                // or specific media queries if strict 2-col needed
                lg: { gridTemplateColumns: 'repeat(3, 1fr)' },
                width: '100%'
            })}>
                {items.map((item) => {
                    const post = item as Post;

                    return (
                        <Link
                            key={post.slug}
                            href={`/${post.collection}/${post.slug}`}
                            className={css({
                                display: 'block',
                                borderRadius: 'xl',
                                bg: 'bg.subtle',
                                border: '1px solid token(colors.border)',
                                overflow: 'hidden',
                                transition: 'all 0.2s',
                                _hover: { borderColor: 'primary', transform: 'translateY(-2px)' }
                            })}
                        >
                            {post.thumbnail && (
                                <div className={css({ aspectRatio: '16/9', overflow: 'hidden' })}>
                                    <img
                                        src={post.thumbnail}
                                        alt={post.title}
                                        className={css({ width: '100%', height: '100%', objectFit: 'cover' })}
                                    />
                                </div>
                            )}
                            <div className={css({ padding: '6' })}>
                                <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: '2' })}>
                                    <h3 className={css({ fontWeight: 'bold', fontSize: 'xl' })}>{post.title}</h3>
                                </div>
                                <p className={css({ color: 'text.muted', fontSize: 'sm', lineClamp: 2, mb: '4' })}>
                                    {post.description}
                                </p>
                                {post.tags && (
                                    <div className={css({ display: 'flex', gap: '2', flexWrap: 'wrap' })}>
                                        {Array.isArray(post.tags) ? post.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className={css({ fontSize: 'xs', bg: 'bg.canvas', px: '2', py: '1', borderRadius: 'md', border: '1px solid token(colors.border)' })}>
                                                {typeof tag === 'object' ? (tag as any).name : tag}
                                            </span>
                                        )) : null}
                                    </div>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        );
    }

    // Default: List View (minimal_list_view or list_view)
    const isMinimal = viewType === 'minimal_list_view';

    return (
        <div className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
            {items.map((item) => {
                const post = item as Post;
                return (
                    <Link
                        key={post.slug}
                        href={`/${post.collection}/${post.slug}`}
                        className={css({
                            display: 'flex',
                            flexDirection: { base: 'column', sm: 'row' },
                            gap: '4',
                            padding: '4',
                            borderRadius: 'lg',
                            border: '1px solid token(colors.border.subtle)',
                            bg: 'bg.subtle',
                            shadow: 'sm',
                            transition: 'all 0.2s',
                            _hover: { bg: 'bg.muted', borderColor: 'border.default', shadow: 'md', transform: 'translateY(-2px)' }
                        })}
                    >
                        {!isMinimal && post.image && (
                            <div className={css({
                                width: { base: '100%', sm: '120px' },
                                height: { base: '200px', sm: '80px' },
                                flexShrink: 0,
                                borderRadius: 'md',
                                overflow: 'hidden'
                            })}>
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className={css({ width: '100%', height: '100%', objectFit: 'cover' })}
                                />
                            </div>
                        )}

                        <div className={css({ flex: 1, minWidth: 0 })}>
                            <div className={css({ display: 'flex', alignItems: 'center', gap: '2', mb: '1' })}>
                                <h3 className={css({ fontWeight: 'bold', fontSize: 'lg', truncate: true })}>{post.title}</h3>
                            </div>
                            <p className={css({ color: 'text.muted', fontSize: 'sm', lineClamp: 2 })}>{post.description}</p>
                        </div>
                        <div className={css({
                            fontSize: 'sm',
                            color: 'text.muted',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            flexDirection: { base: 'row', sm: 'column' },
                            alignItems: { base: 'center', sm: 'flex-end' },
                            gap: { base: '2', sm: '0' }
                        })}>
                            {post.date && format(new Date(post.date), 'MMM d, yyyy')}
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
