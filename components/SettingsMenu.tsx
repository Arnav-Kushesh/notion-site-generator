'use client';

import { MoreHorizontal, MoreVertical, Check, Layout, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { css } from '@/styled-system/css';
import { useGlobalConfig } from '@/components/providers/GlobalConfigProvider';

export function SettingsMenu({ variant = 'horizontal' }: { variant?: 'horizontal' | 'vertical' }) {
    const { colorMode, setColorMode, availableThemes, showSidebar, toggleSidebar } = useGlobalConfig();
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
        pink: '#4c1d95',
        red: '#450a0a',
        green: '#064e3b',
        brown: '#431407',
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
                    maxWidth: '380px',
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
                    p: '20px',
                    borderBottom: '1px solid token(colors.border.default)',
                })}>
                    <h2 className={css({ fontSize: '1rem', fontWeight: '600' })}>Settings</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className={css({
                            p: '6px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: 'text.tertiary',
                            bg: 'transparent',
                            border: 'none',
                            _hover: { bg: 'bg.secondary', color: 'text.primary' },
                        })}
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className={css({ p: '20px', display: 'flex', flexDirection: 'column', gap: '24px' })}>
                    {/* Layout Section */}
                    <div>
                        <h3 className={css({ fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', color: 'text.tertiary', mb: '10px', letterSpacing: '0.05em' })}>
                            Layout
                        </h3>
                        <div
                            onClick={toggleSidebar}
                            className={css({
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: '12px',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                bg: 'bg.secondary',
                                border: '1px solid transparent',
                                transition: 'all 0.15s ease',
                                _hover: { borderColor: 'border.default' },
                            })}
                        >
                            <div className={css({ display: 'flex', alignItems: 'center', gap: '10px' })}>
                                <Layout size={16} className={css({ color: 'text.secondary' })} />
                                <span className={css({ fontWeight: '500', fontSize: '0.875rem' })}>Sidebar</span>
                            </div>
                            <div className={css({
                                w: '40px',
                                h: '22px',
                                bg: showSidebar ? 'primary' : 'bg.tertiary',
                                borderRadius: 'full',
                                position: 'relative',
                                transition: 'background 0.2s',
                            })}>
                                <div className={css({
                                    w: '18px',
                                    h: '18px',
                                    bg: 'white',
                                    borderRadius: 'full',
                                    position: 'absolute',
                                    top: '2px',
                                    left: showSidebar ? '20px' : '2px',
                                    transition: 'left 0.2s',
                                    shadow: 'sm',
                                })} />
                            </div>
                        </div>
                    </div>

                    {/* Theme Section */}
                    <div>
                        <h3 className={css({ fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', color: 'text.tertiary', mb: '10px', letterSpacing: '0.05em' })}>
                            Theme
                        </h3>
                        <div className={css({
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '10px',
                        })}>
                            {availableThemes.map((theme) => (
                                <button
                                    key={theme}
                                    onClick={() => handleThemeChange(theme)}
                                    className={css({
                                        aspectRatio: 'square',
                                        borderRadius: '10px',
                                        border: '2px solid',
                                        borderColor: colorMode === theme ? 'primary' : 'transparent',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.15s ease',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        bg: 'transparent',
                                        _hover: { transform: 'scale(1.08)' },
                                    })}
                                    title={theme.charAt(0).toUpperCase() + theme.slice(1)}
                                >
                                    <div
                                        className={css({ position: 'absolute', inset: 0, borderRadius: '8px' })}
                                        style={{ backgroundColor: themeColors[theme] || '#888' }}
                                    />
                                    {colorMode === theme && (
                                        <div className={css({
                                            position: 'relative',
                                            zIndex: 1,
                                            bg: 'rgba(0,0,0,0.25)',
                                            borderRadius: 'full',
                                            p: '2px',
                                        })}>
                                            <Check size={14} color="white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
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
