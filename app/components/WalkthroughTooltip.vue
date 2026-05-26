<template>
  <div
    class="walkthrough-tooltip"
    :class="[`walkthrough-tooltip--${position.placement}`]"
    :style="{
      top: `${clampedTop}px`,
      left: `${clampedLeft}px`,
      maxWidth: `calc(100vw - 16px)`,
    }"
  >
    <!-- Skip button positioned at top-right -->
    <button
      type="button"
      class="absolute top-3 right-3 text-xs text-slate-400 hover:text-slate-600 font-medium transition cursor-pointer"
      @click="$emit('skip')"
    >
      Skip
    </button>

    <!-- Title -->
    <h3 class="text-sm sm:text-base font-semibold text-slate-900 pr-10">
      {{ title }}
    </h3>

    <!-- Description -->
    <p class="text-xs sm:text-sm text-slate-500 mt-1.5 sm:mt-2 leading-relaxed">
      {{ description }}
    </p>

    <!-- Step indicator -->
    <div class="flex items-center gap-1 sm:gap-1.5 mt-2.5 sm:mt-3 flex-wrap">
      <template v-for="i in totalSteps" :key="i">
        <span
          class="inline-block rounded-full transition-all duration-300"
          :class="i <= currentStep
            ? 'w-2 h-2 bg-emerald-500'
            : 'w-1.5 h-1.5 bg-slate-300'"
        />
      </template>
      <span class="text-xs text-slate-400 ml-1.5">
        {{ currentStep }}/{{ totalSteps }}
      </span>
    </div>

    <!-- Navigation buttons -->
    <div class="flex items-center justify-between mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-slate-100">
      <button
        v-if="!isFirstStep"
        type="button"
        class="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
        @click="$emit('previous')"
      >
        Previous
      </button>
      <span v-else />

      <!-- Click action: no next button needed, user clicks the element -->
      <span v-if="isClickAction" />
      <button
        v-else-if="!isLastStep"
        type="button"
        class="px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-medium transition cursor-pointer"
        @click="$emit('next')"
      >
        Next
      </button>
      <button
        v-else
        type="button"
        class="px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-medium transition cursor-pointer"
        @click="$emit('finish')"
      >
        Finish
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TooltipPosition } from '~/types/walkthrough'

const props = defineProps<{
  title: string
  description: string
  currentStep: number
  totalSteps: number
  isFirstStep: boolean
  isLastStep: boolean
  isClickAction: boolean
  position: TooltipPosition
}>()

defineEmits<{
  next: []
  previous: []
  skip: []
  finish: []
}>()

/** Clamp tooltip position so it never overflows the viewport */
const clampedLeft = computed(() => {
  if (typeof window === 'undefined') return props.position.left
  const maxLeft = window.innerWidth - 328 // 320px width + 8px safety margin
  return Math.max(8, Math.min(props.position.left, maxLeft))
})

const clampedTop = computed(() => {
  if (typeof window === 'undefined') return props.position.top
  const maxTop = window.innerHeight - 8
  return Math.max(8, Math.min(props.position.top, maxTop))
})
</script>

<style scoped>
.walkthrough-tooltip {
  position: fixed;
  z-index: 10001;
  width: min(320px, calc(100vw - 16px));
  max-width: calc(100vw - 16px);
  background: white;
  border-radius: 12px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  padding: 14px;
  overflow: hidden;
  box-sizing: border-box;
  transition: top 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              left 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.3s ease,
              transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: tooltip-enter 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@media (min-width: 640px) {
  .walkthrough-tooltip {
    width: 320px;
    max-width: 320px;
    padding: 20px;
  }
}

/* Directional entry animations */
.walkthrough-tooltip--bottom {
  transform-origin: top center;
}
.walkthrough-tooltip--top {
  transform-origin: bottom center;
}
.walkthrough-tooltip--left {
  transform-origin: right center;
}
.walkthrough-tooltip--right {
  transform-origin: left center;
}

@keyframes tooltip-enter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(4px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
