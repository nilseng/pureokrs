module.exports = {
  mode: "jit",
  purge: { enabled: true, content: ["./src/**/*.{html,ts}"] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      minHeight: {
        6: "1.5rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
