/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#3f5b95",
          container: "#5874b0",
        },
        secondary: {
          DEFAULT: "#545e77",
          container: "#d6dffd",
        },
        background: "#f8f9fa",
        surface: {
          DEFAULT: "#f8f9fa",
          variant: "#444750",
          container: {
            lowest: "#ffffff",
            low: "#f3f4f5",
            high: "#e9eaeb",
          }
        },
        outline: {
          variant: "#c4c6d0",
        },
        "on-surface": "#191c1d",
        "on-surface-variant": "#444750",
        "on-primary": "#ffffff",
      }
    },
  },
  plugins: [],
};
