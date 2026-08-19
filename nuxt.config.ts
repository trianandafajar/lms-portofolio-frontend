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
        { property: "og:title", content: "Mentora LMS" },
        { property: "og:description", content: "Mentora Learning Management System" },
        { property: "og:image", content: "/images/logo.png" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: "Mentora LMS" },
        { name: "twitter:description", content: "Mentora Learning Management System" },
        { name: "twitter:image", content: "/images/logo.png" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/images/favicon-16x16.png" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/images/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "192x192", href: "/images/favicon-192x192.png" },
        { rel: "icon", type: "image/png", sizes: "512x512", href: "/images/favicon-512x512.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/images/apple-touch-icon.png" },
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
    groqApiKey: process.env.GROQ_API_KEY,
    groqModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
      paypalClientId: process.env.NUXT_PUBLIC_PAYPAL_CLIENT_ID,
      stripePublishableKey: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
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
