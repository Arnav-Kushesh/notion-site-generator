import type { GapSectionData } from '@/lib/data';

function normalizeUnit(value: string): string {
    return /^\d+(\.\d+)?$/.test(value.trim()) ? `${value.trim()}px` : value.trim();
}

export function GapSection({ data }: { data: GapSectionData }) {
    const desktopHeight = data.height ? normalizeUnit(data.height) : '0px';
    const mobileHeight = data.mobile_height ? normalizeUnit(data.mobile_height) : desktopHeight;
    const gapId = `gap-section-${data.id.replace(/[^a-zA-Z0-9]/g, '')}`;

    return (
        <>
            <style>{`
                #${gapId} { height: ${mobileHeight}; }
                @media (min-width: 768px) {
                    #${gapId} { height: ${desktopHeight}; }
                }
            `}</style>
            <div id={gapId} className={data.class_name || undefined} />
        </>
    );
}
