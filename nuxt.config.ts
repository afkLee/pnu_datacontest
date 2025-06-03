// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  vite: {
    plugins: [
      require('vite-svg-loader')(),
    ],
    define: {
      __VUE_OPTIONS_API__: true,
    },
  }
})
