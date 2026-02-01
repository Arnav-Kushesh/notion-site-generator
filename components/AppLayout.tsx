
'use client';

import { Footer } from './Footer';
import { useGlobalConfig } from '@/components/providers/GlobalConfigProvider';
import { css } from '@/styled-system/css';
import { ReactNode } from 'react';

export function AppLayout({ sidebar, navbar, children }: { sidebar: ReactNode, navbar: ReactNode, children: ReactNode }) {
    const { showSidebar } = useGlobalConfig();

    return (
        <>
            {/* Sidebar Wrapper */}
            <div className={css({
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 40,
                transform: showSidebar ? 'translate(0)' : 'translate(-100%)',
                opacity: showSidebar ? 1 : 0,
                pointerEvents: showSidebar ? 'auto' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                width: 'auto' // Sidebar itself defines width (260px + margins)
            })}>
                {sidebar}
            </div>

            {/* Navbar Wrapper */}
            <div className={css({
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 30, // Below sidebar
                transform: showSidebar ? 'translateY(-100%)' : 'translateY(0)',
                opacity: showSidebar ? 0 : 1,
                pointerEvents: showSidebar ? 'none' : 'auto',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            })}>
                {navbar}
            </div>

            {/* Main Content Wrapper */}
            <div className={css({
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                marginLeft: showSidebar ? '300px' : '0', // Adjust for sidebar width
                paddingTop: showSidebar ? '40px' : '80px', // Adjust for navbar or top spacing
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
            })}>
                <div className={css({
                    width: '100%',
                    maxWidth: '1200px', // Increased from 800px to fix "widtch too small"
                    px: '20px',
                    transition: 'max-width 0.3s',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 'calc(100vh - 80px)' // Ensure footer pused down
                })}>
                    <div className={css({ flex: 1 })}>
                        {children}
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
}
