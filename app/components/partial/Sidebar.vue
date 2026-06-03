<template>
  <aside :class="[
    'flex flex-col bg-white transition-all duration-300 ease-in-out h-screen shadow-sm',
    isCompact ? 'w-24' : 'w-72'
  ]">
    <div :class="[
      'flex h-16 items-center px-4 transition-all',
      isCompact ? 'justify-center' : 'justify-between'
    ]">
      <NuxtLink to="/classes" v-if="!isCompact" class="block">
        <img src="/images/logo.png" alt="Mentora Logo" class="h-14 w-auto object-contain" />
      </NuxtLink>

      <NuxtLink to="/classes" v-else class="flex items-center justify-center">
        <img src="/images/small_icon.png" alt="Mentora Icon" class="h-12 w-12 object-contain" />
      </NuxtLink>

      <!-- Mobile close button -->
      <button @click="handleMobileClose" class="p-1 rounded hover:bg-slate-100 lg:hidden">
        <UIcon name="heroicons-x-mark" class="h-5 w-5 text-slate-500" />
      </button>
    </div>

    <div class="px-4 pt-2 flex-1 flex flex-col overflow-hidden">
      <div data-walkthrough="sidebar-my-classes" :class="[
        'relative flex items-center gap-1 rounded-lg transition',
        isCompact ? 'justify-center' : '',
        isNavActive('/classes') ? 'bg-green-400' : 'hover:bg-slate-50'
      ]">
        <NuxtLink to="/classes" :class="[
          'group flex items-center gap-3 p-2 flex-1 rounded-lg transition',
          isCompact ? 'justify-center px-0' : 'justify-start px-3'
        ]">
          <div class="flex items-center justify-center w-9 h-9 rounded-full bg-slate-50">
            <UIcon name="heroicons-academic-cap" :class="['h-5 w-5', isNavActive('/classes') ? 'text-slate-700' : 'text-slate-600']" />
          </div>
          <span v-if="!isCompact"
            :class="['text-sm font-medium', isNavActive('/classes') ? 'text-white' : 'text-slate-700']">
            My Classes
          </span>
        </NuxtLink>

        <button
          @click="sidebar.toggleClassList"
          :class="[
            'p-2 rounded-md transition shrink-0',
            isCompact ? 'absolute inset-0 m-0 h-full w-full opacity-0' : 'mr-1',
            isNavActive('/classes') ? 'hover:bg-green-500' : 'hover:bg-slate-100'
          ]"
          :aria-label="sidebar.classListOpen ? 'Collapse class list' : 'Expand class list'">
          <UIcon
            :name="sidebar.classListOpen ? 'heroicons-chevron-up' : 'heroicons-chevron-down'"
            :class="[
              'h-4 w-4',
              isCompact ? 'opacity-0' : 'opacity-100',
              isNavActive('/classes') ? 'text-white' : 'text-slate-400'
            ]" />
        </button>
      </div>

      <transition name="slide-fade">
        <div v-if="sidebar.classListOpen"
          class="flex-1 overflow-hidden mt-2">
          <div :class="[
            'h-full overflow-y-auto',
            isCompact ? 'compact-scrollbar' : ''
          ]">
            <div data-walkthrough="sidebar-class-list" :class="[
              'py-1',
              isCompact ? 'space-y-2' : 'space-y-1'
            ]">
              <NuxtLink v-for="(cls, clsIdx) in classesWithColor" :key="cls.id" :to="`/classes/${cls.id}`" :data-walkthrough="clsIdx === 0 ? 'sidebar-class-card-first' : undefined" :class="[
                'group flex items-center gap-3 p-3 rounded-xl transition-all duration-200',
                isCompact ? 'justify-center px-2' : '',
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
                <div v-if="!isCompact" class="flex flex-col min-w-0">
                  <span :class="[
                    'text-sm leading-5 truncate',
                    isClassActive(cls.id) ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'
                  ]">
                    {{ cls.title }}
                  </span>
                  <span class="text-xs text-slate-500 truncate">{{ cls.creator.profile?.display_name }}</span>
                </div>
                <div v-if="isClassActive(cls.id) && !isCompact" class="ml-auto shrink-0">
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
            isCompact ? 'justify-center px-0' : 'justify-start px-3',
            isNavActive(item.to)
              ? 'bg-green-400 text-white'
              : 'hover:bg-slate-50'
          ]">
            <div class="flex items-center justify-center w-9 h-9 rounded-full bg-slate-50">
              <UIcon :name="item.icon" :class="['h-5 w-5', isNavActive(item.to) ? 'text-slate-700' : 'text-slate-600']" />
            </div>
            <span v-if="!isCompact"
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
import { useAuthStore } from '~/stores/auth'

const sidebar = useSidebarStore()
const LmsClassStore = useLmsClassStore()
const auth = useAuthStore()
const route = useRoute()

// Track if we're on mobile (< lg breakpoint = 1024px)
const isMobile = ref(false)

onMounted(() => {
  const mql = window.matchMedia('(max-width: 1023px)')
  isMobile.value = mql.matches
  mql.addEventListener('change', (e) => {
    isMobile.value = e.matches
  })
})

// On mobile, sidebar is never "compact" — always shows full content
const isCompact = computed(() => {
  if (isMobile.value) return false
  return sidebar.collapsed
})

const footerNav = computed(() => {
  const isTeacher = auth.user?.roles?.includes('teacher')
  if (isTeacher) {
    return [
      { label: 'Subscription', icon: 'heroicons-credit-card', to: '/subscription' },
    ]
  }
  return []
})

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
  // Don't close sidebar if walkthrough is controlling it
  const walkthroughActive = document.querySelector('[data-walkthrough-overlay]')
  if (!walkthroughActive) {
    sidebar.closeMobile()
  }
})

// Don't close sidebar if walkthrough is controlling it
function handleMobileClose() {
  const walkthroughActive = document.querySelector('[data-walkthrough-overlay]')
  if (walkthroughActive) return
  sidebar.closeMobile()
}

function isNavActive(to: string) {
  if (to === '/classes') {
    return route.path === '/classes'
  }
  return route.path === to || route.path.startsWith(to + '/')
}

function isClassActive(classId: number) {
  return route.path.startsWith(`/classes/${classId}`)
}
</script>

<style scoped>
.compact-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgb(203 213 225) transparent;
}

.compact-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.compact-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.compact-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgb(203 213 225);
  border-radius: 9999px;
}

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
