import { UModal } from '../../../../.nuxt/components';
<template>
    <div class="flex items-center gap-2 mb-4 bg-white px-4 py-2 rounded-lg border border-gray-200">
        <h1 class="text-base font-bold">XII RPL 1 > English Learning > Budi Santoso</h1>
    </div>

	<div class="w-full bg-white rounded-md border border-gray-200 py-2 px-4 mb-4">
		<ul class="grid grid-cols-2">
			<li>
				<span>Teacher: <b>Eko Santoso</b></span>
			</li>
			<li>
				<span>Student Total: <b>23</b></span>
			</li>
			<li>
				<span>Discussion Total: <b>721</b></span>
			</li>
			<li>
				<span>Lesson Total: <b>12</b></span>
			</li>
		</ul>
	</div>

	<UTabs :items="tabs">
		<template #lessons>
			<div class="flex flex-row mt-4">

				<UButton color="primary" size="md" class="ml-auto py-2 cursor-pointer" @click.prevent="openLessonModal">
					<UIcon name="heroicons-plus" class="h-4 w-4 mr-2" />
					Add New Lesson
				</UButton>

				<UModal ref="lessonModal" :width="600">
					<template #trigger>
						<button class="hidden"></button>
					</template>
					<template #header>
						<h2 class="text-lg font-bold">Add New Lesson</h2>
					</template>
					<template #body>
						<form class="space-y-4" @submit.prevent="saveLesson">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
								<input v-model="form.title" type="text" class="w-full border border-gray-300 rounded-md p-2" placeholder="Enter lesson title" />
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Lesson Type</label>
								<select v-model="form.type" class="w-full border border-gray-300 rounded-md p-2">
									<option value="multiple-choice">Multiple Choice</option>
									<option value="essay">Essay</option>
									<option value="true-false">True/False</option>
								</select>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
								<textarea v-model="form.description" class="w-full border border-gray-300 rounded-md p-2" rows="4" placeholder="Enter lesson description"></textarea>
							</div>
							<div v-if="error" class="text-sm text-red-600">{{ error }}</div>
						</form>
					</template>
					<template #footer>
						<div class="flex justify-end gap-2">
							<UButton color="secondary" size="md" :disabled="loading" @click="closeLessonModal">Cancel</UButton>
							<UButton color="primary" size="md" :loading="loading" @click="saveLesson">Save Lesson</UButton>
						</div>
					</template>
				</UModal>
			</div>

			<ul class="bg-white rounded-md border border-gray-200 p-4 mt-2 flex flex-col gap-3">
				<li
				v-for="i in 80"
				:key="i"
				class="flex flex-col border border-gray-300 p-5 rounded-md"
				>
					<NuxtLink :to="`/classes/${classId}/lessons/2`">
						<div class="flex flex-row items-center">
							<UIcon name="heroicons-book-open" class="text-lg font-bold mr-3" />
							<h2 class="text-lg font-black">Lesson {{ i }}</h2>
						</div>
						<div class="flex flex-row">
							<span class="text-sm mr-5">Type: <b>Multiple Choice</b></span>
							<span class="text-sm">Student Completed: <b>31</b></span>
						</div>
					</NuxtLink>
				</li>
			</ul>
		</template>
        <template #students>
			<ul class="grid grid-cols-3 gap-5 bg-white rounded-md border border-gray-200 p-4 mt-2">
				<li
					v-for="i in 80"
					:key="i"
					class="flex flex-row items-center gap-3"
				>
					<div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 text-white flex items-center justify-center font-medium">
					A
					</div>
					<div class="flex flex-col">
						<b>Revan Dika {{ i }}</b>
						<span class="text-xs">Discussion: 20</span>
					</div>
				</li>
			</ul>
		</template>
	</UTabs>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
const route = useRoute()
const classId = Number(route.params.id) || 1
const tabs = [
		{ label: 'Lessons', slot: 'lessons' },
		{ label: 'Students', slot: 'students' }
]

const lessonModal = ref(null)
const form = reactive({
	title: '',
	type: 'multiple-choice',
	description: ''
})

const loading = ref(false)
const error = ref<string | null>(null)

import { api } from '~/utils/api'

function openLessonModal() {
	;(lessonModal.value as any)?.open?.()
}

function closeLessonModal() {
	;(lessonModal.value as any)?.close?.()
}

async function saveLesson(): Promise<void> {
	error.value = null
	if (!form.title || !form.title.trim()) {
		error.value = 'Title is required'
		return
	}
	loading.value = true
	try {
		const payload = {
			title: form.title,
			type: form.type,
			description: form.description
		}
		await api.post('/classes/' + classId + '/lessons', payload)

		form.title = ''
		form.type = 'multiple-choice'
		form.description = ''
		closeLessonModal()

		return
	} catch (err: any) {
		error.value = err?.response?.data?.message || err?.message || 'Failed to create lesson'
		throw err
	} finally {
		loading.value = false
	}
}
</script>