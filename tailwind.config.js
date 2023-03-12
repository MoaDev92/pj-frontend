module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-45deg)" },
          "50%": { transform: "rotate(45deg)" },
        },
        flasher: {
          "0%": { opacity: "0" },
          "20%": { opacity: "0.3" },
          "30%": { opacity: "0.4" },
          "50%": { opacity: "0.5" },
          "70%": { opacity: "0.4" },
          "90%": { opacity: "0.3" },
          "100%": { opacity: "0" },
        },
        flasherRev: {
          "0%": { opacity: "0.5" },
          "20%": { opacity: "0.4" },
          "30%": { opacity: "0.3" },
          "50%": { opacity: "0" },
          "70%": { opacity: "0.3" },
          "90%": { opacity: "0.4" },
          "100%": { opacity: "0.5" },
        },
      },
      animation: {
        wiggle: "wiggle 1s ease-in-out infinite",
        flasher: "flasher 3s ease-in-out infinite",
        flasherRev: "flasherRev 3s ease-in-out infinite",
      },
      fontFamily: {
        Gwendolyn: ["Gwendolyn", "cursive"],
        Pacifico: ["Pacifico", "cursive"],
        Lora: ["Lora", "serif"],
        Roboto: ["Roboto", "sans-serif"],
        IBM: ["'IBM Plex Sans'", "sans-serif"],
        Rubik: ["Rubik", "sans-serif"],
        FiraSans: ["'Fira Sans'", "sans-serif"],
        FiraSansExtraCondensed: ["'Fira Sans Extra Condensed'", "sans-serif"],
        FiraSansCondensed: ["'Fira Sans Condensed'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
