import { ref, computed, type Ref, type ComputedRef } from 'vue'
import type { WalkthroughStep, TooltipPosition, HighlightRect } from '~/types/walkthrough'
import { walkthroughConfig } from '~/config/walkthroughConfig'
import { useTutorialStore } from '~/stores/tutorial'
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
const HIGHLIGHT_BORDER_RADIUS = 4
/** Timeout for waiting for first target element (ms) */
const ELEMENT_WAIT_TIMEOUT = 3000
/** Polling interval when waiting for element (ms) */
const ELEMENT_POLL_INTERVAL = 100
/** Default tooltip size estimate for positioning */
const TOOLTIP_SIZE = { width: 320, height: 180 }

/**
 * Wait for a DOM element matching the selector to appear, up to a timeout.
 * Returns the element if found, or null if timeout is reached.
 */
function waitForElement(selector: string, timeout: number = ELEMENT_WAIT_TIMEOUT): Promise<Element | null> {
  return new Promise((resolve) => {
    const element = document.querySelector(selector)
    if (element) {
      resolve(element)
      return
    }

    const startTime = Date.now()
    const interval = setInterval(() => {
      const el = document.querySelector(selector)
      if (el) {
        clearInterval(interval)
        resolve(el)
      } else if (Date.now() - startTime >= timeout) {
        clearInterval(interval)
        resolve(null)
      }
    }, ELEMENT_POLL_INTERVAL)
  })
}

/**
 * Calculate the highlight rect for a given DOM element.
 */
function calculateHighlightRect(element: Element): HighlightRect {
  const rect = element.getBoundingClientRect()
  return {
    x: rect.left - HIGHLIGHT_PADDING,
    y: rect.top - HIGHLIGHT_PADDING,
    width: rect.width + HIGHLIGHT_PADDING * 2,
    height: rect.height + HIGHLIGHT_PADDING * 2,
    borderRadius: HIGHLIGHT_BORDER_RADIUS,
    padding: HIGHLIGHT_PADDING,
  }
}

/**
 * Calculate tooltip position for the current step's target element.
 */
function calculateCurrentTooltipPosition(element: Element): TooltipPosition {
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

  return calculateTooltipPosition(targetRect, TOOLTIP_SIZE, viewportSize)
}

/**
 * Scroll an element into view with smooth behavior.
 * Returns a promise that resolves after scroll settles.
 */
function scrollElementIntoView(element: Element): Promise<void> {
  return new Promise((resolve) => {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
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
  tooltipPosition.value = calculateCurrentTooltipPosition(element)
  return true
}

/**
 * Dismiss the walkthrough overlay and reset visual state.
 */
function dismissOverlay(): void {
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

    // Check if route is already completed/skipped (check both actual path and config key)
    if (store.isRouteCompleted(routePath) || store.isRouteCompleted(configKey)) return

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
    currentRoutePath.value = routePath
    currentStep.value = 0
    totalSteps.value = sequence.steps.length
    isActive.value = true

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

    // Try to find element, with a short retry
    const tryShowStep = () => {
      const element = document.querySelector(step.target)
      if (element) {
        scrollElementIntoView(element).then(() => {
          updatePositions()
        })
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

    tryShowStep()
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

    const element = document.querySelector(step.target)
    if (element) {
      scrollElementIntoView(element).then(() => {
        updatePositions()
      })
    } else {
      // If element not found, try going back further
      if (prevIndex > 0) {
        previousStep()
      }
    }
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
