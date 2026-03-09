/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#c2410c',   // orange-700 — brand color
          hover: '#9a3412',     // orange-800 — hover states
          dark: '#7c2d12',      // orange-900 — dark CTA sections
          muted: '#ffedd5',     // orange-100 — badges, tags
        },
        surface: {
          DEFAULT: '#f8f4f0',   // warm ivory — base background
          muted: '#f0ebe5',     // warm muted — tech tags
        },
        foreground: {
          DEFAULT: '#374151',   // gray-700 — body text
          heading: '#111827',   // gray-900 — headings
          muted: '#4a3f31',     // warm brown — captions, meta
        },
        border: {
          DEFAULT: '#d8d2cb',   // warm gray — borders
          light: '#e2dbd3',     // warm light — subtle borders
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
            a: {
              color: '#c2410c',
              '&:hover': {
                color: '#9a3412',
              },
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
