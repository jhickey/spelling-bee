import plugin from "tailwindcss/plugin";

const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: [
    "./src/routes/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        custom: [
          /* '"Press Start 2P"', */ "Rubik",
          "Poppins",
          "Nunito",
          ...defaultTheme.fontFamily.serif,
        ],
      },
    },
  },
  plugins: [],
};
