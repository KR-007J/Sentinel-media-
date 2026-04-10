/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Inter"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      colors: {
        aurora: {
          bg:       '#202124',
          surface:  '#2d2e31',
          card:     '#2d2e31',
          border:   '#3c4043',
          'border-bright': '#5f6368',
          indigo:   '#1a73e8', // Google Blue
          violet:   '#a142f4', // Google Violet
          teal:     '#34a853', // Google Green
          amber:    '#fbbc05', // Google Yellow
          rose:     '#ea4335', // Google Red
          emerald:  '#34a853',
          sky:      '#4285f4',
          text:     '#ffffff',
          muted:    '#9aa0a6',
          subtle:   '#3c4043',
        },
        google: {
          blue: '#1a73e8',
          red: '#d93025',
          yellow: '#f9ab00',
          green: '#34a853',
          gray: '#5f6368',
          'dark-bg': '#202124',
          'dark-surface': '#2d2e31',
          'dark-border': '#3c4043',
        }
      },
      backgroundImage: {
        'aurora-mesh': 'radial-gradient(ellipse at 20% 50%, rgba(26,115,232,0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(234,67,53,0.05) 0%, transparent 50%)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.01) 0%, transparent 50%)',
      },
      boxShadow: {
        'google-md': '0 1px 3px 0 rgba(0,0,0,0.3), 0 1px 2px 0 rgba(0,0,0,0.15)',
        'google-lg': '0 10px 15px -3px rgba(0,0,0,0.5), 0 4px 6px -2px rgba(0,0,0,0.25)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-right': 'slideRight 0.5s ease forwards',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
        'scan': 'scan 2.5s linear infinite',
        'float': 'float 5s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        fadeUp: { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideRight: { '0%': { opacity: 0, transform: 'translateX(-20px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: 0.8 },
          '100%': { transform: 'scale(2.5)', opacity: 0 },
        },
        scan: {
          '0%': { transform: 'translateY(-10px)', opacity: 0 },
          '10%': { opacity: 1 },
          '90%': { opacity: 1 },
          '100%': { transform: 'translateY(100%)', opacity: 0 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
