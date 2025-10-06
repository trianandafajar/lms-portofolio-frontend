<template>
  <div class="max-w-3xl mx-auto space-y-6 p-6">
    <!-- Soal Pilihan Ganda -->
    <UCard
      v-for="(q, idx) in mcqQuestions"
      :key="'mcq-' + idx"
      class="p-4"
    >
      <template #header>
        <h2 class="text-lg font-bold">Soal {{ idx + 1 }} (Pilihan Ganda)</h2>
      </template>

      <div class="space-y-4">
        <p class="text-gray-700">{{ q.question }}</p>

        <div class="space-y-2">
          <URadio
            v-for="(opt, i) in q.options"
            :key="i"
            v-model="answers[idx]"
            :value="String.fromCharCode(65 + i)"
            class="flex items-center gap-2"
          >
            <span class="font-semibold">{{ String.fromCharCode(65 + i) }}.</span>
            <span>{{ opt }}</span>
          </URadio>
        </div>
      </div>
    </UCard>

    <!-- Soal Essay -->
    <UCard
      v-for="(q, idx) in essayQuestions"
      :key="'essay-' + idx"
      class="p-4"
    >
      <template #header>
        <h2 class="text-lg font-bold">Soal {{ idx + 1 }} (Essay)</h2>
      </template>

      <div class="space-y-4">
        <p class="text-gray-700">{{ q.question }}</p>
        <UTextarea
          v-model="essay[idx]"
          placeholder="Tulis jawabanmu di sini..."
          class="min-h-[100px]"
        />
      </div>
    </UCard>

    <!-- Tombol Submit -->
    <div class="flex justify-center">
      <UButton color="primary" size="lg" @click="submit">
        Submit Jawaban
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const answers = ref<Record<number, string>>({})
const essay = ref<Record<number, string>>({})

// Dummy data
const mcqQuestions = [
  {
    question: "Siapakah penemu lampu pijar?",
    options: ["Thomas Alva Edison", "Albert Einstein", "Nikola Tesla", "Isaac Newton"]
  },
  {
    question: "Ibukota Indonesia adalah?",
    options: ["Bandung", "Surabaya", "Jakarta", "Medan"]
  }
]

const essayQuestions = [
  { question: "Jelaskan pendapatmu tentang teknologi AI di masa depan!" },
  { question: "Apa manfaat belajar programming sejak dini?" }
]

const submit = () => {
  console.log("Jawaban Pilihan Ganda:", answers.value)
  console.log("Jawaban Essay:", essay.value)
  alert("Jawaban terkumpul (dummy)")
}
</script>
