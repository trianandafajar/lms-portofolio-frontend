<template>
  <div
    class="fixed z-[10001] w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-5 transition-all duration-300 ease-out"
    :style="{
      top: `${position.top}px`,
      left: `${position.left}px`,
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
    <h3 class="text-base font-semibold text-slate-900 pr-10">
      {{ title }}
    </h3>

    <!-- Description -->
    <p class="text-sm text-slate-500 mt-2 leading-relaxed">
      {{ description }}
    </p>

    <!-- Step indicator -->
    <p class="text-xs text-slate-400 mt-3">
      {{ currentStep }} of {{ totalSteps }}
    </p>

    <!-- Navigation buttons -->
    <div class="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
      <button
        v-if="!isFirstStep"
        type="button"
        class="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
        @click="$emit('previous')"
      >
        Previous
      </button>
      <span v-else />

      <!-- Show "Click the button" hint when action is click -->
      <span v-if="isClickAction" class="text-xs text-emerald-600 font-medium animate-pulse">
        👆 Click the highlighted element
      </span>
      <button
        v-else-if="!isLastStep"
        type="button"
        class="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition cursor-pointer"
        @click="$emit('next')"
      >
        Next
      </button>
      <button
        v-else
        type="button"
        class="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition cursor-pointer"
        @click="$emit('finish')"
      >
        Finish
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
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
</script>
