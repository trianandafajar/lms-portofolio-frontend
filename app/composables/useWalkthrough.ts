import { ref, computed, type Ref, type ComputedRef } from 'vue'
import type { WalkthroughStep, TooltipPosition, HighlightRect } from '~/types/walkthrough'
import { walkthroughConfig } from '~/config/walkthroughConfig'
import { useTutorialStore } from '~/stores/tutorial'
import { useSidebarStore } from '~/stores/sidebar'
import { calculateTooltipPosition } from '~/utils/tooltipPositioning'

/**
 * Return type for the useWalkthrough composable.
 */
export interface UseWalkthroughReturn {
  isActive: Ref<boolean>
  currentStep: Ref<number>
  totalSteps: Ref<number>
  currentStepConfig: ComputedRef<WalkthroughStep | null>
  highlightRect: Ref<HighlightRect | null>
  tooltipPosition: Ref<TooltipPosition | null>

  startWalkthrough: (routePath: string) => Promise<void>
  nextStep: () => void
  previousStep: () => void
  skipWalkthrough: () => void
  completeWalkthrough: () => void
}

// Shared singleton state (module-level so it's shared across all component instances)
const isActive = ref(false)
const currentStep = ref(0)
const totalSteps = ref(0)
const highlightRect = ref<HighlightRect | null>(null)
const tooltipPosition = ref<TooltipPosition | null>(null)
const currentRoutePath = ref<string>('')
const validSteps = ref<WalkthroughStep[]>([])

/** Default padding around highlighted element */
const HIGHLIGHT_PADDING = 8
/** Default border radius for highlight cutout */
const HIGHLIGHT_BORDER_RADIUS = 8
/** Timeout for waiting for first target element (ms) */
const ELEMENT_WAIT_TIMEOUT = 5000
/** Polling interval when waiting for element (ms) */
const ELEMENT_POLL_INTERVAL = 100

/**
 * Check if a step targets a sidebar element.
 */
function isSidebarStep(step: WalkthroughStep): boolean {
  return step.target.includes('data-walkthrough="sidebar-')
}

/**
 * Check if the viewport is mobile-sized (< lg breakpoint).
 */
function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 1024
}

/**
 * Track whether the sidebar was opened by the walkthrough so we can close it after.
 */
const sidebarOpenedByWalkthrough = ref(false)

/**
 * Get responsive tooltip size based on current viewport width.
 */
function getResponsiveTooltipSize(): { width: number; height: number } {
  if (typeof window === 'undefined') return { width: 320, height: 180 }
  const vw = window.innerWidth
  if (vw < 400) return { width: Math.min(vw - 32, 280), height: 200 }
  if (vw < 640) return { width: Math.min(vw - 32, 300), height: 190 }
  return { width: 320, height: 180 }
}

/**
 * Wait for a DOM element matching the selector to appear, up to a timeout.
 * Uses both polling and MutationObserver for faster detection.
 * Returns the element if found, or null if timeout is reached.
 */
function waitForElement(selector: string, timeout: number = ELEMENT_WAIT_TIMEOUT): Promise<Element | null> {
  return new Promise((resolve) => {
    const element = document.querySelector(selector)
    if (element) {
      resolve(element)
      return
    }

    let resolved = false
    const startTime = Date.now()

    // Use MutationObserver for faster detection
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector)
      if (el && !resolved) {
        resolved = true
        observer.disconnect()
        clearInterval(interval)
        resolve(el)
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    // Also poll as fallback (MutationObserver might miss attribute changes)
    const interval = setInterval(() => {
      if (resolved) {
        clearInterval(interval)
        return
      }
      const el = document.querySelector(selector)
      if (el) {
        resolved = true
        observer.disconnect()
        clearInterval(interval)
        resolve(el)
      } else if (Date.now() - startTime >= timeout) {
        resolved = true
        observer.disconnect()
        clearInterval(interval)
        resolve(null)
      }
    }, ELEMENT_POLL_INTERVAL)
  })
}

/**
 * Calculate the highlight rect for a given DOM element.
 * Clamps the rect to the visible viewport to prevent off-screen highlights
 * that can't be interacted with on mobile.
 */
function calculateHighlightRect(element: Element): HighlightRect {
  const rect = element.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  let x = rect.left - HIGHLIGHT_PADDING
  let y = rect.top - HIGHLIGHT_PADDING
  let width = rect.width + HIGHLIGHT_PADDING * 2
  let height = rect.height + HIGHLIGHT_PADDING * 2

  // Clamp to viewport bounds so the highlight is always visible and clickable
  if (x < 0) {
    width += x // reduce width by the amount off-screen
    x = 0
  }
  if (y < 0) {
    height += y
    y = 0
  }
  if (x + width > viewportWidth) {
    width = viewportWidth - x
  }
  if (y + height > viewportHeight) {
    height = viewportHeight - y
  }

  return {
    x,
    y,
    width: Math.max(width, 0),
    height: Math.max(height, 0),
    borderRadius: HIGHLIGHT_BORDER_RADIUS,
    padding: HIGHLIGHT_PADDING,
  }
}

/**
 * Calculate tooltip position for the current step's target element.
 */
function calculateCurrentTooltipPosition(element: Element, preferredPlacement?: 'top' | 'bottom' | 'left' | 'right'): TooltipPosition {
  const rect = element.getBoundingClientRect()
  const targetRect = {
    x: rect.left - HIGHLIGHT_PADDING,
    y: rect.top - HIGHLIGHT_PADDING,
    width: rect.width + HIGHLIGHT_PADDING * 2,
    height: rect.height + HIGHLIGHT_PADDING * 2,
  }

  const viewportSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  return calculateTooltipPosition(targetRect, getResponsiveTooltipSize(), viewportSize, 8, preferredPlacement)
}

/**
 * Scroll an element into view with smooth behavior.
 * On mobile viewports, uses 'center' for inline alignment to ensure
 * the element is fully visible horizontally (prevents off-screen highlights).
 * Returns a promise that resolves after scroll settles.
 */
function scrollElementIntoView(element: Element): Promise<void> {
  return new Promise((resolve) => {
    const isMobile = isMobileViewport()
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: isMobile ? 'center' : 'nearest',
    })
    // Wait for smooth scroll to settle
    setTimeout(resolve, 350)
  })
}

/**
 * Update the highlight and tooltip position for the current step.
 * Returns true if the target element exists, false otherwise.
 */
function updatePositions(): boolean {
  const step = validSteps.value[currentStep.value]
  if (!step) return false

  const element = document.querySelector(step.target)
  if (!element) return false

  highlightRect.value = calculateHighlightRect(element)
  tooltipPosition.value = calculateCurrentTooltipPosition(element, step.tooltipPlacement)
  return true
}

/**
 * Ensure sidebar is visible for sidebar steps on mobile.
 * Opens the sidebar if needed and waits for the animation to complete.
 * Returns a promise that resolves when the sidebar is ready.
 */
async function ensureSidebarForStep(step: WalkthroughStep): Promise<void> {
  if (!isSidebarStep(step) || !isMobileViewport()) {
    // If moving away from sidebar steps, close sidebar if we opened it
    if (sidebarOpenedByWalkthrough.value && !isSidebarStep(step) && isMobileViewport()) {
      const sidebar = useSidebarStore()
      sidebar.closeMobile()
      sidebarOpenedByWalkthrough.value = false
      // Wait for close animation
      await new Promise(resolve => setTimeout(resolve, 350))
    }
    return
  }

  const sidebar = useSidebarStore()
  if (!sidebar.mobileOpen) {
    sidebar.mobileOpen = true
    sidebarOpenedByWalkthrough.value = true
    // Wait for sidebar slide-in animation to complete
    await new Promise(resolve => setTimeout(resolve, 400))
  }
}

/**
 * Close sidebar if it was opened by walkthrough (cleanup on dismiss).
 */
function closeSidebarIfOpenedByWalkthrough(): void {
  if (sidebarOpenedByWalkthrough.value && isMobileViewport()) {
    const sidebar = useSidebarStore()
    sidebar.closeMobile()
    sidebarOpenedByWalkthrough.value = false
  }
}

/**
 * Close all open popovers/dropdowns in the page.
 * This prevents UI elements like the profile dropdown from staying open
 * when the walkthrough overlay activates.
 */
function closeAllPopovers(): void {
  if (typeof document === 'undefined') return

  // Click the body to dismiss any open popovers/dropdowns
  document.body.click()

  // Also try to close Reka UI / Radix popovers by pressing Escape
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
}

/**
 * Dismiss the walkthrough overlay and reset visual state.
 */
function dismissOverlay(): void {
  closeSidebarIfOpenedByWalkthrough()
  isActive.value = false
  currentStep.value = 0
  totalSteps.value = 0
  highlightRect.value = null
  tooltipPosition.value = null
  validSteps.value = []
  currentRoutePath.value = ''
}

/**
 * Match a route path against the walkthrough config keys.
 * Supports both exact matches and parameterized patterns like /classes/:id.
 * Returns the matching config key or null.
 */
function findMatchingConfigKey(routePath: string): string | null {
  // Exact match first
  if (walkthroughConfig[routePath]) return routePath

  // Try pattern matching for parameterized routes
  for (const configKey of Object.keys(walkthroughConfig)) {
    if (!configKey.includes(':')) continue
    const pattern = configKey.replace(/:[^/]+/g, '[^/]+')
    const regex = new RegExp(`^${pattern}$`)
    if (regex.test(routePath)) return configKey
  }

  return null
}

/**
 * useWalkthrough composable - manages the guided walkthrough system.
 * Uses a shared singleton pattern so state is consistent across components.
 */
export function useWalkthrough(): UseWalkthroughReturn {
  const currentStepConfig = computed<WalkthroughStep | null>(() => {
    if (!isActive.value || validSteps.value.length === 0) return null
    return validSteps.value[currentStep.value] ?? null
  })

  /**
   * Start a walkthrough for the given route path.
   * Loads config, waits for first target element (up to 3s),
   * filters steps with existing DOM targets, and begins the sequence.
   * If all targets are missing, auto-completes the route.
   */
  async function startWalkthrough(routePath: string): Promise<void> {
    // Don't start if already active
    if (isActive.value) return

    // Find matching config key (supports parameterized routes)
    const configKey = findMatchingConfigKey(routePath)
    if (!configKey) return

    // Load config for this route
    const sequence = walkthroughConfig[configKey]
    if (!sequence) return

    const store = useTutorialStore()

    // Check if route is already completed/skipped using the config key
    // This ensures parameterized routes like /classes/48 and /classes/49
    // are treated as the same walkthrough (both use /classes/:id config key)
    if (store.isRouteCompleted(configKey)) return

    // Close any open popovers/dropdowns before starting the walkthrough
    // This prevents the profile dropdown from staying open over the overlay
    closeAllPopovers()

    // Wait for the first target element to appear (up to 5s timeout)
    const firstStep = sequence.steps[0]
    if (!firstStep) return

    const firstElement = await waitForElement(firstStep.target, 5000)
    if (!firstElement) {
      // First target not found within timeout - don't start walkthrough
      return
    }

    // Use ALL steps from config (don't pre-filter)
    // Missing targets will be skipped at navigation time
    validSteps.value = sequence.steps
    // Store the config key so completion is tracked per pattern, not per instance
    currentRoutePath.value = configKey
    currentStep.value = 0
    totalSteps.value = sequence.steps.length
    isActive.value = true

    // If first step targets sidebar on mobile, open it first
    await ensureSidebarForStep(firstStep)

    // Scroll first element into view and update positions
    await scrollElementIntoView(firstElement)
    updatePositions()
  }

  /**
   * Advance to the next step in the walkthrough.
   * Waits briefly for target elements that may still be loading.
   * If at the last step, completes the walkthrough.
   */
  function nextStep(): void {
    if (!isActive.value) return

    // If at the last step, complete the walkthrough
    if (currentStep.value >= totalSteps.value - 1) {
      completeWalkthrough()
      return
    }

    // Move to next step index
    const nextIndex = currentStep.value + 1
    const step = validSteps.value[nextIndex]
    if (!step) {
      completeWalkthrough()
      return
    }

    currentStep.value = nextIndex

    // Ensure sidebar is open/closed as needed, then show step
    const showStep = async () => {
      await ensureSidebarForStep(step)

      const element = document.querySelector(step.target)
      if (element) {
        await scrollElementIntoView(element)
        updatePositions()
      } else {
        // Wait up to 1s for the element to appear
        const startTime = Date.now()
        const interval = setInterval(() => {
          const el = document.querySelector(step.target)
          if (el) {
            clearInterval(interval)
            scrollElementIntoView(el).then(() => {
              updatePositions()
            })
          } else if (Date.now() - startTime >= 1000) {
            clearInterval(interval)
            // Skip this step, try next
            if (currentStep.value < totalSteps.value - 1) {
              nextStep()
            } else {
              completeWalkthrough()
            }
          }
        }, 100)
      }
    }

    showStep()
  }

  /**
   * Go back to the previous step in the walkthrough.
   */
  function previousStep(): void {
    if (!isActive.value) return
    if (currentStep.value <= 0) return

    const prevIndex = currentStep.value - 1
    const step = validSteps.value[prevIndex]
    if (!step) return

    currentStep.value = prevIndex

    const showPrevStep = async () => {
      await ensureSidebarForStep(step)

      const element = document.querySelector(step.target)
      if (element) {
        await scrollElementIntoView(element)
        updatePositions()
      } else {
        // If element not found, try going back further
        if (prevIndex > 0) {
          previousStep()
        }
      }
    }

    showPrevStep()
  }

  /**
   * Skip the walkthrough - dismiss overlay and mark route as skipped.
   */
  function skipWalkthrough(): void {
    if (!isActive.value) return

    const store = useTutorialStore()
    const routePath = currentRoutePath.value
    dismissOverlay()
    store.markRouteSkipped(routePath)
  }

  /**
   * Complete the walkthrough - dismiss overlay and mark route as completed.
   */
  function completeWalkthrough(): void {
    if (!isActive.value) return

    const store = useTutorialStore()
    const routePath = currentRoutePath.value
    dismissOverlay()
    store.markRouteCompleted(routePath)
  }

  return {
    isActive,
    currentStep,
    totalSteps,
    currentStepConfig,
    highlightRect,
    tooltipPosition,

    startWalkthrough,
    nextStep,
    previousStep,
    skipWalkthrough,
    completeWalkthrough,
  }
}
