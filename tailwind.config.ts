import type { Config } from 'tailwindcss';

/**
 * Tailwind CSS configuration file.
 * Defines custom colors, fonts, and theme settings for the app.
 */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom brand colors for clean UI design
        brand: {
          dark: '#171717',
          light: '#ffffff',
          accent: '#2563eb',
        },
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
