/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#c2410c',   // orange-700 — text links, readable
          hover: '#9a3412',     // orange-800 — text hover
          cta: '#ea580c',       // orange-600 — button backgrounds, vibrant
          'cta-hover': '#f97316', // orange-500 — button hover, brighter
          dark: '#7c2d12',      // orange-900 — dark CTA sections
          muted: '#ffedd5',     // orange-100 — badges, tags
        },
        surface: {
          DEFAULT: '#fafaf9',   // stone-50 — warm white, modern
          muted: '#f5f5f4',     // stone-100 — subtle muted
        },
        foreground: {
          DEFAULT: '#374151',   // gray-700 — body text
          heading: '#111827',   // gray-900 — headings
          muted: '#78716c',     // stone-500 — captions, meta
        },
        border: {
          DEFAULT: '#d6d3d1',   // stone-300 — borders
          light: '#e7e5e4',     // stone-200 — subtle borders
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
