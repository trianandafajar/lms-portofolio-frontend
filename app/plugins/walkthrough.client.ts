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

      // Wait for DOM ready: nextTick + setTimeout to allow rendering and data loading
      nextTick(() => {
        setTimeout(() => {
          walkthrough.startWalkthrough(to.path)
        }, 1000)
      })
    })
  },
})
