import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './lib/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#000814',
        surface: '#02172A',
        accent: '#00F5FF',
        accentSoft: '#00F5FF44',
        textPrimary: '#FFFFFF',
        textSecondary: '#C4D7E0'
      },
      boxShadow: {
        glow: '0 0 30px rgba(0, 245, 255, 0.12)',
        soft: '0 20px 40px rgba(0, 0, 0, 0.22)'
      },
      borderRadius: {
        xl: '1rem'
      }
    }
  },
  plugins: []
};

export default config;
