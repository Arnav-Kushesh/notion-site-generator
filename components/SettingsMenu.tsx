
'use client';

import { MoreHorizontal, MoreVertical, Check, Layout, Palette, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
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

    // Lock scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const themeColors: Record<string, string> = {
        light: '#ffffff',
        dark: '#121212',
        blue: '#1e3a8a',
        pink: '#be185d',
        red: '#b91c1c',
        green: '#047857',
        brown: '#431407',
    };

    const handleThemeChange = (theme: string) => {
        setColorMode(theme);
    };

    const modalContent = (
        <div className={css({
            position: 'fixed',
            inset: 0,
            zIndex: 9999, // Highest z-index
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bg: 'rgba(0,0,0,0.5)', // Backdrop
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease-out'
        })}>
            <div
                className={css({
                    bg: 'bg.primary',
                    width: '90%',
                    maxWidth: '400px',
                    borderRadius: '2xl',
                    boxShadow: '2xl',
                    border: '1px solid token(colors.border.subtle)',
                    overflow: 'hidden',
                    animation: 'scaleUp 0.2s ease-out',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                })}
            >
                {/* Header */}
                <div className={css({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: '20px',
                    borderBottom: '1px solid token(colors.border.subtle)'
                })}>
                    <h2 className={css({ fontSize: 'xl', fontWeight: 'bold' })}>Settings</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className={css({ p: '2', borderRadius: 'full', cursor: 'pointer', _hover: { bg: 'bg.subtle' } })}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className={css({ p: '20px' })}>
                    {/* Layout Section */}
                    <div className={css({ mb: '24px' })}>
                        <h3 className={css({ fontSize: 'xs', fontWeight: 'bold', textTransform: 'uppercase', color: 'text.muted', mb: '12px' })}>
                            Layout
                        </h3>
                        <div
                            onClick={toggleSidebar}
                            className={css({
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: '3',
                                borderRadius: 'xl',
                                cursor: 'pointer',
                                bg: 'bg.subtle',
                                border: '1px solid transparent',
                                transition: 'all 0.2s',
                                _hover: { borderColor: 'border.active' }
                            })}
                        >
                            <div className={css({ display: 'flex', alignItems: 'center', gap: '3' })}>
                                <Layout size={18} />
                                <span className={css({ fontWeight: 'medium' })}>Show Sidebar</span>
                            </div>
                            <div className={css({
                                w: '44px',
                                h: '24px',
                                bg: showSidebar ? 'green.500' : 'bg.muted',
                                borderRadius: 'full',
                                position: 'relative',
                                transition: 'background 0.2s'
                            })}>
                                <div className={css({
                                    w: '20px',
                                    h: '20px',
                                    bg: 'white',
                                    borderRadius: 'full',
                                    position: 'absolute',
                                    top: '2px',
                                    left: showSidebar ? '22px' : '2px',
                                    transition: 'left 0.2s',
                                    shadow: 'sm'
                                })} />
                            </div>
                        </div>
                    </div>

                    {/* Theme Section */}
                    <div>
                        <h3 className={css({ fontSize: 'xs', fontWeight: 'bold', textTransform: 'uppercase', color: 'text.muted', mb: '12px' })}>
                            Theme
                        </h3>
                        <div className={css({
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '12px'
                        })}>
                            {availableThemes.map((theme) => (
                                <button
                                    key={theme}
                                    onClick={() => handleThemeChange(theme)}
                                    className={css({
                                        aspectRatio: 'square',
                                        borderRadius: 'xl',
                                        border: '2px solid',
                                        borderColor: colorMode === theme ? 'text.primary' : 'transparent',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        _hover: { transform: 'scale(1.05)' }
                                    })}
                                    title={theme}
                                >
                                    <div
                                        className={css({ position: 'absolute', inset: 0 })}
                                        style={{ backgroundColor: themeColors[theme] || '#888' }}
                                    />
                                    {colorMode === theme && (
                                        <div className={css({
                                            position: 'relative',
                                            zIndex: 1,
                                            bg: 'rgba(0,0,0,0.2)',
                                            borderRadius: 'full',
                                            p: '1'
                                        })}>
                                            <Check size={16} color="white" />
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
                    p: '2',
                    borderRadius: 'full',
                    color: 'text.secondary',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    bg: 'transparent',
                    _hover: { color: 'text.primary', bg: 'bg.subtle' }
                })}
                aria-label="Settings"
            >
                {variant === 'vertical' ? <MoreVertical size={20} /> : <MoreHorizontal size={20} />}
            </button>
            {mounted && isOpen && createPortal(modalContent, document.body)}
        </>
    );
}
