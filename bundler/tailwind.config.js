const fontSizes = {}
const minFontSize = 12
const maxFontSize = 70
const base = 16
let i = minFontSize
while (i <= maxFontSize) {
  fontSizes[i] = `${i / base}rem`
  i += 2
}

module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    fontSize: fontSizes,
    extend: {
      fontFamily: {
        'league': ['League Spartan', 'sans-serif'],
      },
      colors: {
        "green": "#33D69F",
        "orange": "#FF8F00",
        "gray": {
          100: "#F9FAFE",
          200: "#F8F8FB",
          300: "#DFE3FA",
          400: "#888EB0",
          500: "#373B53",
        },
        "red": {
          100: "#FF9797",
          200: "#EC5757",
        },
        "blue": {
          100: "#7E88C3",
          300: "#252945",
          400: "#1E2139",
        },
        "purple": {
          100: "#9277FF",
          200: "#7C5DFA",
        },
        "black": "#141625",
        "white": "#FFFFFF",
      },
      spacing: {
        "4.5": "1.125rem", // 18px
      },
      letterSpacing: {
        "heading-l": "-0.063em", // -1px
        "heading-m": "-0.047em", // -0.75px
        "heading-s": "-0.016em", // -0.25px
        "body": "-0.006em",      // -0.1px
      }
    },
  },
  plugins: [],
}