/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ... existing colors ...
      },
      textColor: {
        'terminal-green': 'rgb(74 222 128)', // green-400
      },
      // ... rest of existing theme config ...
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // ... other plugins
  ],
} 