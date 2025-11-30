/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mint: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          900: '#064E3B',
        },
        // Universal dark mode colors
        dark: {
          bg: '#0F172A',        // Main background
          card: '#1E293B',      // Card/panel background
          border: '#334155',    // Borders
          hover: '#334155',     // Hover states
          text: '#F1F5F9',      // Primary text
          'text-muted': '#94A3B8', // Secondary text
        }
      }
    },
  },
  plugins: [],
};
