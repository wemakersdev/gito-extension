module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.svelte'],
  plugins: [
    require("daisyui"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp"),
    require("tailwindcss-debug-screens"),
    require("@tailwindcss/typography"),
  ]
}
