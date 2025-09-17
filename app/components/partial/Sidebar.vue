<template>
  <aside
    :class="[
      'flex flex-col bg-white transition-all duration-300 ease-in-out h-screen shadow-sm',
      collapsed ? 'w-24' : 'w-72'
    ]"
  >
    <!-- Top: Brand + Collapse -->
    <div class="flex items-center justify-between px-8 py-3">
      <div class="flex items-center gap-3">
        <span class="font-semibold text-slate-800 text-lg">LMS</span>
      </div>
    </div>

    <!-- Main nav -->
    <nav class="px-3 py-2">
      <ul class="space-y-1">
        <li v-for="item in mainNav" :key="item.label">
          <a
            :href="item.to"
            class="group flex items-center gap-3 p-2 rounded-lg transition-colors duration-150"
          >
            <div
              class="flex items-center justify-center w-9 h-9 rounded-full
                     group-hover:bg-slate-100 group-hover:scale-105 transition"
              :class="collapsed ? 'mx-auto' : ''"
            >
              <UIcon :name="item.icon" class="h-5 w-5 text-slate-600" />
            </div>
            <span v-if="!collapsed" class="text-sm text-slate-700">{{ item.label }}</span>
          </a>
        </li>
      </ul>
    </nav>

    <!-- Divider -->
    <div class="mx-3 border-t border-slate-100 my-2"></div>

    <!-- Collapsible Class List -->
    <PartialClassList />

    <!-- Footer nav -->
    <div class="px-3 pb-4">
      <ul class="space-y-1">
        <li v-for="item in footerNav" :key="item.label">
          <a
            :href="item.to"
            class="group flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition"
          >
            <div
              class="flex items-center justify-center w-9 h-9 rounded-full transition group-hover:bg-slate-100"
            >
              <UIcon :name="item.icon" class="h-5 w-5 text-slate-600" />
            </div>
            <span v-if="!collapsed" class="text-sm text-slate-700">{{ item.label }}</span>
          </a>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
const sidebar = useSidebarStore()
const collapsed = computed(() => sidebar.collapsed)

const mainNav = [
  { label: 'Beranda', icon: 'heroicons-home', to: '/' },
  { label: 'Kalender', icon: 'heroicons-calendar', to: '/calendar' },
]

const footerNav = [
  { label: 'Kelas diarsipkan', icon: 'heroicons-archive-box', to: '/archived' },
  { label: 'Setelan', icon: 'heroicons-cog-6-tooth', to: '/settings' },
]
</script>
