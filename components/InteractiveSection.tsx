'use client';

import React, { useState, useEffect, useRef } from 'react';
import { css } from '../styled-system/css';
import { GenericList } from './GenericList';
import { MoreHorizontal, List, Grid, Image as ImageIcon, LayoutList } from 'lucide-react';

function ViewTypeMenu({ currentType, onSelect }: { currentType: string, onSelect: (t: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const options = [
        { key: 'list_view', label: 'List', icon: <List size={15} /> },
        { key: 'minimal_list_view', label: 'Minimal', icon: <LayoutList size={15} /> },
        { key: 'card_view', label: 'Cards', icon: <Grid size={15} /> },
        { key: 'grid_view', label: 'Grid', icon: <ImageIcon size={15} /> },
    ];

    return (
        <div ref={containerRef} className={css({ position: 'relative' })}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={css({
                    p: '6px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    color: 'text.tertiary',
                    bg: 'transparent',
                    border: 'none',
                    transition: 'all 0.15s ease',
                    _hover: { color: 'text.primary', bg: 'bg.secondary' },
                })}
                aria-label="Change view type"
            >
                <MoreHorizontal size={18} />
            </button>

            {isOpen && (
                <div className={css({
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    mt: '6px',
                    bg: 'bg.primary',
                    border: '1px solid token(colors.border.default)',
                    borderRadius: '10px',
                    boxShadow: 'lg',
                    zIndex: 100,
                    minWidth: '160px',
                    overflow: 'hidden',
                    py: '4px',
                    animation: 'slideDown 0.15s ease-out',
                })}>
                    {options.map(({ key, label, icon }) => (
                        <button
                            key={key}
                            onClick={() => { onSelect(key); setIsOpen(false); }}
                            className={css({
                                w: '100%',
                                px: '12px',
                                py: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                fontSize: '0.85rem',
                                fontWeight: currentType === key ? '600' : '400',
                                color: currentType === key ? 'text.primary' : 'text.secondary',
                                bg: currentType === key ? 'bg.secondary' : 'transparent',
                                border: 'none',
                                transition: 'all 0.1s ease',
                                _hover: { bg: 'bg.secondary', color: 'text.primary' },
                            })}
                        >
                            {icon}
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

interface InteractiveSectionProps {
    title: string;
    description?: string;
    items: any[];
    initialViewType: string;
}

export function InteractiveSection({ title, description, items, initialViewType }: InteractiveSectionProps) {
    const [viewType, setViewType] = useState(initialViewType);

    return (
        <section className={css({ mb: '40px' })}>
            <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '24px' })}>
                <div>
                    <h2 className={css({ fontSize: '1.5rem', fontWeight: '700', color: 'text.primary', letterSpacing: '-0.02em' })}>
                        {title}
                    </h2>
                    {description && (
                        <p className={css({ color: 'text.secondary', fontSize: '0.875rem', mt: '4px' })}>{description}</p>
                    )}
                </div>
                <ViewTypeMenu currentType={viewType} onSelect={setViewType} />
            </div>

            <GenericList items={items} viewType={viewType} />
        </section>
    );
}
