export default defineNuxtPlugin(() => {
  const colorMode = useColorMode()

  colorMode.preference = 'light'
  colorMode.value = 'light'

  if (process.client) {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
  }
})
