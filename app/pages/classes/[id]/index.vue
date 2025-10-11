<template>
    <div class="flex items-center gap-2 mb-4 bg-white px-4 py-2 rounded-lg border border-gray-200">
        <h1 class="text-base font-bold">{{ lmsClassStore.classDetail?.title}} > {{ lmsClassStore.classDetail?.creator.profile?.display_name }}</h1>
    </div>

	<div class="w-full bg-white rounded-md border border-gray-200 py-2 px-4 mb-4">
		<ul class="grid grid-cols-2">
			<li>
				<span>Teacher: <b>{{ lmsClassStore.classDetail?.creator.profile?.display_name }}</b></span>
			</li>
			<li>
				<span>Student Total: <b>{{ lmsClassStore.classDetail?.memberships?.length }}</b></span>
			</li>
			<li>
				<span>Discussion Total: <b>721</b></span>
			</li>
			<li>
				<span>Lesson Total: <b>{{ lmsClassStore.classDetail?.lessons.length }}</b></span>
			</li>
		</ul>
	</div>

	<UTabs :items="tabs">
		<template #lessons>
			<div class="flex flex-row mt-4">
				<UModal ref="lessonModal" :width="600">
					<UButton color="primary" size="md" class="ml-auto py-2 cursor-pointer" @click.prevent="openLessonModal">
						<UIcon name="heroicons-plus" class="h-4 w-4 mr-2" />
						Add New Lesson
					</UButton>
					<template #header>
						<h2 class="text-lg font-bold">Add New Lesson</h2>
					</template>
					<template #body>
						<UForm :schema="schema" :state="state" class="space-y-4" @submit.prevent="handleSubmit">
							<UFormField label="Lesson Title" name="title" class="w-full">
								<UInput v-model="state.title" placeholder="Enter lesson title" class="w-full" />
							</UFormField>

							<UFormField label="Description" name="summary" class="w-full">
								<UTextarea v-model="state.summary" placeholder="Enter lesson description" class="w-full" />
							</UFormField>

							<UFormField label="Content" name="content" class="w-full">
								<TiptapEditor v-model="state.content" />
							</UFormField>

							<div v-if="lessonStore.error" class="text-sm text-red-600">
								{{ lessonStore.error }}
							</div>

							<div class="flex justify-end gap-2">
								<UButton type="submit" color="primary" size="md" :loading="lmsClassStore.loading">Save Lesson</UButton>
							</div>
						</UForm>
					</template>
				</UModal>
			</div>

			<ul v-if="lmsClassStore.classDetail && lmsClassStore.classDetail.lessons?.length > 0" class="bg-white rounded-md border border-gray-200 p-4 mt-2 flex flex-col gap-3">
				<li
					v-for="i in lmsClassStore.classDetail?.lessons"
					:key="i.id"
					class="flex flex-col border border-gray-300 p-5 rounded-md"
				>
					<NuxtLink :to="`/classes/${classId}/lessons/2`">
						<div class="flex flex-row items-center">
							<UIcon name="heroicons-book-open" class="text-lg font-bold mr-3" />
							<h2 class="text-lg font-black">{{ i.title }}</h2>
						</div>
						<div class="flex flex-row">
							<span class="text-sm">Summary: {{ i.summary }}</span>
						</div>
					</NuxtLink>
				</li>
			</ul>
			<div v-else class="bg-white rounded-md border border-gray-200 p-4 mt-2 text-center text-gray-500">
				<UIcon name="heroicons-information-circle" class="text-2xl mx-auto mb-2 text-gray-400" />
				<p class="font-medium">Belum ada lesson yang tersedia.</p>
				<p class="text-sm">Klik tombol “Tambah Lesson” untuk mulai membuat pelajaran.</p>
			</div>
		</template>
        <template #students>
			<ul v-if="lmsClassStore.classDetail && lmsClassStore.classDetail.memberships?.length > 0" class="grid grid-cols-3 gap-5 bg-white rounded-md border border-gray-200 p-4 mt-2">
				<li
					v-for="member in lmsClassStore.classDetail?.memberships"
					:key="member.id"
					class="flex flex-row items-center gap-3"
				>
					<div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 text-white flex items-center justify-center font-medium">
					A
					</div>
					<div class="flex flex-col">
						<b>{{ member.user.profile?.display_name }}</b>
						<span class="text-xs">{{ member.user.email }}</span>
					</div>
				</li>
			</ul>
			<div v-else class="bg-white rounded-md border border-gray-200 p-4 mt-2 text-center text-gray-500">
				<UIcon name="heroicons-information-circle" class="text-2xl mx-auto mb-2 text-gray-400" />
				<p class="font-medium">Belum ada Member yang bergabung.</p>
			</div>
		</template>
	</UTabs>
</template>

<script setup lang="ts">
import * as v from 'valibot'

const route = useRoute()
const lmsClassStore = useLmsClassStore()
const lessonStore = useLessonStore()
const authStore = useAuthStore()
const lessonModal = ref(false)

const classId = Number(route.params.id) || 1

const state = reactive<LessonCreate>({
  title: '',
  author_id: 0,
  class_id: 0,
  content: '',
  content_json: {},
  is_published: true,
  summary: ''
})

const schema = v.object({
  title: v.pipe(v.string(), v.minLength(1, 'Title is required')),
  summary: v.pipe(v.string(), v.minLength(1, 'Summary is required')),
  content: v.pipe(v.string(), v.minLength(1, 'Content is required')),
})

const tabs = [
  { label: 'Lessons', slot: 'lessons' },
  { label: 'Students', slot: 'students' }
]


const openLessonModal = (e: MouseEvent) => {
  lessonModal.value = true
}

const closeLessonModal = () => {
  lessonModal.value = false
}

onMounted(async () => {
  await lmsClassStore.getDetailsClass(classId)
})


const handleSubmit = async (e: SubmitEvent) => {
	if(lmsClassStore.classDetail && authStore.user) {
		await lessonStore.createLesson({
			...state,
			class_id: lmsClassStore.classDetail.id,
			author_id: authStore.user.id,
		})
		closeLessonModal()
	}
}
</script>
