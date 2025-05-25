/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ... existing theme extensions
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // ... other plugins
  ],
} 