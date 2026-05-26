import { defineStore } from 'pinia'

/**
 * Generate a unique storage key based on the app's public API base URL.
 * This prevents localStorage collisions when multiple apps share the same components.
 * Uses the NUXT_PUBLIC_API_BASE_URL to differentiate between apps.
 */
function getAppStorageKey(): string {
  try {
    const config = useRuntimeConfig()
    const baseUrl = (config.public?.apiBaseUrl as string) || ''
    if (baseUrl) {
      const identifier = baseUrl
        .replace(/https?:\/\//, '')
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 30)
      return `tutorial-state-${identifier}`
    }
  } catch {
    // useRuntimeConfig not available yet, use fallback
  }
  // Fallback: use window location origin if available
  if (typeof window !== 'undefined') {
    const origin = window.location.origin
      .replace(/https?:\/\//, '')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .slice(0, 30)
    return `tutorial-state-${origin}`
  }
  return 'tutorial-state-default'
}

export const useTutorialStore = defineStore("tutorial", {
  state: () => ({
    completedRoutes: {} as Record<string, 'completed' | 'skipped'>,
  }),

  actions: {
    /**
     * Check if a route has been completed or skipped.
     * Returns true if the route exists in completedRoutes (either 'completed' or 'skipped').
     */
    isRouteCompleted(routePath: string): boolean {
      return routePath in this.completedRoutes
    },

    /**
     * Mark a route as completed after the user finishes the walkthrough.
     */
    markRouteCompleted(routePath: string): void {
      this.completedRoutes[routePath] = 'completed'
    },

    /**
     * Mark a route as skipped when the user dismisses the walkthrough.
     * The route is still considered "completed" for first-time detection purposes.
     */
    markRouteSkipped(routePath: string): void {
      this.completedRoutes[routePath] = 'skipped'
    },

    /**
     * Reset all walkthrough completion state, allowing walkthroughs to trigger again.
     */
    resetAllRoutes(): void {
      this.completedRoutes = {}
    },
  },

  persist: {
    key: getAppStorageKey(),
  },
})
