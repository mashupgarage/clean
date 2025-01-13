/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
      },
      boxShadow: {
        'item': '0px 4px 12px 0px #94a3b8;',
      }
    },
  },
  plugins: [],
}
