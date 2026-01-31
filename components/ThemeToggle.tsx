'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { css } from '@/styled-system/css';

export function ThemeToggle({ defaultTheme = 'light' }: { defaultTheme?: 'light' | 'dark' }) {
    const [theme, setTheme] = useState<'light' | 'dark'>(defaultTheme);

    useEffect(() => {
        // Init: check local storage, if not set use default (which is already set in state)
        // If set, update state and DOM
        const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (stored) {
            setTheme(stored);
            if (stored === 'dark') {
                document.documentElement.classList.add('dark');
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.setAttribute('data-theme', 'light');
            }
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);

        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'light');
        }

        localStorage.setItem('theme', newTheme);
        // Clean up cookie if it exists to avoid confusion
        document.cookie = 'theme=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };

    return (
        <button
            onClick={toggleTheme}
            className={css({
                p: '8px',
                borderRadius: 'full',
                color: 'text.secondary',
                transition: 'all 0.2s',
                cursor: 'pointer',
                _hover: {
                    bg: 'bg.secondary',
                    color: 'text.primary',
                },
            })}
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <Moon size={20} />
            ) : (
                <Sun size={20} />
            )}
        </button>
    );
}
