/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        tech: ['"Space Grotesk"', 'sans-serif'],
        display: ['"Inter"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        primary: '#00f3ff',
        secondary: '#bc13fe',
        surface: '#0a0a0a',
        'surface-highlight': '#151515',
        'text-secondary': '#9aa0a6',
        google: {
          blue: '#1a73e8',
          red: '#d93025',
          yellow: '#f9ab00',
          green: '#34a853',
          gray: '#5f6368',
        }
      },
      backgroundImage: {
        'tech-gradient': 'linear-gradient(135deg, #00f3ff 0%, #bc13fe 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 243, 255, 0.3)',
        'neon-purple': '0 0 15px rgba(188, 19, 254, 0.3)',
      },
      animation: {
        'scan-line': 'scanLine 8s linear infinite',
        'glitch': 'glitch 2s ease-in-out infinite',
      },
      keyframes: {
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        }
      },
    },
  },
  plugins: [],
};
