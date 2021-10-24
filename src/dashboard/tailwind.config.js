module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.svelte'],
  theme: {
    extend: {
      colors: {
        "colors-background": "var(--colors-background)",
        "colors-foreground": "var(--colors-foreground)",
        'colors-border': "var(--colors-border)",
        "colors-text": "var(--colors-text)",
        "colors-highlight": "var(--colors-highlight)",
      },
    },
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp"),
    require("tailwindcss-debug-screens"),
    require("@tailwindcss/typography"),
  ],
  daisyui: {
    styled: true,
    themes: true,
    base: false,
    utils: true,
    logs: true,
    rtl: false,
  },
}
