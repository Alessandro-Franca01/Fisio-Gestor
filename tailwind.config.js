import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#13ec80",
        "background-light": "#f6f8f7",
        "background-dark": "#102219",
        "surface-light": "#ffffff",
        "surface-dark": "#182c23",
        "text-light": "#0d1b14",
        "text-dark": "#e7f3ed",
        "subtle-light": "#4c9a73",
        "subtle-dark": "#a0d9b7",
        "border-light": "#cfe7db",
        "border-dark": "#2d5440",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
      },
    },
  },
  plugins: [
    forms,
    containerQueries,
  ],
  darkMode: 'class',
}