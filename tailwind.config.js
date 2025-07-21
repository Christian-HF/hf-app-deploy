// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        headline: ['"Quicksand"', "sans-serif"],
        body: ['"Noto Sans"', "sans-serif"],
        mono: ['"Noto Sans Mono"', "monospace"],
      },
      colors: {
        primary: {
          DEFAULT: "#2e7d32", // sattes HF-Grün
          light: "#60ad5e",
          dark: "#005005",
        },
        accent: {
          DEFAULT: "#a5d6a7", // helleres Grün
        },
        neutral: {
          light: "#f5f5f5",
          dark: "#333333",
        },
      },
    },
  },
  plugins: [],
};
