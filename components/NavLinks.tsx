'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { css } from '@/styled-system/css';
import { createPortal } from 'react-dom';
import { Menu, X } from 'lucide-react';

interface NavLinksProps {
    pages: { slug: string; title: string }[];
    mobileExtra?: React.ReactNode;
}

const linkStyle = (isActive: boolean) => css({
    color: 'text.primary',
    fontSize: '0.875rem',
    fontWeight: isActive ? '600' : '500',
    transition: 'all 0.2s',
    px: '10px',
    py: '6px',
    borderRadius: '6px',
    bg: isActive ? 'bg.secondary' : 'transparent',
    _hover: {
        bg: 'bg.secondary',
    },
});

export function NavLinks({ pages, mobileExtra }: NavLinksProps) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [mobileOpen]);

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    const mobileLinkStyle = (active: boolean) => css({
        fontSize: '1.05rem',
        fontWeight: active ? '600' : '500',
        color: 'text.primary',
        py: '12px',
        px: '16px',
        borderRadius: '10px',
        bg: active ? 'bg.secondary' : 'transparent',
        transition: 'all 0.15s ease',
        textAlign: 'left',
        _hover: { bg: 'bg.secondary' },
    });

    const mobileMenuContent = (
        <div
            onClick={() => setMobileOpen(false)}
            className={css({
                position: 'fixed',
                inset: 0,
                zIndex: 9998,
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
                    boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
                    border: '1px solid token(colors.border.default)',
                    overflow: 'hidden',
                    animation: 'scaleUp 0.15s ease-out',
                    maxHeight: '80vh',
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
                    <h2 className={css({ fontSize: '0.9rem', fontWeight: '600', color: 'text.primary' })}>
                        Navigation
                    </h2>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className={css({
                            p: '4px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: 'text.tertiary',
                            bg: 'transparent',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            _hover: { bg: 'bg.secondary', color: 'text.primary' },
                        })}
                        aria-label="Close menu"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Nav Links */}
                <nav className={css({
                    display: 'flex',
                    flexDirection: 'column',
                    p: '8px 12px',
                    gap: '2px',
                })}>
                    <Link href="/" className={mobileLinkStyle(isActive('/'))}>
                        Home
                    </Link>
                    {pages.map((page) => (
                        <Link
                            key={page.slug}
                            href={`/${page.slug}`}
                            className={mobileLinkStyle(isActive(`/${page.slug}`))}
                        >
                            {page.title}
                        </Link>
                    ))}
                </nav>

                {/* Social icons */}
                {mobileExtra && (
                    <div className={css({
                        px: '20px',
                        py: '14px',
                        borderTop: '1px solid token(colors.border.default)',
                    })}>
                        {mobileExtra}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop links */}
            <div className={css({ display: { base: 'none', md: 'flex' }, alignItems: 'center', gap: '2px' })}>
                <Link href="/" className={linkStyle(isActive('/'))}>
                    Home
                </Link>
                {pages.map((page) => (
                    <Link
                        key={page.slug}
                        href={`/${page.slug}`}
                        className={linkStyle(isActive(`/${page.slug}`))}
                    >
                        {page.title}
                    </Link>
                ))}
            </div>

            {/* Mobile hamburger button */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={css({
                    display: { base: 'flex', md: 'none' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: '6px',
                    borderRadius: '8px',
                    color: 'text.primary',
                    bg: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    _hover: { bg: 'bg.secondary' },
                })}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile menu modal — portalled to body */}
            {mounted && mobileOpen && createPortal(mobileMenuContent, document.body)}
        </>
    );
}

