
'use client';

import React, { useState } from 'react';
import { css } from '../styled-system/css';
import { GenericList } from './GenericList';
import { MoreHorizontal, List, Grid, Image as ImageIcon } from 'lucide-react';
// Wait, I am using PandaCSS, not Chakra UI.
// I should build a simple custom dropdown or use a lightweight accessible menu.
// Or just a simple state toggle if 3 options.
// Let's build a simple custom dropdown using standard HTML/CSS for now to avoid large deps if not present.
// Actually, I don't see Chakra in package.json. I shouldn't introduce it.

function ViewTypeMenu({ currentType, onSelect }: { currentType: string, onSelect: (t: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    // Simple outside click close logic omitted for brevity in this snippet, 
    // but in a real app use a hook like useOnClickOutside.
    // For now, toggle is fine.

    return (
        <div className={css({ position: 'relative' })}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={css({
                    p: '2',
                    borderRadius: 'md',
                    cursor: 'pointer',
                    _hover: { bg: 'bg.subtle' }
                })}
            >
                <MoreHorizontal size={20} />
            </button>

            {isOpen && (
                <div className={css({
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    mt: '2',
                    bg: 'bg.primary',
                    border: '1px solid token(colors.border)',
                    borderRadius: 'md',
                    boxShadow: 'lg',
                    zIndex: 100,
                    minWidth: '150px',
                    overflow: 'hidden'
                })}>
                    <div
                        onClick={() => { onSelect('list_view'); setIsOpen(false); }}
                        className={css({
                            px: '4', py: '2', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2',
                            bg: currentType === 'list_view' ? 'bg.subtle' : 'transparent',
                            _hover: { bg: 'bg.subtle' }
                        })}
                    >
                        <List size={16} /> List View
                    </div>
                    <div
                        onClick={() => { onSelect('minimal_list_view'); setIsOpen(false); }}
                        className={css({
                            px: '4', py: '2', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2',
                            bg: currentType === 'minimal_list_view' ? 'bg.subtle' : 'transparent',
                            _hover: { bg: 'bg.subtle' }
                        })}
                    >
                        <List size={16} /> Minimal List
                    </div>
                    <div
                        onClick={() => { onSelect('card_view'); setIsOpen(false); }}
                        className={css({
                            px: '4', py: '2', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2',
                            bg: currentType === 'card_view' ? 'bg.subtle' : 'transparent',
                            _hover: { bg: 'bg.subtle' }
                        })}
                    >
                        <Grid size={16} /> Card View
                    </div>
                    <div
                        onClick={() => { onSelect('grid_view'); setIsOpen(false); }}
                        className={css({
                            px: '4', py: '2', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2',
                            bg: currentType === 'grid_view' ? 'bg.subtle' : 'transparent',
                            _hover: { bg: 'bg.subtle' }
                        })}
                    >
                        <ImageIcon size={16} /> Grid View
                    </div>
                </div>
            )}
            {/* Backdrop to close */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className={css({ position: 'fixed', inset: 0, zIndex: 9 })}
                />
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
        <section className={css({ marginBottom: '16' })}>
            <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6' })}>
                <div>
                    <h2 className={css({ fontSize: '2xl', fontWeight: 'bold' })}>{title}</h2>
                    {description && (
                        <p className={css({ color: 'text.muted', fontSize: 'sm', marginTop: '1' })}>{description}</p>
                    )}
                </div>
                <ViewTypeMenu currentType={viewType} onSelect={setViewType} />
            </div>

            <GenericList items={items} viewType={viewType} />
        </section>
    );
}
