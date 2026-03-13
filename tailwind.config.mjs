/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          cta: 'var(--color-primary-cta)',
          'cta-hover': 'var(--color-primary-cta-hover)',
          dark: 'var(--color-primary-dark)',
          muted: 'var(--color-primary-muted)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          muted: 'var(--color-surface-muted)',
          elevated: 'var(--color-surface-elevated)',
        },
        foreground: {
          DEFAULT: 'var(--color-foreground)',
          heading: 'var(--color-foreground-heading)',
          muted: 'var(--color-foreground-muted)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          light: 'var(--color-border-light)',
        },
        'on-primary': 'var(--color-on-primary)',
        status: {
          bg: 'var(--color-status-bg)',
          text: 'var(--color-status-text)',
        },
        linkedin: {
          DEFAULT: 'var(--color-linkedin)',
          hover: 'var(--color-linkedin-hover)',
        },
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',    // 2px
        DEFAULT: '0.1875rem', // 3px
        'md': '0.25rem',     // 4px
        'lg': '0.25rem',     // 4px (was 8px)
        'xl': '0.375rem',    // 6px (was 12px)
        '2xl': '0.5rem',     // 8px
        '3xl': '0.75rem',    // 12px
        'full': '9999px',
      },
      spacing: {
        'section': '5rem',
        'section-sm': '3rem',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100ch',
            color: 'var(--color-foreground)',
            a: {
              color: 'var(--color-primary)',
              '&:hover': {
                color: 'var(--color-primary-hover)',
              },
            },
            h1: { color: 'var(--color-foreground-heading)' },
            h2: { color: 'var(--color-foreground-heading)' },
            h3: { color: 'var(--color-foreground-heading)' },
            h4: { color: 'var(--color-foreground-heading)' },
            strong: { color: 'var(--color-foreground-heading)' },
            blockquote: {
              color: 'var(--color-foreground)',
              borderLeftColor: 'var(--color-border)',
            },
            code: {
              color: 'var(--color-foreground-heading)',
              backgroundColor: 'var(--color-surface-muted)',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            hr: { borderColor: 'var(--color-border-light)' },
            'thead th': {
              color: 'var(--color-foreground-heading)',
              borderBottomColor: 'var(--color-border)',
            },
            'tbody td': {
              borderBottomColor: 'var(--color-border-light)',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
