const { scale } = require("svelte/transition");

module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      keyframes: {
        fadeInScaleUp: {
          "0%": {
            opacity: "0",
            filter: "blur(2px)",
            transform: "translateY(8px) scale(.98)",
          },
          "100%": {
            opacity: "1",
            filter: "blur(0px)",
            transform: "translateY(0px) scale(1)",
          },
        },
        fadeOutScaleDown: {
          "0%": {
            opacity: "0",
            filter: "blur(2px)",
            transform: "translateY(-6px) scale(.975)",
          },
          "100%": {
            opacity: "1",
            filter: "blur(0px)",
            transform: "translateY(0px) scale(1)",
          },
        },
      },
      animation: {
        fadeInScaleUp: "fadeInScaleUp 0.15s forwards",
        fadeOutScaleDown: "fadeOutScaleDown 0.15s forwards",
      },
    },
  },
  plugins: [],
};
