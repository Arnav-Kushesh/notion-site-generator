import { css } from '@/styled-system/css';
import type { IframeSectionData } from '@/lib/data';

function normalizeUnit(value: string): string {
    return /^\d+(\.\d+)?$/.test(value.trim()) ? `${value.trim()}px` : value.trim();
}

export function IframeSection({ data }: { data: IframeSectionData }) {
    const fullWidth = data.full_width ?? false;

    const hasTopPart = !!(data.title || data.description);

    return (
        <section className={css({ mb: '40px' })}>
            {hasTopPart && (
                <div className={css({
                    mb: '16px',
                    ...(data.top_part_centered ? { textAlign: 'center' } : {}),
                })}>
                    {data.title && (
                        <h2 className={css({
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            color: 'text.primary',
                            letterSpacing: '-0.02em',
                        })}>
                            {data.title}
                        </h2>
                    )}
                    {data.description && (
                        <p className={css({
                            fontSize: '0.95rem',
                            color: 'text.secondary',
                            mt: '4px',
                            whiteSpace: 'pre-wrap',
                        })}>
                            {data.description}
                        </p>
                    )}
                </div>
            )}
            <div
                className={fullWidth
                    ? css({
                        width: '100vw',
                        marginLeft: 'calc(-50vw + 50%)',
                        overflow: 'hidden',
                    })
                    : css({
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid token(colors.border.default)',
                    })
                }
            >
                <iframe
                    src={data.url}
                    title={data.title || 'Embedded Page'}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    className={`iframe-section-frame ${css({
                        width: '100%',
                        border: 'none',
                        display: 'block',
                        aspectRatio: data.aspect_ratio || '16/9',
                    })}`}
                />
            </div>
        </section>
    );
}
