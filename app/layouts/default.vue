<template>
  <TooltipProvider>
    <div class="min-h-screen flex bg-slate-50 text-slate-900">
      <!-- Mobile backdrop overlay -->
      <Transition name="fade">
        <div
          v-if="sidebar.mobileOpen"
          class="fixed inset-0 bg-black/40 z-40 lg:hidden"
          @click="handleBackdropClick"
        />
      </Transition>

      <!-- Sidebar -->
      <div :class="[
        'fixed inset-y-0 left-0 z-50 lg:static lg:z-auto',
        'transform transition-transform duration-300 ease-in-out lg:transform-none',
        sidebar.mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]">
        <PartialSidebar />
      </div>

      <!-- Main content -->
      <div class="flex-1 flex flex-col min-w-0">
        <PartialHeader />
        <main class="p-4 sm:p-6 overflow-y-auto" style="height: calc(100vh - 64px);">
          <slot />
        </main>
      </div>
    </div>
  </TooltipProvider>
</template>

<script setup lang="ts">
import { TooltipProvider } from 'reka-ui'
import { useSidebarStore } from '~/stores/sidebar'

const sidebar = useSidebarStore()

// Don't close sidebar via backdrop if walkthrough is controlling it
function handleBackdropClick() {
  const walkthroughActive = document.querySelector('[data-walkthrough-overlay]')
  if (walkthroughActive) return
  sidebar.closeMobile()
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
