/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: 'var(--color-primary-light)',
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)'
        },
        secondary: {
          light: 'var(--color-secondary-light)',
          DEFAULT: 'var(--color-secondary)',
          dark: 'var(--color-secondary-dark)'
        },
        accent: {
          mint: 'var(--color-accent-mint)',
          yellow: 'var(--color-accent-yellow)',
          peach: 'var(--color-accent-peach)'
        }
      }
    },
  },
  plugins: [],
}
