// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@element-plus/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    'vue-yandex-maps/nuxt'
  ],
  yandexMaps: {
    apikey: process.env.NUXT_YANDEX_MAPS_API_KEY,
  },
  runtimeConfig: {
    public: {
      pocketBaseUrl: '',
    },
    systemUserKey: '',
    guestUserKey: '',
  },
})