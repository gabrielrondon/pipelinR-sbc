module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./frontend/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
