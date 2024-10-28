/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class', // Aquí activas el modo oscuro basado en la clase
  plugins: [require("daisyui")],
}
