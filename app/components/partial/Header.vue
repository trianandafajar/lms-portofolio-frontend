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

      <UPopover placement="bottom-end" arrow>
        <UTooltip text="Akun saya">
          <UButton
            class="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 text-white flex items-center justify-center font-medium focus:outline-none"
          >
            {{ auth?.user?.profile?.display_name?.charAt(0)?.toUpperCase() || '' }}
          </UButton>
        </UTooltip>

        <template #content>
          <div class="w-64 p-3">
            <div class="flex items-center gap-3 p-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 text-white flex items-center justify-center font-medium">
                A
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-slate-800">{{ auth?.user?.profile?.display_name }}</span>
                <span class="text-xs text-slate-500">{{ auth?.user?.email }}</span>
              </div>
            </div>
            <div class="my-2 border-t border-slate-100"></div>
            <nav class="flex flex-col">
              <UButton color="primary" variant="ghost" class="justify-start">Profil</UButton>
              <UButton color="primary" variant="ghost" class="justify-start">Pengaturan</UButton>
              <UButton color="warning" variant="ghost" class="justify-start">Keluar</UButton>
            </nav>
          </div>
        </template>
      </UPopover>
    </div>
  </header>
</template>

<script setup lang="ts">
const sidebar = useSidebarStore()
const auth = useAuthStore()
</script>
