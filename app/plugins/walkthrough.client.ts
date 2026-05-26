import { nextTick } from 'vue'
import { useWalkthrough } from '~/composables/useWalkthrough'
import { useTutorialStore } from '~/stores/tutorial'
import { walkthroughConfig } from '~/config/walkthroughConfig'

/**
 * Match a route path against the walkthrough config keys.
 * Supports both exact matches and parameterized patterns like /classes/:id.
 * Returns the matching config key or null.
 */
function findMatchingConfigKey(routePath: string): string | null {
  if (walkthroughConfig[routePath]) return routePath

  for (const configKey of Object.keys(walkthroughConfig)) {
    if (!configKey.includes(':')) continue
    const pattern = configKey.replace(/:[^/]+/g, '[^/]+')
    const regex = new RegExp(`^${pattern}$`)
    if (regex.test(routePath)) return configKey
  }

  return null
}

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

      // Resolve the config key for this route (handles parameterized routes)
      const configKey = findMatchingConfigKey(to.path)

      // If route is already completed or skipped (check config key), do nothing
      if (configKey && store.isRouteCompleted(configKey)) {
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
