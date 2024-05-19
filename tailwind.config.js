/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        custom: {
          "18938A": "rgb(74, 194, 188)",
          grey: "rgb(38, 70, 83)",
        },
        primary: {
          light: "#6D28D9",
          DEFAULT: "#4C1D95",
          dark: "#3B0B7A",
        },
        secondary: {
          light: "#38BDF8",
          DEFAULT: "#0EA5E9",
          dark: "#0369A1",
        },
      },
    },
  },
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#6EB3B3",
          "primary-content": "#ffffff",
          secondary: "#264653",
          "secondary-content": "#ffffff",
        },
      },
    ],
  },
};
