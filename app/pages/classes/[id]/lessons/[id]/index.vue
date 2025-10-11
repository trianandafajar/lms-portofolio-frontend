<template>
  <div class="max-w-3xl mx-auto p-6">
    <UCard v-if="showScore" class="p-6 text-center">
      <h2 class="text-2xl font-bold mb-4">Hasil Skor Kamu</h2>
      <p class="text-lg">Skor kamu: <span class="font-bold">{{ score }}</span> / {{ totalMCQ }}</p>
      <UButton color="primary" class="mt-4" @click="resetQuiz">
        Coba Lagi
      </UButton>
    </UCard>

    <UCard v-else class="p-4">
      <template #header>
        <h2 class="text-lg font-bold">
          Soal {{ currentIndex + 1 }} dari {{ allQuestions.length }}
          <span v-if="currentQuestion.type === 'mcq'">(Pilihan Ganda)</span>
          <span v-else>(Essay)</span>
        </h2>
      </template>

      <div class="space-y-4">
        <div v-if="currentQuestion.videoUrl" class="w-full rounded-lg overflow-hidden">
          <video
            controls
            class="w-full rounded-lg shadow-md"
            :src="currentQuestion.videoUrl"
          >
            Browser kamu tidak mendukung tag video.
          </video>
        </div>

        <p class="text-gray-700">{{ currentQuestion.question }}</p>

        <div v-if="currentQuestion.type === 'mcq'" class="space-y-2">
          <URadio
            v-for="(opt, i) in currentQuestion.options"
            :key="i"
            v-model="answers[currentIndex]"
            :value="String.fromCharCode(65 + i)"
            class="flex items-center gap-2"
          >
            <span class="font-semibold">{{ String.fromCharCode(65 + i) }}.</span>
            <span>{{ opt }}</span>
          </URadio>
        </div>

        <div v-else>
          <UTextarea
            v-model="essay[currentIndex]"
            placeholder="Tulis jawabanmu di sini..."
            class="min-h-[120px]"
          />
        </div>
      </div>
    </UCard>

    <div v-if="!showScore" class="flex justify-between mt-6">
      <UButton color="neutral" :disabled="currentIndex === 0" @click="prevQuestion">
        Sebelumnya
      </UButton>

      <UButton
        v-if="currentIndex < allQuestions.length - 1"
        color="primary"
        @click="nextQuestion"
      >
        Selanjutnya
      </UButton>

      <UButton
        v-else
        color="success"
        @click="submit"
      >
        Submit Jawaban
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface BaseQuestion {
  type: 'mcq' | 'essay'
  question: string
  videoUrl?: string
}

interface MCQQuestion extends BaseQuestion {
  type: 'mcq'
  options: string[]
  correctAnswer: string
}

interface EssayQuestion extends BaseQuestion {
  type: 'essay'
  options?: never
}

type Question = MCQQuestion | EssayQuestion
const allQuestions = ref<Question[]>([
  {
    type: 'mcq',
    question: "Siapakah penemu lampu pijar?",
    options: ["Thomas Alva Edison", "Albert Einstein", "Nikola Tesla", "Isaac Newton"],
    correctAnswer: "A",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  {
    type: 'mcq',
    question: "Ibukota Indonesia adalah?",
    options: ["Bandung", "Surabaya", "Jakarta", "Medan"],
    correctAnswer: "C"
  },
  {
    type: 'essay',
    question: "Jelaskan pendapatmu tentang teknologi AI di masa depan!",
    videoUrl: "https://www.w3schools.com/html/movie.mp4"
  },
  {
    type: 'essay',
    question: "Apa manfaat belajar programming sejak dini?"
  }
])

const currentIndex = ref<number>(0)
const answers = ref<Record<number, string>>({})
const essay = ref<Record<number, string>>({})
const score = ref<number>(0)
const showScore = ref<boolean>(false)

const currentQuestion = computed<Question>(() => {
  return (
    allQuestions.value[currentIndex.value] ?? {
      type: 'essay',
      question: 'Pertanyaan tidak ditemukan'
    }
  )
})

const totalMCQ = computed(() =>
  allQuestions.value.filter(q => q.type === 'mcq').length
)

const nextQuestion = () => {
  if (currentIndex.value < allQuestions.value.length - 1) currentIndex.value++
}

const prevQuestion = () => {
  if (currentIndex.value > 0) currentIndex.value--
}

const submit = () => {
  let tempScore = 0

  allQuestions.value.forEach((q, index) => {
    if (q.type === 'mcq' && answers.value[index]) {
      if (answers.value[index] === q.correctAnswer) {
        tempScore++
      }
    }
  })

  score.value = tempScore
  showScore.value = true
}

const resetQuiz = () => {
  answers.value = {}
  essay.value = {}
  score.value = 0
  currentIndex.value = 0
  showScore.value = false
}
</script>