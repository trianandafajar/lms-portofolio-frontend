export default defineNuxtPlugin({
  name: 'auth-fetch-current-user',
  async setup (nuxtApp) {
    const token = useCookie<string | null>('token')
    const authStore = useAuthStore()

    if (token && !authStore.user) {
      try {
        await authStore.fetchCurrentUser()
      } catch (err) {
        console.error('Failed fetch user:', err)
        authStore.clearAuth()
      }
    }
  }
})
