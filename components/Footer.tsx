
import { css } from '@/styled-system/css';
import Link from 'next/link';
import { Github } from 'lucide-react';

export function Footer() {
    return (
        <footer className={css({
            py: '40px',
            mt: '80px',
            borderTop: '1px solid token(colors.border.subtle)',
            textAlign: 'center',
            color: 'text.muted',
            fontSize: 'sm',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
        })}>

            <Link
                href="https://github.com/arnav-kushesh/swan"
                target="_blank"
                className={css({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'color 0.2s',

                    _hover: { color: 'text.primary' }
                })}
            >
                <p>Generated using <strong>Swan</strong></p>
            </Link>
        </footer>
    );
}
