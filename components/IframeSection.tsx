import { css } from '@/styled-system/css';
import type { IframeSectionData } from '@/lib/data';

export function IframeSection({ data }: { data: IframeSectionData }) {
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
                aspectRatio: '16/9',
            })}>
                <iframe
                    src={data.url}
                    title={data.title || 'Embedded Page'}
                    className={css({
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        display: 'block',
                    })}
                />
            </div>
        </section>
    );
}
