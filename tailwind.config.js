/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      screens: {
        xs: "100px", // Custom breakpoint at 500px
      },
      colors: {
        custom: {
          "18938A": "rgb(74, 194, 188)",
          grey: "rgb(38, 70, 83)",
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
