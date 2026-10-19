import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF0000',
          hover: '#CC0000',
        },
        link: '#065FD4',
        gray: {
          50: '#F9F9F9',
          100: '#F2F2F2',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#606060',
          700: '#404040',
          800: '#262626',
          900: '#0F0F0F',
        },
        surface: '#F2F2F2',
        border: '#E5E5E5',
        success: '#2BA640',
        warning: '#FB8C00',
        text: {
          primary: '#0F0F0F',
          secondary: '#606060',
        },
      },
      fontFamily: {
        sans: ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      boxShadow: {
        level1: '0 1px 2px rgba(0, 0, 0, 0.1)',
        level2: '0 4px 16px rgba(0, 0, 0, 0.08)',
        level3: '0 8px 32px rgba(0, 0, 0, 0.16)',
      },
      borderRadius: {
        pill: '9999px',
      },
    },
  },
  plugins: [],
};

export default config;
