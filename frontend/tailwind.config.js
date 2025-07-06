/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        // רקע גראדיאנטי מותאם אישית
        'baby-gradient': 'linear-gradient(to bottom right, #ffe4e6, #e0f2fe, #ede9fe)',

        // רקע עם תמונה (שים את הקובץ ב־public/images/baby-bg.jpg)
        'baby-pattern': "url('/images/baby-bg.jpg')",
      },
    },
  },
  plugins: [],
}