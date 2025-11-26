/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // CRITICAL: Scans all your React components
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }