<template>
  <aside
    @mouseenter="sidebar.hovered = true"
    @mouseleave="sidebar.hovered = false"
    :class="[
      'flex flex-col bg-white transition-all duration-300 ease-in-out h-screen shadow-sm',
      (sidebar.collapsed && !sidebar.hovered) ? 'w-24' : 'w-72'
    ]"
  >
    <div
      :class="[
        'flex items-center px-4 py-3 transition-all',
        (sidebar.collapsed && !sidebar.hovered) ? 'justify-center' : 'justify-between'
      ]"
    >
      <NuxtLink to="/" class="font-semibold text-slate-800 text-lg" v-if="!sidebar.collapsed || sidebar.hovered">
        LMS
      </NuxtLink>
      <NuxtLink to="/" v-else class="font-semibold text-slate-800 text-lg">LMS</NuxtLink> 
    </div>

    <!-- Main nav -->
    <nav class="px-0 py-2">
      <ul class="space-y-1">
        <li v-for="item in mainNav" :key="item.label">
          <NuxtLink
            :to="item.to"
            :class="[
              'group flex items-center gap-3 p-2 rounded-lg transition-colors duration-150 w-full',
              (sidebar.collapsed && !sidebar.hovered) ? 'justify-center px-0' : 'justify-start px-3'
            ]"
          >
            <div
              class="flex items-center justify-center w-9 h-9 rounded-full transition group-hover:bg-slate-100 group-hover:scale-105"
            >
              <UIcon :name="item.icon" class="h-5 w-5 text-slate-600" />
            </div>

            <span v-if="!sidebar.collapsed || sidebar.hovered" class="text-sm text-slate-700">
              {{ item.label }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <div class="mx-3 border-t border-slate-100 my-2"></div>

    <div class="px-3 flex-1 flex flex-col overflow-hidden">
      <button
        @click="sidebar.toggleClassList"
        :class="[
          'w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition',
          (sidebar.collapsed && !sidebar.hovered) ? 'justify-center px-0' : 'justify-between px-0'
        ]"
      >
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-9 h-9 rounded-full bg-slate-50">
            <UIcon name="heroicons-academic-cap" class="h-5 w-5 text-slate-600" />
          </div>
          <span v-if="!sidebar.collapsed || sidebar.hovered" class="text-sm font-medium text-slate-700">Kelas Saya</span>
        </div>

        <UIcon
          v-if="!sidebar.collapsed || sidebar.hovered"
          :name="sidebar.classListOpen ? 'heroicons-chevron-up' : 'heroicons-chevron-down'"
          class="h-4 w-4 text-slate-400"
        />
      </button>

      <transition name="slide-fade">
        <div v-if="sidebar.classListOpen && (!sidebar.collapsed || sidebar.hovered)" class="flex-1 overflow-hidden mt-2">
          <div class="h-full overflow-y-auto">
            <div class="space-y-3 py-1">
              <NuxtLink
                v-for="cls in classesWithColor"
                :key="cls.id"
                :to="`/classes/${cls.id}`"
                class="group flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors bg-white"
              >
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shrink-0',
                    cls.color
                  ]"
                >
                  {{ cls.title[0] }}
                </div>
                <div class="flex flex-col min-w-0">
                  <span class="text-sm font-medium text-slate-800 leading-5 truncate">{{ cls.title }}</span>
                  <span class="text-xs text-slate-500 truncate">{{ cls.creator.profile?.display_name }}</span>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Footer nav -->
    <div class="px-0 pb-4">
      <ul class="space-y-1">
        <li v-for="item in footerNav" :key="item.label">
          <NuxtLink
            :to="item.to"
            :class="[
              'group flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition w-full',
              (sidebar.collapsed && !sidebar.hovered) ? 'justify-center px-0' : 'justify-start px-3'
            ]"
          >
            <div class="flex items-center justify-center w-9 h-9 rounded-full transition group-hover:bg-slate-100">
              <UIcon :name="item.icon" class="h-5 w-5 text-slate-600" />
            </div>
            <span v-if="!sidebar.collapsed || sidebar.hovered" class="text-sm text-slate-700">
              {{ item.label }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
const sidebar = useSidebarStore()
const LmsClassStore = useLmsClassStore()

const mainNav = [
  { label: 'Beranda', icon: 'heroicons-home', to: '/' },
  { label: 'Kalender', icon: 'heroicons-calendar', to: '/calendar' },
]

const footerNav = [
  { label: 'Kelas diarsipkan', icon: 'heroicons-archive-box', to: '/archived' },
  { label: 'Setelan', icon: 'heroicons-cog-6-tooth', to: '/settings' },
]

const avatarColors = [
  'from-indigo-500 to-indigo-600',
  'from-pink-500 to-pink-600',
  'from-green-500 to-green-600',
  'from-yellow-400 to-yellow-500',
  'from-red-500 to-red-600',
]

function gradientFor(id: number) {
  return avatarColors[id % avatarColors.length]
}

console.log(LmsClassStore.clases, 'LmsClassStore.clases');


const classesWithColor = computed(() => {
  if (!LmsClassStore.clases || LmsClassStore.clases.length === 0) return []
  return LmsClassStore.clases.map(c => ({
    ...c,
    color: `bg-gradient-to-br ${gradientFor(c.id)}`,
  }))
})

</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 180ms ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
