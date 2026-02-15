'use client';

import React, { useState } from 'react';
import { css } from '@/styled-system/css';
import { Send } from 'lucide-react';

interface MessageAuthorProps {
    authorEmail: string;
    pageTitle: string;
    authorName: string;
}

export function MessageAuthor({ authorEmail, pageTitle, authorName }: MessageAuthorProps) {
    const [message, setMessage] = useState('');

    if (!authorEmail) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const subject = encodeURIComponent(`Comment: ${pageTitle}`);
        const body = encodeURIComponent(message);
        window.location.href = `mailto:${authorEmail}?subject=${subject}&body=${body}`;
    };

    return (
        <section className={css({
            mt: '48px',
            borderTop: '1px solid token(colors.border.default)',
            pt: '32px',
        })}>
            <h3 className={css({
                fontSize: '1rem',
                fontWeight: '600',
                mb: '16px',
                color: 'text.primary',
            })}>
                Message {authorName || 'the Author'}
            </h3>
            <form onSubmit={handleSubmit} className={css({ display: 'flex', flexDirection: 'column', gap: '12px' })}>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message..."
                    required
                    rows={4}
                    className={css({
                        width: '100%',
                        p: '12px 16px',
                        borderRadius: '10px',
                        border: '1px solid token(colors.border.default)',
                        bg: 'bg.secondary',
                        color: 'text.primary',
                        fontSize: '0.875rem',
                        resize: 'vertical',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        _focus: { borderColor: 'primary' },
                        _placeholder: { color: 'text.tertiary' },
                    })}
                />
                <button
                    type="submit"
                    className={css({
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        alignSelf: 'flex-end',
                        bg: 'text.primary',
                        color: 'bg.primary',
                        px: '20px',
                        py: '10px',
                        borderRadius: 'full',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        border: 'none',
                        _hover: { opacity: 0.9, transform: 'translateY(-1px)' },
                    })}
                >
                    <Send size={14} />
                    Send
                </button>
            </form>
        </section>
    );
}
