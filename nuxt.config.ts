// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: [
    "@pinia/nuxt",
    "@nuxt/ui",
    "@nuxtjs/color-mode",
    "pinia-plugin-persistedstate/nuxt",
  ],
  css: ["~/assets/css/main.css"],

  app: {
    head: {
      title: "Mentora LMS",
      meta: [
        { name: "description", content: "Mentora Learning Management System" },
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/images/small_icon.png" },
        { rel: "preload", as: "style", href: "/assets/css/main.css" },
      ],
    },
  },

  pinia: {
    storesDirs: ["./app/stores/**"],
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },
  nitro: {
    typescript: {
      strict: true,
    },
  },

  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,
    geminiModel: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
      paypalClientId: process.env.NUXT_PUBLIC_PAYPAL_CLIENT_ID,
    },
  },

  colorMode: {
    preference: "light",
    fallback: "light",
    classSuffix: "",
    storageKey: "nuxt-color-mode",
    storage: "localStorage",
  },
  ui: {
    colorMode: false,
  },

  devtools: { enabled: true },
  vite: {
    server: {
      allowedHosts: ["mentora.allfilldev.com"],
    },
  },
});
