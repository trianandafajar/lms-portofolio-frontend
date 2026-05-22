import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    root: '.',
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.nuxt', 'dist'],
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './app'),
      '~/': resolve(__dirname, './app/'),
      '@': resolve(__dirname, './app'),
      '@/': resolve(__dirname, './app/'),
      '#app': resolve(__dirname, './node_modules/nuxt/dist/app'),
    },
  },
})
