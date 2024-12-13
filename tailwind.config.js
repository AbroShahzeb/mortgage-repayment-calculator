/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lime: "#D8DB2F",
        "slate-900": "#133041",
        "slate-700": "#4E6E7E",
        "slate-500": "#6B94A8",
        "slate-300": "#9ABED5",
        "slate-100": "#E4F4FD",
        white: "#FFFFFF",
        redColor: "#D73328",
      },
      backgroundColor: {
        accent: "#D8DB2F",
      },
    },
  },
  plugins: [],
};
