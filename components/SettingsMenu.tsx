'use client';

import { MoreHorizontal, MoreVertical, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { css } from '@/styled-system/css';
import { useGlobalConfig, LIGHT_THEMES, DARK_THEMES } from '@/components/providers/GlobalConfigProvider';

export function SettingsMenu({ variant = 'horizontal' }: { variant?: 'horizontal' | 'vertical' }) {
    const { colorMode, setColorMode, availableThemes } = useGlobalConfig();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const themeColors: Record<string, string> = {
        light: '#f5f5f7',
        dark: '#1a1a1a',
        blue: '#1E293B',
        purple: '#4c1d95',
        pink: '#FFE0ED',
        red: '#450a0a',
        green: '#064e3b',
        cream: '#FFF8EC',
    };

    const handleThemeChange = (theme: string) => {
        setColorMode(theme);
    };

    const modalContent = (
        <div
            onClick={() => setIsOpen(false)}
            className={css({
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bg: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(4px)',
                animation: 'fadeIn 0.15s ease-out',
            })}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={css({
                    bg: 'bg.primary',
                    width: '90%',
                    maxWidth: '340px',
                    borderRadius: '16px',
                    boxShadow: '2xl',
                    border: '1px solid token(colors.border.default)',
                    overflow: 'hidden',
                    animation: 'scaleUp 0.15s ease-out',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                })}
            >
                {/* Header */}
                <div className={css({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: '16px 20px',
                    borderBottom: '1px solid token(colors.border.default)',
                })}>
                    <h2 className={css({ fontSize: '0.9rem', fontWeight: '600' })}>Settings</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className={css({
                            p: '4px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: 'text.tertiary',
                            bg: 'transparent',
                            border: 'none',
                            _hover: { bg: 'bg.secondary', color: 'text.primary' },
                        })}
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className={css({ p: '16px 20px' })}>
                    {/* Theme Section */}
                    <div>
                        {[{ label: 'Light', themes: LIGHT_THEMES }, { label: 'Dark', themes: DARK_THEMES }].map(({ label, themes }) => (
                            <div key={label} className={css({ mb: '14px' })}>
                                <h3 className={css({ fontSize: '0.65rem', fontWeight: '600', textTransform: 'uppercase', color: 'text.tertiary', mb: '10px', letterSpacing: '0.05em' })}>
                                    {label}
                                </h3>
                                <div className={css({
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))',
                                    gap: '8px',
                                })}>
                                    {themes.map((theme) => (
                                        <button
                                            key={theme}
                                            onClick={() => handleThemeChange(theme)}
                                            className={css({
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '4px',
                                                cursor: 'pointer',
                                                bg: 'transparent',
                                                border: 'none',
                                                p: '0',
                                                transition: 'all 0.15s ease',
                                                _hover: { transform: 'scale(1.08)' },
                                            })}
                                            title={theme.charAt(0).toUpperCase() + theme.slice(1)}
                                        >
                                            <div
                                                className={css({
                                                    w: '32px',
                                                    h: '32px',
                                                    borderRadius: '8px',
                                                    border: '2px solid',
                                                    borderColor: colorMode === theme ? 'primary' : 'transparent',
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                                                })}
                                            >
                                                <div
                                                    className={css({ position: 'absolute', inset: 0, borderRadius: '6px' })}
                                                    style={{ backgroundColor: themeColors[theme] || '#888' }}
                                                />
                                                {colorMode === theme && (
                                                    <div className={css({
                                                        position: 'relative',
                                                        zIndex: 1,
                                                        bg: 'rgba(0,0,0,0.25)',
                                                        borderRadius: 'full',
                                                        p: '1px',
                                                    })}>
                                                        <Check size={10} color="white" />
                                                    </div>
                                                )}
                                            </div>
                                            <span className={css({
                                                fontSize: '0.55rem',
                                                color: colorMode === theme ? 'text.primary' : 'text.tertiary',
                                                fontWeight: colorMode === theme ? '600' : '400',
                                                textTransform: 'capitalize',
                                            })}>
                                                {theme}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={css({
                    p: '6px',
                    borderRadius: '8px',
                    color: 'text.tertiary',
                    transition: 'all 0.15s ease',
                    cursor: 'pointer',
                    bg: 'transparent',
                    border: 'none',
                    _hover: { color: 'text.primary', bg: 'bg.secondary' },
                })}
                aria-label="Settings"
            >
                {variant === 'vertical' ? <MoreVertical size={18} /> : <MoreHorizontal size={18} />}
            </button>
            {mounted && isOpen && createPortal(modalContent, document.body)}
        </>
    );
}
