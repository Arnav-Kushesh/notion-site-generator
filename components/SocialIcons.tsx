
import { css } from '@/styled-system/css';
import { flex } from '@/styled-system/patterns';
import { FaGithub, FaLinkedin, FaTwitter, FaYoutube, FaFacebook, FaTwitch, FaEnvelope } from 'react-icons/fa';
import { RiInstagramFill } from 'react-icons/ri';
import { InfoConfig } from '@/lib/data';

const socialContainerStyle = flex({ gap: '12px', alignItems: 'center', wrap: 'wrap' });

const iconStyle = css({
    color: 'text.secondary',
    transition: 'color 0.2s',
    cursor: 'pointer',
    _hover: {
        color: 'primary',
    },
});

export function SocialIcons({ config }: { config?: InfoConfig }) {
    if (!config) return null;

    return (
        <div className={socialContainerStyle}>
            {config.social_twitter && (
                <a href={config.social_twitter} target="_blank" rel="noreferrer" className={iconStyle}>
                    <FaTwitter size={18} />
                </a>
            )}
            {config.social_github && (
                <a href={config.social_github} target="_blank" rel="noreferrer" className={iconStyle}>
                    <FaGithub size={18} />
                </a>
            )}
            {config.social_linkedin && (
                <a href={config.social_linkedin} target="_blank" rel="noreferrer" className={iconStyle}>
                    <FaLinkedin size={18} />
                </a>
            )}
            {config.social_email && (
                <a href={`mailto:${config.social_email}`} className={iconStyle}>
                    <FaEnvelope size={18} />
                </a>
            )}
            {config.social_instagram && (
                <a href={config.social_instagram} target="_blank" rel="noreferrer" className={iconStyle}>
                    <RiInstagramFill size={18} />
                </a>
            )}
            {config.social_youtube && (
                <a href={config.social_youtube} target="_blank" rel="noreferrer" className={iconStyle}>
                    <FaYoutube size={18} />
                </a>
            )}
            {config.social_facebook && (
                <a href={config.social_facebook} target="_blank" rel="noreferrer" className={iconStyle}>
                    <FaFacebook size={18} />
                </a>
            )}
            {config.social_twitch && (
                <a href={config.social_twitch} target="_blank" rel="noreferrer" className={iconStyle}>
                    <FaTwitch size={18} />
                </a>
            )}
        </div>
    );
}
