/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          950: "#020617"
        }
      },
      borderRadius: {
        "2xl": "0.9rem"
      }
    }
  },
  plugins: []
};
