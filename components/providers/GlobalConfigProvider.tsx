"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { HomeData } from '@/lib/data';

interface GlobalConfigContextType {
    config: HomeData;
    colorMode: string;
    setColorMode: (mode: string) => void;
    availableThemes: string[];
    showSidebar: boolean;
    toggleSidebar: () => void;
}

const GlobalConfigContext = createContext<GlobalConfigContextType | undefined>(undefined);

export const THEMES = [
    'light', 'dark', 'blue', 'pink', 'red', 'green', 'brown'
];

export function GlobalConfigProvider({
    initialConfig,
    children
}: {
    initialConfig: HomeData;
    children: React.ReactNode;
}) {
    // Initialize from prop, but also check localStorage on mount if we want persistence
    // For now, simpler to start with default.
    const [colorMode, setColorMode] = useState<string>((initialConfig.info?.default_color_mode as string) || 'light');
    const [showSidebar, setShowSidebar] = useState<boolean>(initialConfig.info?.sidebar_navigation === 'true');

    const toggleSidebar = () => setShowSidebar(prev => !prev);

    useEffect(() => {
        // Recover from local storage
        const saved = localStorage.getItem('swan-color-mode');
        if (saved && THEMES.includes(saved)) {
            setColorMode(saved);
        }
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', colorMode);
        localStorage.setItem('swan-color-mode', colorMode);
    }, [colorMode]);

    useEffect(() => {
        // Update showSidebar if initialConfig changes
    }, [initialConfig]);

    return (
        <GlobalConfigContext.Provider value={{
            config: initialConfig,
            colorMode,
            setColorMode,
            availableThemes: THEMES,
            showSidebar,
            toggleSidebar
        }}>
            {children}
        </GlobalConfigContext.Provider>
    );
}

export function useGlobalConfig() {
    const context = useContext(GlobalConfigContext);
    if (context === undefined) {
        throw new Error('useGlobalConfig must be used within a GlobalConfigProvider');
    }
    return context;
}
