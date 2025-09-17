<template>
  <div class="min-h-screen flex bg-slate-50 text-slate-900">
    <PartialSidebar />
    <div class="flex-1 flex flex-col">
      <PartialHeader />
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
