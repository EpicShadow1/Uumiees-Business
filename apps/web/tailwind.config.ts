import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Uumiee's Brand Colors - Royal/Luxury Palette
        primary: {
          DEFAULT: '#173B8F', // Royal Blue
          hover: '#0F2A6B',
          light: '#4A6FB5',
        },
        secondary: {
          DEFAULT: '#081A3A', // Deep Navy
          hover: '#051226',
        },
        accent: {
          DEFAULT: '#D4AF37', // Royal Gold
          hover: '#B8952F',
          light: '#E0C45C',
        },
        background: {
          DEFAULT: '#FFFDF7', // Warm Ivory
          paper: '#FFFFFF',
          surface: '#F4F5F7', // Soft Gray
        },
        text: {
          DEFAULT: '#171A21', // Charcoal
          muted: '#6B7280',
          light: '#9CA3AF',
        },
        success: '#1F8A5B',
        warning: '#D99A00',
        danger: '#C73E3A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
