
import { css } from '@/styled-system/css';

export const postContentStyle = css({
    '& > *': { mb: '20px' },
    '& h1': {
        fontSize: '2rem',
        fontWeight: 'bold',
        mt: '40px',
        mb: '20px',
        color: 'text.primary',
    },
    '& h2': {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        mt: '40px',
        mb: '20px',
        color: 'text.primary',
    },
    '& h3': {
        fontSize: '1.4rem',
        fontWeight: 'bold',
        mt: '30px',
        mb: '16px',
        color: 'text.primary',
    },
    '& h4, & h5, & h6': {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        mt: '24px',
        mb: '12px',
        color: 'text.primary',
    },
    '& p': {
        fontSize: '1.1rem',
        lineHeight: '1.8',
        color: 'text.primary',
    },
    '& ul': {
        pl: '20px',
        ml: '20px',
        mb: '20px',
        listStyleType: 'disc',
    },
    '& ol': {
        pl: '20px',
        ml: '20px',
        mb: '20px',
        listStyleType: 'decimal',
    },
    '& li': {
        mb: '8px',
        color: 'text.primary',
        fontSize: '1.1rem',
        lineHeight: '1.8',
    },
    '& strong, & b': {
        fontWeight: 'bold',
    },
    '& em, & i': {
        fontStyle: 'italic',
    },
    '& blockquote': {
        borderLeft: '4px solid token(colors.primary)',
        pl: '20px',
        fontStyle: 'italic',
        color: 'text.secondary',
        my: '30px',
        bg: 'bg.secondary',
        py: '12px',
        borderRadius: '0 8px 8px 0',
    },
    '& pre': {
        bg: 'bg.secondary',
        p: '20px',
        borderRadius: '8px',
        overflowX: 'auto',
        fontSize: '0.9rem',
        fontFamily: 'monospace',
        my: '24px',
    },
    '& code': {
        bg: 'bg.tertiary',
        px: '6px',
        py: '2px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '0.9em',
    },
    '& a': {
        color: 'primary',
        textDecoration: 'underline',
        textUnderlineOffset: '4px',
        _hover: {
            opacity: 0.8,
        },
    },
    '& img': {
        borderRadius: '8px',
        maxWidth: '100%',
        height: 'auto',
        my: '20px',
    },
    '& table': {
        width: '100%',
        borderCollapse: 'collapse',
        my: '24px',
        fontSize: '1rem',
    },
    '& th': {
        textAlign: 'left',
        py: '12px',
        px: '16px',
        bg: 'bg.secondary',
        fontWeight: 'bold',
        borderBottom: '2px solid token(colors.border.default)',
    },
    '& td': {
        py: '12px',
        px: '16px',
        borderBottom: '1px solid token(colors.border.default)',
    },
    '& hr': {
        border: 'none',
        borderTop: '1px solid token(colors.border.default)',
        my: '40px',
    }
});
