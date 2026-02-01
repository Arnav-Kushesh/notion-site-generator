
'use client';

import { useGlobalConfig } from '@/components/providers/GlobalConfigProvider';
import { css } from '@/styled-system/css';
import { ReactNode } from 'react';

export function SidebarWrapper({ children }: { children: ReactNode }) {
    const { showSidebar } = useGlobalConfig();

    return (
        <div className={css({
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            transform: showSidebar ? 'translateX(0)' : 'translateX(-100%)',
            opacity: showSidebar ? 1 : 0,
            pointerEvents: showSidebar ? 'auto' : 'none',
            position: 'fixed',
            zIndex: 40, // Below navbar (100)
            left: 0,
            top: 0,
            height: '100vh',
            width: '260px' // Match Sidebar width
        })}>
            {children}
        </div>
    );
}
