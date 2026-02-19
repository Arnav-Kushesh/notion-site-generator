import { css } from '@/styled-system/css';
import type { VideoEmbedSectionData } from '@/lib/data';

export function VideoEmbedSection({ data }: { data: VideoEmbedSectionData }) {
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
                    title={data.title || 'Video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
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
