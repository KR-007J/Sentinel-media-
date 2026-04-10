/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      colors: {
        aurora: {
          bg:       '#07080f',
          surface:  '#0c0e1a',
          card:     '#0f1120',
          border:   '#1a1f3a',
          'border-bright': '#2a3060',
          indigo:   '#6366f1',
          violet:   '#8b5cf6',
          teal:     '#14b8a6',
          amber:    '#f59e0b',
          rose:     '#f43f5e',
          emerald:  '#10b981',
          sky:      '#38bdf8',
          text:     '#e2e8f8',
          muted:    '#64748b',
          subtle:   '#1e2442',
        }
      },
      backgroundImage: {
        'aurora-mesh': 'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.10) 0%, transparent 50%), radial-gradient(ellipse at 60% 80%, rgba(20,184,166,0.08) 0%, transparent 50%)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)',
        'threat-glow': 'radial-gradient(ellipse at center, rgba(244,63,94,0.15) 0%, transparent 70%)',
        'safe-glow': 'radial-gradient(ellipse at center, rgba(16,185,129,0.12) 0%, transparent 70%)',
      },
      boxShadow: {
        'aurora': '0 0 0 1px rgba(99,102,241,0.15), 0 4px 24px rgba(99,102,241,0.08)',
        'aurora-lg': '0 0 0 1px rgba(99,102,241,0.2), 0 8px 48px rgba(99,102,241,0.15)',
        'threat': '0 0 0 1px rgba(244,63,94,0.3), 0 4px 24px rgba(244,63,94,0.15)',
        'safe': '0 0 0 1px rgba(16,185,129,0.25), 0 4px 16px rgba(16,185,129,0.1)',
        'glow-indigo': '0 0 30px rgba(99,102,241,0.4)',
        'glow-teal': '0 0 20px rgba(20,184,166,0.35)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-right': 'slideRight 0.5s ease forwards',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
        'scan': 'scan 2.5s linear infinite',
        'float': 'float 5s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'count-up': 'countUp 0.8s ease forwards',
        'border-flow': 'borderFlow 3s linear infinite',
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
        borderFlow: {
          '0%, 100%': { borderColor: 'rgba(99,102,241,0.3)' },
          '50%': { borderColor: 'rgba(20,184,166,0.6)' },
        },
      },
    },
  },
  plugins: [],
};
