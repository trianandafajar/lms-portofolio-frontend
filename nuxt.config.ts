// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@pinia/nuxt', '@nuxt/ui', '@nuxtjs/color-mode', 'pinia-plugin-persistedstate/nuxt', 'nuxt-tiptap-editor'],
  css: ['~/assets/css/main.css'],

  devServer: {
    
  },


  app: {
    head: {
      title: "Ims Portofolio",
      meta: [
        { name: 'description', content: 'ims Portofolio' }
      ],
      link: [
        { rel: 'preload', as: 'style', href: '/assets/css/main.css' }
      ]
    }
  },

  tiptap: {
    prefix: 'Tiptap', //prefix for Tiptap imports, composables not included
  },

  pinia: {
     storesDirs: ['./app/stores/**'],
  },

  typescript: {
    strict: true,
    typeCheck: true
  },
  nitro: {
    typescript: {
      strict: true
    }
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
    },
  },

  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: '',
    storageKey: 'nuxt-color-mode',
    storage: 'localStorage'
  },
  ui: {
    colorMode: false
  },
  
  devtools: { enabled: true },
})