'use client';

import React from 'react';
import { css } from '../styled-system/css';
import { GenericList } from './GenericList';
import { useGlobalConfig } from './providers/GlobalConfigProvider';

interface InteractiveSectionProps {
    sectionId?: string;
    title: string;
    description?: string;
    items: any[];
    initialViewType: string;
}

export function InteractiveSection({ sectionId, title, description, items, initialViewType }: InteractiveSectionProps) {
    const { sectionViewOverrides } = useGlobalConfig();
    const effectiveViewType = (sectionId && sectionViewOverrides[sectionId]) || initialViewType;

    return (
        <section className={css({ mb: '40px' })}>
            <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '24px' })}>
                <div>
                    <h2 className={css({ fontSize: '1.5rem', fontWeight: '700', color: 'text.primary', letterSpacing: '-0.02em' })}>
                        {title}
                    </h2>
                    {description && (
                        <p className={css({ color: 'text.secondary', fontSize: '0.875rem', mt: '4px' })}>{description}</p>
                    )}
                </div>
            </div>

            <GenericList items={items} viewType={effectiveViewType} />
        </section>
    );
}
