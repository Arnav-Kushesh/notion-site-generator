import { getHomeData, getPosts, getGalleryItems } from '@/lib/data';
import { InfoSection } from '@/components/InfoSection';
import { DynamicSection } from '@/components/DynamicSection';
import { css } from '@/styled-system/css';
import { container } from '@/styled-system/patterns';

const mainStyle = css({ pb: '100px' });
const sectionContainerStyle = container({ py: '60px' });

export default function Home() {
    const homeData = getHomeData();
    const sections = homeData.sections || [];
    const showSidebar = homeData.info?.sidebar_navigation === 'true';

    return (
        <main className={mainStyle}>
            {/* Contextual Hero: Only show if Sidebar is DISABLED */}
            {/* But wait, Hero is now an Info Section? 
                If the user wants a Hero, they created an Info Section for it.
                However, existing logic used `homeData.hero`. 
                The new logic puts EVERYTHING in sections.
                If sidebar is disabled, we usually want a Navbar + content.
                The content is just the sections.
                So we don't need explicit Hero check here unless we want to support legacy hero data?
                The legacy hero data might still be in `homeData.hero` if we merged `site.json`?
                But `Hero Config` database is gone/migrated to Config?
                Actually `dummy-data.mjs` converted Hero to Info Section.
                So we just render sections.
            */}

            <div className={css({ display: 'flex', flexDirection: 'column', gap: '0' })}>
                {sections.map((section) => {
                    if (section.type === 'info_section') {
                        return <InfoSection key={section.id} data={section} />;
                    } else if (section.type === 'dynamic_section') {
                        return <DynamicSection key={section.id} data={section} />;
                    }
                    return null;
                })}
            </div>
        </main>
    );
}
