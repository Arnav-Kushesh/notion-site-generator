'use client';

import { useState } from 'react';
import { css } from '@/styled-system/css';
import type { MailBasedCommentSectionData } from '@/lib/data';

export function MailBasedCommentSection({ data }: { data: MailBasedCommentSectionData }) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const subject = encodeURIComponent(data.topic_title);
        const body = encodeURIComponent(message);
        window.location.href = `mailto:${data.author_email}?subject=${subject}&body=${body}`;
    };

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
            <form onSubmit={handleSubmit} className={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                p: '20px',
                bg: 'bg.secondary',
                borderRadius: '12px',
                border: '1px solid token(colors.border.default)',
            })}>
                <p className={css({ color: 'text.secondary', fontSize: '0.875rem' })}>
                    Topic: {data.topic_title}
                </p>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message..."
                    rows={4}
                    className={css({
                        w: '100%',
                        p: '12px',
                        bg: 'bg.primary',
                        color: 'text.primary',
                        border: '1px solid token(colors.border.default)',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        resize: 'vertical',
                        outline: 'none',
                        _focus: { borderColor: 'primary' },
                    })}
                />
                <button
                    type="submit"
                    className={css({
                        alignSelf: 'flex-start',
                        bg: 'text.primary',
                        color: 'bg.primary',
                        px: '20px',
                        py: '8px',
                        borderRadius: 'full',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        border: 'none',
                        transition: 'all 0.2s ease',
                        _hover: { opacity: 0.9, transform: 'translateY(-1px)' },
                    })}
                >
                    Send via Email
                </button>
            </form>
        </section>
    );
}
