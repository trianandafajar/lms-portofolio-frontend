import { nextTick } from 'vue'
import { useWalkthrough } from '~/composables/useWalkthrough'
import { useTutorialStore } from '~/stores/tutorial'

export default defineNuxtPlugin({
  name: 'walkthrough-auto-start',
  parallel: true,
  setup() {
    const router = useRouter()

    router.afterEach((to) => {
      const walkthrough = useWalkthrough()

      // Handle route navigation during active walkthrough:
      // dismiss without recording state (just reset state)
      if (walkthrough.isActive.value) {
        walkthrough.isActive.value = false
        walkthrough.currentStep.value = 0
        walkthrough.totalSteps.value = 0
        walkthrough.highlightRect.value = null
        walkthrough.tooltipPosition.value = null
        return
      }

      const store = useTutorialStore()

      // If route is already completed or skipped, do nothing
      if (store.isRouteCompleted(to.path)) {
        return
      }

      // Wait for DOM ready with multiple attempts
      // Use a longer delay for auth pages since they render inside a layout
      const isAuthRoute = to.path.startsWith('/auth')
      const initialDelay = isAuthRoute ? 1500 : 1000

      nextTick(() => {
        setTimeout(() => {
          walkthrough.startWalkthrough(to.path)
        }, initialDelay)
      })
    })
  },
})
