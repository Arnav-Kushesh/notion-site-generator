'use client';

import { MoreHorizontal, Check } from 'lucide-react'; // Using MoreHorizontal for 3-dots
import { useState, useRef, useEffect } from 'react';
import { css } from '@/styled-system/css';
import { useGlobalConfig } from '@/components/providers/GlobalConfigProvider';

export function ThemeToggle() {
    const { colorMode, setColorMode, availableThemes } = useGlobalConfig();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={containerRef} className={css({ position: 'relative' })}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={css({
                    p: '8px',
                    borderRadius: 'full',
                    color: 'text.secondary',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    bg: isOpen ? 'bg.secondary' : 'transparent',
                    _hover: {
                        bg: 'bg.secondary',
                        color: 'text.primary',
                    },
                })}
                aria-label="Toggle theme"
            >
                <MoreHorizontal size={20} />
            </button>

            {isOpen && (
                <div className={css({
                    position: 'absolute',
                    top: '100%', // Open downwards
                    right: 0, // Align to right edge
                    mt: '8px',
                    bg: 'bg.primary',
                    border: '1px solid token(colors.border.default)',
                    borderRadius: '8px',
                    p: '8px',
                    shadow: 'lg',
                    zIndex: 100,
                    width: '160px',
                    maxH: '300px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                })}>
                    {availableThemes.map((theme) => (
                        <button
                            key={theme}
                            onClick={() => {
                                setColorMode(theme);
                                setIsOpen(false);
                            }}
                            className={css({
                                textAlign: 'left',
                                px: '8px',
                                py: '6px',
                                fontSize: '0.9rem',
                                borderRadius: '4px',
                                color: colorMode === theme ? 'text.primary' : 'text.secondary',
                                bg: colorMode === theme ? 'bg.secondary' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                _hover: {
                                    bg: 'bg.secondary',
                                    color: 'text.primary',
                                }
                            })}
                        >
                            <span style={{ textTransform: 'capitalize' }}>{theme}</span>
                            {colorMode === theme && <Check size={14} />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
