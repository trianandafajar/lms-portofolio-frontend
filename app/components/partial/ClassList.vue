<template>
  <div class="px-3 flex-1 flex flex-col overflow-hidden">
    <button
      @click="sidebar.toggleClassList"
      class="w-full flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-slate-50 transition"
    >
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center w-9 h-9 rounded-full bg-slate-50">
          <UIcon name="heroicons-academic-cap" class="h-5 w-5 text-slate-600" />
        </div>
        <span v-if="!collapsed" class="text-sm font-medium text-slate-700">Kelas Saya</span>
      </div>
      <UIcon
        v-if="!collapsed"
        :name="classListOpen ? 'heroicons-chevron-up' : 'heroicons-chevron-down'"
        class="h-4 w-4 text-slate-400"
      />
    </button>

    <transition name="slide-fade">
      <div v-if="classListOpen" class="flex-1 overflow-hidden mt-2">
        <div class="h-full pr-2 overflow-y-auto">
          <div class="space-y-3 py-1">
            <a
              v-for="cls in classesWithColor"
              :key="cls.id"
              :href="`/classes/${cls.id}`"
              class="group flex items-center gap-3 p-3 rounded-2xl bg-white hover:shadow-md transition-shadow"
            >
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shrink-0',
                  cls.color
                ]"
              >
                {{ cls.name[0] }}
              </div>
              <div class="flex flex-col min-w-0">
                <span class="text-sm font-medium text-slate-800 leading-5 truncate">{{ cls.name }}</span>
                <span class="text-xs text-slate-500 truncate">{{ cls.teacher }}</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
const sidebar = useSidebarStore()
const collapsed = computed(() => sidebar.collapsed)
const classListOpen = computed(() => sidebar.classListOpen)

// dummy kelas
const classes = [
  { id: 1, name: 'Matematika 11A', teacher: 'Pak Budi' },
  { id: 2, name: 'Bahasa Inggris 10B', teacher: 'Bu Sari' },
  { id: 3, name: 'Fisika 12C', teacher: 'Pak Andi' },
  { id: 4, name: 'Biologi 10A', teacher: 'Bu Rina' },
]

// gradient warna
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

const classesWithColor = computed(() =>
  classes.map(c => ({ ...c, color: `bg-gradient-to-br ${gradientFor(c.id)}` }))
)
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
