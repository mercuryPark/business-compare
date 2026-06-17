import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#15241d',
        muted: '#5d6b62',
        paper: '#f4f3ee',
        line: '#e5e3da',
        forest: '#103a2c',
        'forest-700': '#16523c',
        surface: '#ffffff',
        safe: '#1a865a',
        watch: '#b06a12',
        danger: '#c0473b',
        info: '#2f63c7',
        clay: '#bb5a36',
        leaf: '#17794f',
        cream: '#f0eee4',
        mist: '#e7efe8',
      },
      fontFamily: {
        sans: [
          'Pretendard',
          'Pretendard Variable',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      borderRadius: {
        lg: '0.9rem',
        xl: '1.25rem',
        '2xl': '1.6rem',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(16, 36, 28, 0.04), 0 1px 3px rgba(16, 36, 28, 0.05)',
        md: '0 6px 22px rgba(16, 36, 28, 0.08)',
        lift: '0 14px 40px rgba(16, 36, 28, 0.12)',
        hero: '0 30px 80px rgba(8, 28, 20, 0.35)',
      },
      letterSpacing: {
        tightest: '-0.035em',
      },
    },
  },
  plugins: [],
} satisfies Config;
