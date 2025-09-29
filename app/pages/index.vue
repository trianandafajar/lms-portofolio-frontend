<template>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <UCard v-for="n in 12" :key="n">
      <template #header>
        <Placeholder class="h-8">
          <h1 class="text-2xl font-bold">
            XII RPL 1
          </h1>
          <h4 class="text-sm text-gray-500">
            KARIR DIRI
          </h4>
        </Placeholder>
      </template>

      <Placeholder class="h-32">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 text-white flex items-center justify-center font-medium">
            A
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-medium text-slate-800">
              Andi
            </span>
            <span class="text-xs text-slate-500">
              andi@gmail.com
            </span>
          </div>
        </div>
      </Placeholder>

      <template #footer>
        <Placeholder class="h-8">
          <span>
            18 Student
          </span>
        </Placeholder>
      </template>
    </UCard>
  </div>

</template>

<script setup lang="ts">
</script>
