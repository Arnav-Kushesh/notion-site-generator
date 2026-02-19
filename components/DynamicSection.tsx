
import { css } from '@/styled-system/css';
import { container } from '@/styled-system/patterns';
import { DynamicSectionData, getPosts } from '@/lib/data';

// Server Component (can fetch data)
import { InteractiveSection } from './InteractiveSection';

export function DynamicSection({ data }: { data: DynamicSectionData }) {
    const { collection_name, view_type, title } = data;
    const collectionSlug = collection_name.toLowerCase();

    // Generic fetch
    const items = getPosts(collectionSlug);

    // If no items found, maybe return null or empty section?
    if (!items || items.length === 0) return null;

    return (
        <section className={container({ py: '60px', maxWidth: '1200px' })}>
            <InteractiveSection
                sectionId={data.id}
                title={title}
                items={items}
                initialViewType={view_type || 'list_view'}
            />
        </section>
    );
}
