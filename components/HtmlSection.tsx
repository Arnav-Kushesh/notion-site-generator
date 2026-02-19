'use client';

import { css } from '@/styled-system/css';
import type { HtmlSectionData } from '@/lib/data';

export function HtmlSection({ data }: { data: HtmlSectionData }) {
    return (
        <section className={css({ mb: '40px' })}>
            {data.title && (
                <h2 className={css({
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: 'text.primary',
                    letterSpacing: '-0.02em',
                    mb: '16px',
                })}>
                    {data.title}
                </h2>
            )}
            <div className={css({
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid token(colors.border.default)',
            })}>
                <iframe
                    srcDoc={data.html_code}
                    title={data.title || 'HTML Content'}
                    sandbox="allow-scripts"
                    className={css({
                        width: '100%',
                        minHeight: '200px',
                        border: 'none',
                        display: 'block',
                    })}
                />
            </div>
        </section>
    );
}
