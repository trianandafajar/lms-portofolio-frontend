import { defineStore } from 'pinia'

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
    key: 'tutorial-state',
  },
})
