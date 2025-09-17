<template>
  <header class="flex items-center justify-between px-6 py-3 bg-white shadow-sm">
    <div class="flex items-center gap-4">
      <button @click="sidebar.toggleCollapse" class="p-1 rounded hover:bg-slate-100">
        <UIcon name="heroicons-bars-3" class="h-6 w-6 text-slate-700" />
      </button>
    </div>

    <div class="flex items-center gap-3">
      <UButton size="sm" variant="ghost" class="p-2 rounded-full" aria-label="Create">
        <UIcon name="heroicons-plus" class="h-4 w-4 text-slate-700" />
      </UButton>

      <!-- Avatar -->
      <div
        class="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 text-white flex items-center justify-center font-medium"
      >
        A
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const sidebar = useSidebarStore()
</script>
