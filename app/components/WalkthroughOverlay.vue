<script setup lang="ts">
/**
 * WalkthroughOverlay component
 *
 * Renders a full-screen overlay with an SVG-based spotlight mask that creates
 * a cutout around the currently highlighted element. Integrates with the
 * useWalkthrough composable for state management.
 *
 * Features:
 * - Smooth animated highlight transitions
 * - Responsive positioning on all screen sizes
 * - Recalculates on resize/scroll
 */
import { onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useWalkthrough } from '~/composables/useWalkthrough'
import { calculateTooltipPosition } from '~/utils/tooltipPositioning'

const {
  isActive,
  currentStep,
  totalSteps,
  currentStepConfig,
  highlightRect,
  tooltipPosition,
  nextStep,
  previousStep,
  skipWalkthrough,
  completeWalkthrough,
} = useWalkthrough()

/** Whether the current step requires the user to click the highlighted element */
const isClickAction = computed(() => currentStepConfig.value?.action === 'click')

/** Responsive tooltip size based on viewport width */
const responsiveTooltipSize = computed(() => {
  if (typeof window === 'undefined') return { width: 320, height: 180 }
  const vw = window.innerWidth
  if (vw < 400) return { width: Math.min(vw - 32, 280), height: 200 }
  if (vw < 640) return { width: Math.min(vw - 32, 300), height: 190 }
  return { width: 320, height: 180 }
})

/** Debounce timer for resize/scroll handler */
let resizeTimer: ReturnType<typeof setTimeout> | null = null

/**
 * Recalculate highlight and tooltip positions based on current DOM state.
 */
function recalculatePositions(): void {
  if (!isActive.value || !currentStepConfig.value) return

  const element = document.querySelector(currentStepConfig.value.target)
  if (!element) return

  const rect = element.getBoundingClientRect()
  const padding = 8
  const borderRadius = 8

  highlightRect.value = {
    x: rect.left - padding,
    y: rect.top - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
    borderRadius,
    padding,
  }

  const targetRect = {
    x: rect.left - padding,
    y: rect.top - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  }
  const viewportSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  tooltipPosition.value = calculateTooltipPosition(targetRect, responsiveTooltipSize.value, viewportSize)
}

/**
 * Handle window resize: recalculate overlay and tooltip positions.
 * Debounced to avoid excessive recalculations during resize.
 */
function handleResize(): void {
  if (!isActive.value) return

  if (resizeTimer) {
    clearTimeout(resizeTimer)
  }

  resizeTimer = setTimeout(() => {
    recalculatePositions()
  }, 80)
}

/**
 * Handle scroll events: recalculate positions immediately for smooth tracking.
 */
function handleScroll(): void {
  if (!isActive.value) return
  recalculatePositions()
}

/**
 * Handle keydown events.
 * Escape key triggers skip walkthrough.
 */
function handleKeydown(event: KeyboardEvent): void {
  if (!isActive.value) return

  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    skipWalkthrough()
  }
}

/**
 * Prevent clicks on the overlay from propagating.
 * Clicking outside the highlighted area does NOT dismiss the walkthrough.
 */
function handleOverlayClick(event: MouseEvent): void {
  event.preventDefault()
  event.stopPropagation()
}

/**
 * Handle click on the highlighted element area.
 * If the current step has action: 'click', trigger the actual element click
 * and advance/complete the walkthrough.
 */
function handleHighlightClick(event: MouseEvent): void {
  if (!isClickAction.value) return

  // Find and click the actual target element
  if (currentStepConfig.value) {
    const element = document.querySelector(currentStepConfig.value.target) as HTMLElement
    if (element) {
      // Dismiss the walkthrough first, then click the element
      if (currentStep.value >= totalSteps.value - 1) {
        completeWalkthrough()
      } else {
        nextStep()
      }
      // Small delay to let the overlay dismiss before triggering the click
      setTimeout(() => {
        element.click()
      }, 50)
    }
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', handleScroll, true)
  window.addEventListener('keydown', handleKeydown, true)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleScroll, true)
  window.removeEventListener('keydown', handleKeydown, true)
  if (resizeTimer) {
    clearTimeout(resizeTimer)
  }
})

// Lock/unlock body scroll when walkthrough is active
watch(isActive, (active) => {
  if (active) {
    document.body.style.overflow = 'hidden'
    // Also lock scroll on inner containers (e.g., main content area)
    document.querySelectorAll('[style*="overflow"], .overflow-y-auto, .overflow-auto').forEach((el) => {
      const htmlEl = el as HTMLElement
      htmlEl.dataset.walkthroughOverflow = htmlEl.style.overflow || getComputedStyle(htmlEl).overflowY
      htmlEl.style.overflow = 'hidden'
    })
  } else {
    document.body.style.overflow = ''
    // Restore scroll on inner containers
    document.querySelectorAll('[data-walkthrough-overflow]').forEach((el) => {
      const htmlEl = el as HTMLElement
      const original = htmlEl.dataset.walkthroughOverflow
      if (original && original !== 'hidden') {
        htmlEl.style.overflow = original
      } else {
        htmlEl.style.overflow = ''
      }
      delete htmlEl.dataset.walkthroughOverflow
    })
  }
}, { immediate: true })
</script>

<template>
  <Transition name="walkthrough-fade">
    <div
      v-if="isActive"
      class="walkthrough-overlay"
      data-walkthrough-overlay
      @click.stop.prevent="handleOverlayClick"
      @pointerdown.stop.prevent
      @pointerup.stop.prevent
      aria-modal="true"
      role="dialog"
      aria-label="Guided walkthrough"
    >
      <!-- SVG-based spotlight mask -->
      <svg
        class="walkthrough-overlay__mask"
        xmlns="http://www.w3.org/2000/svg"
        :width="'100%'"
        :height="'100%'"
      >
        <defs>
          <mask id="walkthrough-spotlight-mask">
            <!-- White rect = visible (shows the dark overlay) -->
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <!-- Black rect = cutout (transparent area around highlighted element) -->
            <rect
              v-if="highlightRect"
              class="walkthrough-cutout"
              :x="highlightRect.x"
              :y="highlightRect.y"
              :width="highlightRect.width"
              :height="highlightRect.height"
              :rx="highlightRect.borderRadius"
              :ry="highlightRect.borderRadius"
              fill="black"
            />
          </mask>
        </defs>
        <!-- Semi-transparent dark overlay with mask applied -->
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.55)"
          mask="url(#walkthrough-spotlight-mask)"
        />
      </svg>

      <!-- Highlight ring around the target element -->
      <div
        v-if="highlightRect"
        class="walkthrough-highlight-ring"
        :class="{ 'walkthrough-highlight-ring--clickable': isClickAction }"
        :style="{
          top: `${highlightRect.y}px`,
          left: `${highlightRect.x}px`,
          width: `${highlightRect.width}px`,
          height: `${highlightRect.height}px`,
          borderRadius: `${highlightRect.borderRadius}px`,
        }"
        @click.stop="handleHighlightClick"
      />

      <!-- Walkthrough Tooltip -->
      <WalkthroughTooltip
        v-if="currentStepConfig && tooltipPosition"
        :title="currentStepConfig.title"
        :description="currentStepConfig.description"
        :current-step="currentStep + 1"
        :total-steps="totalSteps"
        :is-first-step="currentStep === 0"
        :is-last-step="currentStep === totalSteps - 1"
        :is-click-action="isClickAction"
        :position="tooltipPosition"
        @next="nextStep"
        @previous="previousStep"
        @skip="skipWalkthrough"
        @finish="completeWalkthrough"
      />
    </div>
  </Transition>
</template>

<style scoped>
.walkthrough-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: auto;
}

.walkthrough-overlay__mask {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.walkthrough-cutout {
  transition: x 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              y 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.walkthrough-highlight-ring {
  position: fixed;
  pointer-events: none;
  box-shadow:
    0 0 0 3px rgba(16, 185, 129, 0.7),
    0 0 0 6px rgba(16, 185, 129, 0.2),
    0 0 20px 4px rgba(16, 185, 129, 0.15);
  transition: top 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              left 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              height 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.3s ease;
  z-index: 10000;
  animation: highlight-breathe 2s ease-in-out infinite;
}

.walkthrough-highlight-ring--clickable {
  pointer-events: auto;
  cursor: pointer;
  animation: highlight-pulse 1.5s ease-in-out infinite;
}

@keyframes highlight-breathe {
  0%, 100% {
    box-shadow:
      0 0 0 3px rgba(16, 185, 129, 0.7),
      0 0 0 6px rgba(16, 185, 129, 0.2),
      0 0 20px 4px rgba(16, 185, 129, 0.15);
  }
  50% {
    box-shadow:
      0 0 0 3px rgba(16, 185, 129, 0.5),
      0 0 0 8px rgba(16, 185, 129, 0.15),
      0 0 24px 6px rgba(16, 185, 129, 0.1);
  }
}

@keyframes highlight-pulse {
  0%, 100% {
    box-shadow:
      0 0 0 3px rgba(16, 185, 129, 0.8),
      0 0 0 6px rgba(16, 185, 129, 0.3),
      0 0 20px 4px rgba(16, 185, 129, 0.2);
  }
  50% {
    box-shadow:
      0 0 0 5px rgba(16, 185, 129, 0.9),
      0 0 0 10px rgba(16, 185, 129, 0.25),
      0 0 30px 8px rgba(16, 185, 129, 0.2);
  }
}

.walkthrough-fade-enter-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.walkthrough-fade-leave-active {
  transition: opacity 0.25s ease-out;
}
.walkthrough-fade-enter-from,
.walkthrough-fade-leave-to {
  opacity: 0;
}
</style>
