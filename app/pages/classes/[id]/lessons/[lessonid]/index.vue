<template>
  <div class="max-w-3xl mx-auto p-6 space-y-6">
    <!-- loading state -->
    <div v-if="lessonStore.loading" class="space-y-4">
      <USkeleton class="h-6 w-1/3" />
      <USkeleton class="h-4 w-full" v-for="i in 3" :key="i" />
    </div>

    <div v-else-if="
      !lessonStore.lesson ||
      !lessonStore.lesson.content_json ||
      lessonStore.lesson.content_json.length === 0
    ">
      <!-- empty state -->
      <UCard class="p-4" :bordered="false">
        <template #header>
          <h3 class="text-lg font-semibold">Empty Content</h3>
        </template>
        <div>There is no content to display.</div>
      </UCard>
    </div>

    <div v-else>
      <!-- ====================== SOAL ====================== -->
      <div v-if="!isSubmitted">
        <div v-for="(block, idx) in lessonStore.lesson.content_json" :key="idx" class="p-4 shadow-sm bg-white">
          <div class="mb-3">
            <h3 class="font-semibold text-lg">
              {{ block.title ?? `Section ${idx + 1}` }}
            </h3>
          </div>

          <div class="space-y-4">
            <!-- text -->
            <div v-if="isType(block, 'text')" class="prose">
              <div v-html="safeHtml(block.content)"></div>
            </div>

            <!-- image -->
            <div v-else-if="isType(block, 'image')" class="flex justify-center">
              <img :src="block.url" :alt="block.alt ?? block.title ?? 'image'" class="max-h-80 object-contain rounded"
                @error="onMediaError(Number(idx))" />
            </div>

            <!-- video -->
            <div v-else-if="isType(block, 'video')" class="w-full">
              <video controls class="w-full rounded shadow-md" :src="block.url" @error="onMediaError(Number(idx))">
                Your browser does not support video tags.
              </video>
            </div>

            <!-- multiple_choice -->
            <div v-else-if="isType(block, 'multiple_choice')" class="space-y-2">
              <p class="text-gray-700">
                {{ block.title ? '' : 'Select the answer you think is correct:' }}
              </p>

              <div v-if="block.options && block.options.length">
                <URadioGroup v-model="answers[idx]" :items="getRadioItems(block.options)"
                  @update:modelValue="(val) => computeMCQResult(Number(idx), val)" />

                <div v-if="block.explanation && results[idx]?.submitted" class="mt-2 text-sm text-gray-600">
                  <strong>Explanation:</strong> {{ block.explanation }}
                </div>
              </div>

              <div v-else class="text-sm text-red-600">
                No options available (invalid option format).
              </div>
            </div>

            <!-- essay -->
            <div v-else-if="isType(block, 'essay')">
              <UTextarea :placeholder="block.placeholder ?? 'Write your answer here...'" class="min-h-[120px] w-full"
                v-model="localEssay[idx]" @blur="submitEssayDebounced(Number(idx), true)"
                @input="submitEssayDebounced(Number(idx), false)" />

              <div class="flex items-center gap-3 mt-2">
                <div v-if="results[idx]?.submitted" class="text-sm text-green-600">
                  Answer sent
                </div>
                <div v-else class="text-sm text-gray-500">
                  The answer will be saved automatically when you stop typing or
                  exit the box.
                </div>
                <div v-if="block.explanation && results[idx]?.submitted" class="text-sm text-gray-600">
                  • {{ block.explanation }}
                </div>
              </div>
            </div>

            <!-- unknown -->
            <div v-else class="text-sm text-red-600">
              Unrecognized content type:
              <strong>{{ getBlockType(block) }}</strong>
            </div>

            <div v-if="results[idx]?.error" class="text-sm text-red-600">
              {{ results[idx].error }}
            </div>
          </div>
        </div>

        <!-- actions -->
        <div class="flex justify-between mt-6">
          <UButton color="neutral" @click="resetAll">Reset All</UButton>
          <div class="flex gap-2">
            <UButton color="success" @click="submitAll">Submit all</UButton>
          </div>
        </div>
      </div>

      <!-- ====================== HASIL ====================== -->
      <div v-else class="p-4 bg-white rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4">📊 Hasil Jawaban</h2>
        <p class="text-green-700 font-semibold">
          Benar: {{ score.correct }}
        </p>
        <p class="text-red-600 font-semibold">
          Salah: {{ score.wrong }}
        </p>

        <div class="mt-6 flex gap-2">
          <UButton color="neutral" @click="resetAll">Reset All</UButton>
          <UButton color="primary" @click="isSubmitted = false">
            Kembali ke soal
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const classId = computed(() => Number(route.params.id))
const lessonId = computed(() => Number(route.params.lessonid))
const lessonStore = useLessonStore()

const isSubmitted = ref(false)
const score = ref({ correct: 0, wrong: 0 }) // ✅ tambah ini
const results = ref<Record<number, any>>({})
const localEssay = reactive<Record<number, string>>({})
const answers = reactive<Record<number, string>>({})
const essayTimers = new Map<number, number | undefined>()

// helpers
const safeHtml = (html?: string) => html ?? ''
const setErrorFor = (idx: number, msg: string) => {
  results.value[idx] = { ...(results.value[idx] ?? {}), error: msg, submitted: false }
}
const clearErrorFor = (idx: number) => {
  if (results.value[idx]) delete results.value[idx].error
}
const isType = (block: any, t: string) => !!(block && block.type === t)
const getBlockType = (block: any) => block?.type ?? 'unknown'
const onMediaError = (idx: number) => setErrorFor(idx, 'Gagal memuat media (video/gambar).')

// radio items
function getRadioItems(options: any[] | undefined) {
  if (!Array.isArray(options)) return []
  return options.map((o: any, i: number) => ({
    label: o.value ?? String.fromCharCode(65 + i),
    value: o.value ?? o.label ?? String.fromCharCode(65 + i),
  }))
}

// evaluasi multiple choice
function computeMCQResult(idx: number, value: string | undefined) {
  if (!lessonStore.lesson?.content_json) return
  const block = lessonStore.lesson.content_json[idx] as any
  if (!block) return
  if (!value) {
    delete results.value[idx]
    return
  }

  try {
    const options = Array.isArray(block?.options) ? block.options : []
    const optIndex = options.findIndex((o: any) => (o.value ?? o.label) === value)
    let isCorrect: boolean | undefined

    if (optIndex >= 0) {
      const chosen = options[optIndex]
      if (typeof chosen.is_correct === 'boolean') isCorrect = chosen.is_correct
    } else if (typeof block.correctAnswer === 'string') {
      const chosen = options.find((o: any) => (o.value ?? o.label) === value)
      const chosenLabel = chosen?.label ?? value
      isCorrect = chosenLabel === block.correctAnswer
    }

    results.value[idx] = {
      type: 'multiple_choice',
      value,
      isCorrect,
      submitted: true,
      submittedAt: new Date().toISOString()
    }
  } catch (err) {
    console.error('computeMCQResult error', err)
    setErrorFor(idx, 'Kesalahan saat mengevaluasi jawaban pilihan ganda.')
  }
}

watch(
  answers,
  (newVal) => {
    for (const k in newVal) computeMCQResult(Number(k), newVal[k])
  },
  { deep: true }
)

// essay
function submitEssay(idx: number) {
  try {
    clearErrorFor(idx)
    const block = lessonStore.lesson?.content_json?.[idx] as any
    const text = (localEssay[idx] ?? '').trim()

    if (block?.max_length && text.length > block.max_length) {
      setErrorFor(idx, `Jawaban melebihi batas ${block.max_length} karakter.`)
      return
    }

    results.value[idx] = {
      type: 'essay',
      value: text,
      submitted: true,
      submittedAt: new Date().toISOString()
    }
  } catch (err) {
    console.error(err)
    setErrorFor(idx, 'Error.')
  }
}

function submitEssayDebounced(idx: number, forceNow = false) {
  if (forceNow) {
    const t = essayTimers.get(idx)
    if (t) window.clearTimeout(t)
    essayTimers.delete(idx)
    submitEssay(idx)
    return
  }

  const existing = essayTimers.get(idx)
  if (existing) window.clearTimeout(existing)
  const timer = window.setTimeout(() => {
    essayTimers.delete(idx)
    submitEssay(idx)
  }, 900)
  essayTimers.set(idx, timer)
}

async function saveResults() {
  try {
    const payload = { results: results.value, savedAt: new Date().toISOString() }
    console.log('Saving results payload', payload)
  } catch (err) {
    console.error(err)
  }
}

// ✅ submitAll sekarang menghitung score dan ubah UI
async function submitAll() {
  lessonStore.lesson?.content_json?.forEach((b: any, i: any) => {
    if (b.type === 'essay' && !results.value[i]) submitEssay(i)
  })

  let correctCount = 0
  let wrongCount = 0

  for (const [_, res] of Object.entries(results.value)) {
    if (res.type === 'multiple_choice') {
      if (res.isCorrect) correctCount++
      else wrongCount++
    }
  }

  score.value.correct = correctCount
  score.value.wrong = wrongCount
  isSubmitted.value = true

  await saveResults()
}

function resetAll() {
  Object.keys(results.value).forEach(k => delete results.value[Number(k)])
  Object.keys(localEssay).forEach(k => delete localEssay[Number(k)])
  Object.keys(answers).forEach(k => delete answers[Number(k)])
}

onMounted(async () => {
  await lessonStore.getDetailLesson(lessonId.value)
  lessonStore.lesson?.content_json?.forEach((b: ContentJson, i: number) => {
    if (b.type === 'essay') localEssay[i] = localEssay[i] ?? ''
  })
})

const prettyResults = computed(() => JSON.stringify(results.value, null, 2))
</script>
