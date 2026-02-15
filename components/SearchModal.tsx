'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { css } from '@/styled-system/css';
import { Search } from 'lucide-react';
import Link from 'next/link';

interface SearchItem {
    slug: string;
    title: string;
    description: string;
    collection: string;
    tags?: string[];
}

interface SearchModalProps {
    items: SearchItem[];
    isOpen: boolean;
    onClose: () => void;
}

export function SearchModal({ items, isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [mounted, setMounted] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
        if (!isOpen) {
            setQuery('');
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const results = useMemo(() => {
        if (query.trim().length === 0) return [];
        const q = query.toLowerCase();
        return items.filter(item =>
            item.title.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.collection.toLowerCase().includes(q) ||
            (item.tags || []).some(t => t.toLowerCase().includes(q))
        ).slice(0, 20);
    }, [query, items]);

    if (!isOpen || !mounted) return null;

    const modalContent = (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={css({
                    position: 'fixed',
                    inset: 0,
                    bg: 'rgba(0,0,0,0.6)',
                    zIndex: 9998,
                    backdropFilter: 'blur(8px)',
                    animation: 'fadeIn 0.15s ease-out',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    pt: '15vh',
                })}
            >
                {/* Modal */}
                <div
                    onClick={(e) => e.stopPropagation()}
                    className={css({
                        width: '90%',
                        maxWidth: '540px',
                        maxHeight: '70vh',
                        bg: 'bg.primary',
                        border: '1px solid token(colors.border.default)',
                        borderRadius: '16px',
                        boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.4)',
                        zIndex: 9999,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        animation: 'scaleUp 0.15s ease-out',
                    })}
                >
                    {/* Search Input */}
                    <div className={css({
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        p: '16px',
                        borderBottom: '1px solid token(colors.border.default)',
                    })}>
                        <Search size={16} className={css({ color: 'text.tertiary', flexShrink: 0 })} />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search across all collections..."
                            className={css({
                                flex: 1,
                                bg: 'transparent',
                                border: 'none',
                                outline: 'none',
                                fontSize: '0.95rem',
                                color: 'text.primary',
                                _placeholder: { color: 'text.tertiary' },
                            })}
                        />
                        <kbd className={css({
                            fontSize: '0.7rem',
                            color: 'text.tertiary',
                            bg: 'bg.secondary',
                            px: '6px',
                            py: '2px',
                            borderRadius: '4px',
                            border: '1px solid token(colors.border.default)',
                            display: { base: 'none', sm: 'inline' },
                        })}>
                            ESC
                        </kbd>
                    </div>

                    {/* Results */}
                    <div className={css({
                        overflowY: 'auto',
                        flex: 1,
                        p: '8px',
                    })}>
                        {query.trim().length === 0 && (
                            <p className={css({ textAlign: 'center', color: 'text.tertiary', fontSize: '0.85rem', py: '32px' })}>
                                Type to search...
                            </p>
                        )}

                        {query.trim().length > 0 && results.length === 0 && (
                            <p className={css({ textAlign: 'center', color: 'text.tertiary', fontSize: '0.85rem', py: '32px' })}>
                                No results found for &ldquo;{query}&rdquo;
                            </p>
                        )}

                        {results.map((item) => (
                            <Link
                                key={`${item.collection}-${item.slug}`}
                                href={`/${item.collection}/${item.slug}`}
                                onClick={onClose}
                                className={css({
                                    display: 'block',
                                    p: '12px',
                                    borderRadius: '10px',
                                    transition: 'all 0.1s ease',
                                    textDecoration: 'none',
                                    _hover: { bg: 'bg.secondary' },
                                })}
                            >
                                <div className={css({ display: 'flex', alignItems: 'center', gap: '8px', mb: '2px' })}>
                                    <span className={css({
                                        fontSize: '0.7rem',
                                        bg: 'bg.tertiary',
                                        color: 'text.secondary',
                                        px: '6px',
                                        py: '2px',
                                        borderRadius: 'full',
                                        textTransform: 'capitalize',
                                        flexShrink: 0,
                                    })}>
                                        {item.collection}
                                    </span>
                                    <h4 className={css({ fontWeight: '600', fontSize: '0.875rem', truncate: true, color: 'text.primary' })}>
                                        {item.title}
                                    </h4>
                                </div>
                                {item.description && (
                                    <p className={css({ color: 'text.tertiary', fontSize: '0.8rem', lineClamp: 1, ml: '0' })}>
                                        {item.description}
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );

    return createPortal(modalContent, document.body);
}
