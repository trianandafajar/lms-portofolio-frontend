<template>
  <div class="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
    <div v-if="!isTeacher" class="bg-white rounded-2xl border border-slate-200 p-12 text-center">
      <div class="flex justify-center mb-4">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
          <UIcon name="heroicons-lock-closed" class="h-7 w-7 text-slate-400" />
        </div>
      </div>
      <h3 class="font-semibold text-slate-800 text-lg">Teacher only</h3>
      <p class="text-sm text-slate-500 mt-1">This page is only available to the teacher of this class.</p>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="flex flex-wrap items-center gap-3">
        <UButton variant="ghost" color="neutral" icon="heroicons-arrow-left"
          :to="`/classes/${classId}/lessons/${lessonId}`">
          Back to Lesson
        </UButton>
        <div class="flex-1 min-w-0">
          <h1 class="text-xl font-bold text-slate-900 truncate">{{ lessonStore.lesson?.title || 'Grading Review' }}</h1>
          <p class="text-xs text-slate-500">Review AI-generated scores and feedback, then approve or adjust before
            releasing to students.</p>
        </div>
        <UButton variant="outline" color="neutral" icon="heroicons-arrow-path" @click="load" :loading="loading">
          Refresh
        </UButton>
      </div>

      <div v-if="loading" class="grid lg:grid-cols-[300px,1fr] gap-6 animate-pulse">
        <div class="space-y-3">
          <USkeleton class="h-16 w-full rounded-2xl" v-for="i in 4" :key="i" />
        </div>
        <USkeleton class="h-[420px] w-full rounded-2xl" />
      </div>

      <div v-else-if="!students.length"
        class="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
        <div class="flex justify-center mb-4">
          <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
            <UIcon name="heroicons-document-text" class="h-7 w-7 text-slate-400" />
          </div>
        </div>
        <h3 class="font-semibold text-slate-800 text-lg">No submissions yet</h3>
        <p class="text-sm text-slate-500 mt-1">Waiting for students to submit their essays.</p>
      </div>

      <div v-else class="grid lg:grid-cols-[300px,1fr] gap-6 items-start">
        <!-- Student list -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-slate-100">
            <h3 class="font-semibold text-slate-900">Students</h3>
            <p class="text-xs text-slate-500">{{ students.length }} submission(s)</p>
          </div>
          <div class="divide-y divide-slate-100">
            <button v-for="s in students" :key="s.id" @click="selectedId = s.id"
              class="w-full text-left px-5 py-3 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-2"
              :class="selectedId === s.id ? 'bg-emerald-50/60' : ''">
              <span class="font-medium text-sm text-slate-700 truncate">{{ s.user_name }}</span>
              <span v-if="s.grades?.length" class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                :class="statusBadge(s.grades).classes">
                {{ statusBadge(s.grades).label }}
              </span>
              <span v-else class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                No grade
              </span>
            </button>
          </div>
        </div>

        <!-- Review panel -->
        <div v-if="selected" class="space-y-6">
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div>
                <h2 class="text-lg font-bold text-slate-900">{{ selected.user_name }}</h2>
                <p class="text-xs text-slate-500">
                  Submitted {{ formatDate(selected.submitted_at) }} · {{ selected.essays.length }} essay(s)
                </p>
              </div>
            </div>

            <div v-if="!selected.essays.length" class="p-4 bg-slate-50 rounded-xl text-sm text-slate-500">
              No essay answers in this submission.
            </div>

            <div v-for="item in reviewItems" :key="item.essay.block_index"
              class="border border-slate-100 rounded-2xl p-5 mb-4">
              <div class="grid md:grid-cols-2 gap-5">
                <!-- Raw essay -->
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Student Essay #{{
                    item.essay.block_index + 1 }}</p>
                  <h4 class="font-semibold text-slate-800 mb-2">{{ item.essay.question }}</h4>
                  <p
                    class="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed bg-slate-50 rounded-xl p-4 min-h-[120px]">
                    {{ item.essay.answer || '—' }}
                  </p>
                  <p v-if="item.essay.max_length" class="text-[11px] text-slate-400 mt-2">
                    Max {{ item.essay.max_length }} chars · {{ item.essay.answer.length }} length
                  </p>
                </div>

                <!-- AI grade -->
                <div
                  :class="['rounded-2xl border p-5', item.grade ? 'bg-emerald-50/40 border-emerald-100' : 'bg-slate-50 border-slate-100']">
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">AI Feedback</span>
                    <span v-if="item.grade"
                      class="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                      :class="item.grade.grader.is_ai ? 'bg-violet-100 text-violet-700' : 'bg-emerald-100 text-emerald-700'">
                      <UIcon :name="item.grade.grader.is_ai ? 'heroicons-sparkles' : 'heroicons-user'"
                        class="h-3 w-3" />
                      {{ item.grade.grader.is_ai ? 'AI Graded' : 'Teacher Edited' }}
                    </span>
                  </div>

                  <template v-if="item.grade">
                    <div class="space-y-3">
                      <div class="flex items-center gap-3">
                        <span class="text-4xl font-black text-slate-900">{{ item.grade.score }}</span>
                        <span class="text-sm text-slate-400 font-semibold">/ 100</span>
                        <span class="ml-auto text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                          :class="statusBadge([item.grade]).classes">
                          {{ statusBadge([item.grade]).label }}
                        </span>
                      </div>
                      <p class="text-sm text-slate-700 whitespace-pre-wrap">{{ item.grade.feedback || 'No feedback provided.' }}</p>

                      <template v-if="editingId === item.grade.id">
                        <div class="space-y-2 pt-1">
                          <label class="text-xs font-semibold text-slate-500 block">Override score (0-100)</label>
                          <UInput v-model.number="editModel(item.grade).score" type="number" min="0" max="100" />
                          <label class="text-xs font-semibold text-slate-500 block">Override feedback</label>
                          <UTextarea v-model="editModel(item.grade).feedback" class="w-full min-h-[100px]" />
                          <div class="flex gap-2">
                            <UButton color="primary" size="sm" icon="heroicons-check" :loading="saving"
                              @click="submitOverride(item.grade)">
                              Save
                            </UButton>
                            <UButton variant="ghost" color="neutral" size="sm" @click="cancelEdit">Cancel</UButton>
                          </div>
                        </div>
                      </template>

                      <div v-else class="flex flex-wrap gap-2 pt-2">
                        <UButton v-if="item.grade.status !== 'approved'" color="primary" size="sm"
                          icon="heroicons-check-circle" :loading="saving" @click="approve(item.grade.id)">
                          Approve
                        </UButton>
                        <UButton variant="outline" color="neutral" size="sm" icon="heroicons-pencil"
                          @click="startEdit(item.grade)">
                          Edit
                        </UButton>
                      </div>
                    </div>
                  </template>

                  <div v-else>
                    <p class="text-sm text-amber-600 flex items-center gap-2">
                      <UIcon name="heroicons-arrow-path" class="h-4 w-4 animate-spin" />
                      Not graded yet. AI grading runs once the student submits &mdash; refreshing automatically.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const classId = computed(() => Number(route.params.id))
const lessonId = computed(() => Number(route.params.lessonid))
const lessonStore = useLessonStore()
const authStore = useAuthStore()

const isTeacher = computed(() => {
  const roles = authStore.user?.roles?.map((r: string) => r.toLowerCase()) || []
  return roles.includes('teacher') || roles.includes('admin')
})

const students = ref<any[]>([])
const selectedId = ref<number | null>(null)
const editingId = ref<number | null>(null)
const saving = ref(false)
const editForm = reactive<Record<number, { score: number | null; feedback: string }>>({})

const loading = computed(() => lessonStore.loading)
const selected = computed(() => students.value.find((s) => s.id === selectedId.value) || students.value[0])

const reviewItems = computed(() => {
  const essays = [...(selected.value?.essays || [])]
  essays.sort((a: any, b: any) => a.block_index - b.block_index)
  const grades = selected.value?.grades || []
  return essays.map((essay: any) => ({
    essay,
    grade: grades.find((g: any) => g.block_index === essay.block_index) || null,
  }))
})

const hasUngraded = computed(() =>
  students.value.some((s: any) =>
    (s.essays || []).some(
      (e: any) =>
        !(s.grades || []).some((g: any) => g.block_index === e.block_index)
    )
  )
)

function statusBadge(grades: any[]) {
  if (!grades?.length) return { label: 'Ungraded', classes: 'bg-slate-100 text-slate-500' }
  const statuses = grades.map((g) => g.status)
  if (statuses.every((s) => s === 'approved')) return { label: 'Approved', classes: 'bg-emerald-100 text-emerald-700' }
  if (statuses.every((s) => s === 'modified')) return { label: 'Edited', classes: 'bg-blue-100 text-blue-700' }
  return { label: 'Pending review', classes: 'bg-amber-100 text-amber-700' }
}

function formatDate(value: string | null) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

async function load() {
  try {
    await lessonStore.getDetailLesson(lessonId.value)
  } catch (e) { /* ignore */ }
  try {
    students.value = await lessonStore.fetchLessonGrades(lessonId.value)
  } catch (e) {
    students.value = []
  }
  if (students.value.length && selectedId.value == null) {
    selectedId.value = students.value[0].id
  }
  schedulePoll()
}

let pollTimer: ReturnType<typeof setTimeout> | null = null

function schedulePoll() {
  if (pollTimer) window.clearTimeout(pollTimer)
  if (!hasUngraded.value) return
  pollTimer = window.setTimeout(() => {
    load()
  }, 5000)
}

async function approve(gradeId: number) {
  saving.value = true
  try {
    await lessonStore.approveGrade(lessonId.value, gradeId)
  } finally {
    saving.value = false
  }
  await load()
}

function editModel(grade: any) {
  const key = Number(grade?.id ?? 0)
  if (!editForm[key]) {
    editForm[key] = { score: grade?.score ?? 0, feedback: grade?.feedback || '' }
  }
  return editForm[key]
}

function startEdit(grade: any) {
  editingId.value = grade.id
  editModel(grade)
}

function cancelEdit() {
  editingId.value = null
}

async function submitOverride(grade: any) {
  saving.value = true
  try {
    await lessonStore.overrideGrade(lessonId.value, grade.id, {
      score: Number(editForm[grade.id]?.score),
      feedback: editForm[grade.id]?.feedback ?? '',
    })
    editingId.value = null
  } finally {
    saving.value = false
  }
  await load()
}

onMounted(() => {
  load()
})

onUnmounted(() => {
  if (pollTimer) window.clearTimeout(pollTimer)
})
</script>