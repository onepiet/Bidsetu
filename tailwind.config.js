/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0b426d",
          dark: "#083655",
          deep: "#071a2d",
        },
        blue: {
          DEFAULT: "#0b5f96",
          hover: "#084f7e",
          light: "#edf7ff",
        },
        govText: {
          DEFAULT: "#173957",
          muted: "#63778b",
        },
        surface: {
          DEFAULT: "#f6fafd",
          blue: "#edf6fc",
        },
        govBorder: "#d7e1e9",
        saffron: "#f39a21",
        govGreen: "#229b68",
        govPurple: "#7562d8",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Arial",
          "sans-serif",
        ],
        serif: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
