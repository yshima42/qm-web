import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          light: '#2E6C28', // ライトモードの時のメインカラー
          dark: '#78DC77', // ダークモードの時のメインカラー
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'var(--tw-prose-body)',
            'h1, h2, h3': {
              fontWeight: 'bold',
              color: 'var(--tw-prose-headings)',
            },
            h1: {
              fontSize: '2.25rem',
              marginTop: '2.5rem',
              marginBottom: '1.5rem',
            },
            h2: {
              fontSize: '1.875rem',
              marginTop: '2rem',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottomWidth: '1px',
            },
            h3: {
              fontSize: '1.5rem',
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
            },
            p: {
              marginTop: '1rem',
              marginBottom: '1rem',
              lineHeight: '1.75',
            },
            img: {
              borderRadius: '0.375rem',
              margin: '2rem auto',
              boxShadow: 'var(--tw-shadow-md)',
            },
            blockquote: {
              fontStyle: 'italic',
              paddingLeft: '1rem',
              borderLeftWidth: '4px',
            },
            code: {
              color: 'var(--tw-prose-code)',
              backgroundColor: 'var(--tw-prose-code-bg)',
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
            },
            pre: {
              backgroundColor: 'var(--tw-prose-pre-bg)',
              color: 'var(--tw-prose-pre-code)',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflowX: 'auto',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
            },
            a: {
              color: 'var(--tw-prose-links)',
              fontWeight: '500',
              textDecoration: 'none',
            },
            'a:hover': {
              textDecoration: 'underline',
            },
          },
        },
      },
    },
  },
  plugins: [animate, typography],
} satisfies Config;

export default config;
