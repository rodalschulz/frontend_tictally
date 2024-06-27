/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      height: {
        "10p": "10%",
        "20p": "20%",
        "30p": "30%",
        "40p": "40%",
        "50p": "50%",
        "60p": "60%",
        "70p": "70%",
        "80p": "80%",
        "90p": "90%",
        "100p": "100%",
      },
      screens: {
        xs: "100px",
      },
      colors: {
        custom: {
          "18938A": "rgb(74, 194, 188)",
          grey: "rgb(38, 70, 83)",
          databg: "rgb(98, 121, 136)",
          upcoming: "rgb(80, 210, 210)",
          primaryDark: "rgb(80, 200, 200)",
          lightblue: "rgb(217, 237, 249)",
          yellow: "rgb(220, 185, 20)",
          editMode: "rgb(107, 245, 255)",
        },
      },
      transitionProperty: {
        width: "width",
      },
    },
  },
  variants: {
    extend: {
      width: ["responsive", "hover", "focus"],
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
