<template>
  <aside @mouseenter="sidebar.hovered = true" @mouseleave="sidebar.hovered = false" :class="[
    'flex flex-col bg-white transition-all duration-300 ease-in-out h-screen shadow-sm',
    (sidebar.collapsed && !sidebar.hovered) ? 'w-24' : 'w-72'
  ]">
    <div :class="[
      'flex items-center px-4 py-3 transition-all',
      (sidebar.collapsed && !sidebar.hovered) ? 'justify-center' : 'justify-between'
    ]">
      <NuxtLink to="/home" v-if="!sidebar.collapsed || sidebar.hovered" class="block">
        <img src="/images/logo.png" alt="Mentora Logo" class="h-10 w-auto object-contain" />
      </NuxtLink>

      <NuxtLink to="/home" v-else class="flex items-center justify-center">
        <img src="/images/small_icon.png" alt="Mentora Icon" class="h-10 w-10 object-contain" />
      </NuxtLink>
    </div>

    <!-- Main nav -->
    <nav class="px-4 py-2">
      <ul class="space-y-1">
        <li v-for="item in mainNav" :key="item.label">
          <NuxtLink :to="item.to" :class="[
            'group flex items-center gap-3 p-2 rounded-lg transition-all duration-150 w-full',
            (sidebar.collapsed && !sidebar.hovered) ? 'justify-center px-0' : 'justify-start px-3',
            isNavActive(item.to)
              ? 'bg-green-400 text-white'
              : 'hover:bg-slate-100'
          ]">
            <div :class="[
              'flex items-center justify-center w-9 h-9 rounded-full transition',
              isNavActive(item.to)
                ? ''
                : 'group-hover:bg-slate-100 group-hover:scale-105'
            ]">
              <UIcon :name="item.icon" :class="['h-5 w-5', isNavActive(item.to) ? 'text-white' : 'text-slate-600']" />
            </div>

            <span v-if="!sidebar.collapsed || sidebar.hovered"
              :class="['text-sm font-medium', isNavActive(item.to) ? 'text-white' : 'text-slate-700']">
              {{ item.label }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <div class="mx-3 border-t border-slate-100 my-2"></div>

    <div class="px-4 flex-1 flex flex-col overflow-hidden">
      <button @click="sidebar.toggleClassList" :class="[
        'w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition',
        (sidebar.collapsed && !sidebar.hovered) ? 'justify-center px-0' : 'justify-between px-3'
      ]">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-9 h-9 rounded-full bg-slate-50">
            <UIcon name="heroicons-academic-cap" class="h-5 w-5 text-slate-600" />
          </div>
          <span v-if="!sidebar.collapsed || sidebar.hovered" class="text-sm font-medium text-slate-700">My
            Classes</span>
        </div>

        <UIcon v-if="!sidebar.collapsed || sidebar.hovered"
          :name="sidebar.classListOpen ? 'heroicons-chevron-up' : 'heroicons-chevron-down'"
          class="h-4 w-4 text-slate-400" />
      </button>

      <transition name="slide-fade">
        <div v-if="sidebar.classListOpen && (!sidebar.collapsed || sidebar.hovered)"
          class="flex-1 overflow-hidden mt-2">
          <div class="h-full overflow-y-auto">
            <div class="space-y-1 py-1">
              <NuxtLink v-for="cls in classesWithColor" :key="cls.id" :to="`/classes/${cls.id}`" :class="[
                'group flex items-center gap-3 p-3 rounded-xl transition-all duration-200',
                isClassActive(cls.id)
                  ? 'bg-slate-100 border border-slate-200'
                  : 'hover:bg-slate-50 border border-transparent'
              ]">
                <div :class="[
                  'w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold shrink-0 transition-transform',
                  cls.color,
                  isClassActive(cls.id) ? 'scale-105' : 'group-hover:scale-105'
                ]">
                  {{ cls.title[0] }}
                </div>
                <div class="flex flex-col min-w-0">
                  <span :class="[
                    'text-sm leading-5 truncate',
                    isClassActive(cls.id) ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'
                  ]">
                    {{ cls.title }}
                  </span>
                  <span class="text-xs text-slate-500 truncate">{{ cls.creator.profile?.display_name }}</span>
                </div>
                <div v-if="isClassActive(cls.id)" class="ml-auto shrink-0">
                  <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Footer nav -->
    <div class="px-4 pb-4">
      <ul class="space-y-1">
        <li v-for="item in footerNav" :key="item.label">
          <NuxtLink :to="item.to" :class="[
            'group flex items-center gap-3 p-2 rounded-lg transition-all duration-150 w-full',
            (sidebar.collapsed && !sidebar.hovered) ? 'justify-center px-0' : 'justify-start px-3',
            isNavActive(item.to)
              ? 'bg-green-400 text-white'
              : 'hover:bg-slate-100'
          ]">
            <div class="flex items-center justify-center w-9 h-9 rounded-full transition group-hover:bg-green-400">
              <UIcon :name="item.icon" :class="['h-5 w-5', isNavActive(item.to) ? 'text-white' : 'text-slate-600']" />
            </div>
            <span v-if="!sidebar.collapsed || sidebar.hovered"
              :class="['text-sm font-medium', isNavActive(item.to) ? 'text-white' : 'text-slate-700']">
              {{ item.label }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useLmsClassStore } from '~/stores/lmsclass'
import { useSidebarStore } from '~/stores/sidebar'

const sidebar = useSidebarStore()
const LmsClassStore = useLmsClassStore()
const route = useRoute()

const mainNav = [
  { label: 'Homepage', icon: 'heroicons-home', to: '/home' },
]

const footerNav = [
  { label: 'Subscription', icon: 'heroicons-credit-card', to: '/subscription' },
]

const avatarColors = [
  'bg-emerald-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-sky-500',
]

function colorFor(id: number) {
  return avatarColors[id % avatarColors.length]
}

const classesWithColor = computed(() => {
  const source = (LmsClassStore.clases && LmsClassStore.clases.length > 0)
    ? LmsClassStore.clases
    : []
  return source.map(c => ({
    ...c,
    color: colorFor(c.id),
  }))
})

watch(() => route.fullPath, () => {
  sidebar.setHovered(false)
})

function isNavActive(to: string) {
  if (to === '/home') {
    return route.path === '/home'
  }
  return route.path === to || route.path.startsWith(to + '/')
}

function isClassActive(classId: number) {
  return route.path.startsWith(`/classes/${classId}`)
}
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
