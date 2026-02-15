import { getHomeData } from '@/lib/data';
import { InfoSection } from '@/components/InfoSection';
import { DynamicSection } from '@/components/DynamicSection';
import { Newsletter } from '@/components/Newsletter';
import { css } from '@/styled-system/css';

export default function Home() {
    const homeData = getHomeData();
    const sections = (homeData.sections || []).filter(section => section.visibility !== false);
    const showNewsletter =
        homeData.info?.show_newsletter_section_on_home === 'true' &&
        homeData.info?.enable_newsletter === 'true';

    return (
        <main className={css({ pb: '60px' })}>
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

            {showNewsletter && (
                <Newsletter mailchimpFormLink={homeData.info?.mailchimp_form_link} />
            )}
        </main>
    );
}
