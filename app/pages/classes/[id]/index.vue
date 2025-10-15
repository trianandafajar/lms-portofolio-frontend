<template>
	<div class="flex items-center gap-2 mb-4 bg-white px-4 py-2 rounded-lg border border-gray-200">
		<h1 v-if="lmsClassStore.classDetail" class="text-base font-bold">
			{{ lmsClassStore.classDetail.title }} &gt; {{ lmsClassStore.classDetail.creator.profile?.display_name }}
		</h1>
	</div>

	<div class="w-full bg-white rounded-md border border-gray-200 py-2 px-4 mb-4">
		<ul class="grid grid-cols-2">
			<li><span>Teacher: <b>{{ lmsClassStore.classDetail?.creator.profile?.display_name }}</b></span></li>
			<li><span>Student Total: <b>{{ lmsClassStore.classDetail?.memberships?.length || 0 }}</b></span></li>
			<li><span>Code Class: <b>{{ lmsClassStore.classDetail?.code }}</b></span></li>
			<li><span>Lesson Total: <b>{{ lmsClassStore.classDetail?.lessons.length || 0 }}</b></span></li>
		</ul>
	</div>

	<UTabs :items="tabs">
		<template #lessons>
			<div class="flex flex-row mt-4">
				<!-- Modal (trigger inside) -->
				<UModal Modal v-model:open="modalOpen" class="w-full max-w-5xl">
					<div class="mb-3">
						<UButton color="primary" size="md" class="mr-auto py-2 cursor-pointer">
							<UIcon name="heroicons-plus" class="h-4 w-4" />
							Add Lesson
						</UButton>
					</div>

					<template #header>
						<h2 class="text-lg font-bold">Add New Lesson</h2>
					</template>

					<template #body>
						<!-- STEP 1 -->
						<div v-if="step === 1">
							<UForm :schema="schema" :state="formState" class="space-y-4" @submit.prevent="gotoStep2">
								<UFormField label="Lesson Title" name="title" class="w-full">
									<UInput v-model="formState.title" placeholder="Enter lesson title" class="w-full" />
								</UFormField>

								<UFormField label="Description" name="summary" class="w-full">
									<UTextarea v-model="formState.summary" placeholder="Enter lesson description"
										class="w-full" />
								</UFormField>

								<UFormField label="Content (optional short content)" name="content" class="w-full">
									<UTextarea v-model="formState.content" placeholder="Enter short content"
										class="w-full" />
								</UFormField>

								<div v-if="lessonStore.error" class="text-sm text-red-600">
									{{ lessonStore.error }}
								</div>

								<div class="flex justify-end gap-2">
									<UButton type="button" color="neutral" size="md" @click.stop="closeLessonModal">Cancel
									</UButton>
									<UButton type="submit" color="primary" size="md" :loading="lmsClassStore.loading">
										Next: Create Content
									</UButton>
								</div>
							</UForm>
						</div>

						<!-- STEP 2 -->
						<div v-else class="max-w-4xl mx-auto p-6 space-y-6">
							<!-- Empty state -->
							<UAlert v-if="state.content_json.length === 0" color="secondary"
								icon="i-heroicons-information-circle" title="No content blocks yet"
								description="Press the Add Block button to start adding lesson content.." />

							<!-- Blocks list -->
							<div v-else class="space-y-4">
								<UCard v-for="(block, idx) in state.content_json" :key="idx"
									class="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
									<template #header>
										<div class="flex items-center justify-between">
											<div class="font-semibold text-base text-gray-800">
												{{ idx + 1 }}. [{{ block.type || 'unspecified' }}]
												<span class="text-gray-500">{{ block.title || '(Untitled)' }}</span>
											</div>
											<div class="flex items-center gap-2">
												<UButton size="xs" color="neutral" @click="moveUp(idx)"
													:disabled="idx === 0" icon="i-heroicons-arrow-up" />
												<UButton size="xs" color="neutral" @click="moveDown(idx)"
													:disabled="idx === state.content_json.length - 1"
													icon="i-heroicons-arrow-down" />
												<UButton size="xs" color="error" @click="removeBlock(idx)"
													icon="i-heroicons-trash" />
											</div>
										</div>
									</template>

									<template #default>
										<!-- Type selector for new block -->
										<div v-if="(block as any).__isNew"
											class="p-3 bg-gray-50 rounded-lg border border-gray-200">
											<p class="text-sm text-gray-600 mb-3 font-medium">Select content type:</p>
											<div class="flex flex-wrap gap-2">
												<UButton
													v-for="t in ['text', 'image', 'video', 'multiple_choice', 'essay']"
													:key="t" color="primary" size="sm" @click="setBlockType(idx, t)">
													{{ t.replace('_', ' ') }}
												</UButton>
											</div>
											<p class="text-xs text-gray-400 mt-2">
												After selecting the type, fill in the content details below.
											</p>
										</div>

										<!-- Content editor per type -->
										<div v-else class="space-y-3 mt-2">
											<!-- Text -->
											<div v-if="block.type === 'text'" class="space-y-2">
												<UInput v-model="block.title" placeholder="Text title" class="w-full" />
												<UTextarea v-model="block.content" class="w-full"
													placeholder="Content..." />
											</div>

											<!-- Image -->
											<div v-else-if="block.type === 'image'" class="space-y-2">
												<UInput v-model="block.title" placeholder="Image title"
													class="w-full" />
												<input type="file" accept="image/*"
													@change="(e) => handleFileUpload(e, idx, 'image')"
													class="block w-full border border-gray-300 rounded-lg p-2 cursor-pointer text-sm" />
												<UInput v-model="block.alt" class="w-full"
													placeholder="Alternative text (optional)" />
												<div v-if="block.url" class="mt-2">
													<img :src="block.url" :alt="block.alt"
														class="rounded-lg max-h-48 object-contain border" />
												</div>
											</div>

											<!-- Video -->
											<div v-else-if="block.type === 'video'" class="space-y-2">
												<UInput v-model="block.title" placeholder="Video title"
													class="w-full" />
												<input type="file" accept="video/*"
													@change="(e) => handleFileUpload(e, idx, 'video')"
													class="block w-full border border-gray-300 rounded-lg p-2 cursor-pointer text-sm" />
												<video v-if="block.url" controls
													class="rounded-lg border mt-2 w-full max-h-60">
													<source :src="block.url" type="video/mp4" />
												</video>
											</div>

											<!-- Multiple Choice -->
											<div v-else-if="block.type === 'multiple_choice'" class="space-y-3">
												<UInput v-model="block.title" placeholder="Questions" class="w-full" />
												<UDivider />
												<div class="space-y-3">
													<div v-for="(opt, oidx) in block.options" :key="oidx"
														class="flex items-center gap-2">
														<UInput v-model="opt.value" placeholder="Value"
															class="w-full" />
														<label class="flex items-center gap-1 text-sm text-gray-600">
															<input type="checkbox" v-model="opt.is_correct" /> Benar
														</label>
														<UButton size="xs" color="error" icon="i-heroicons-trash"
															@click="removeOption(idx, oidx)" />
													</div>
													<UButton color="primary" size="sm" icon="i-heroicons-plus-small"
														@click="addOption(idx)">
														Tambah Opsi
													</UButton>
													<UInput v-model="block.explanation"
														placeholder="Explanation (optional)" class="mt-2 w-full" />
												</div>
											</div>

											<!-- Essay -->
											<div v-else-if="block.type === 'essay'" class="space-y-2">
												<UInput v-model="block.title" placeholder="Question" class="w-full" />
												<UInput v-model="block.placeholder" class="w-full"
													placeholder="Placeholder (opsional)" />
												<UInput type="number" v-model.number="block.max_length" class="w-full"
													placeholder="Maximum length (characters)" />
												<UInput v-model="block.explanation" class="w-full"
													placeholder="Explanation (optional)" />
											</div>
										</div>
									</template>
								</UCard>
							</div>

							<div class="flex flex-wrap items-center justify-between gap-3">
								<div class="flex gap-2">
									<UButton color="primary" icon="i-heroicons-plus-circle" @click="addEmptyBlock">
										Add Block
									</UButton>
									<UButton color="warning" icon="i-heroicons-arrow-left" @click="goToPrevious">
										Back
									</UButton>
								</div>
								<div class="text-sm text-gray-500">
									Total blocks: {{ state.content_json.length }}
								</div>
							</div>

							<!-- Bottom actions -->
							<div class="pt-6 flex justify-between items-center border-t border-gray-200">
								<div class="text-sm text-gray-600">Review JSON before saving</div>
								<div class="flex gap-2">
									<UButton color="neutral" @click="closeLessonModal">Cancel</UButton>
									<UButton color="success" :loading="lmsClassStore.loading" @click="submitFinal">
										Save Lesson
									</UButton>
								</div>
							</div>
						</div>
					</template>
				</UModal>
			</div>

			<!-- lessons list -->
			<ul v-if="lmsClassStore.classDetail && lmsClassStore.classDetail.lessons?.length > 0"
				class="bg-white rounded-md border border-gray-200 p-4 mt-2 flex flex-col gap-3">
				<li v-for="i in lmsClassStore.classDetail?.lessons" :key="i.id"
					class="flex flex-col border border-gray-300 p-5 rounded-md">
					<NuxtLink :to="'/classes/' + classId + '/lessons/' + i.id">
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
				<p class="font-medium">No lessons are available yet.</p>
				<p class="text-sm">Click the “Add Lesson” button to start creating a lesson.</p>
			</div>
		</template>

		<template #students>
			<ul v-if="lmsClassStore.classDetail && lmsClassStore.classDetail.memberships?.length > 0"
				class="grid grid-cols-3 gap-5 bg-white rounded-md border border-gray-200 p-4 mt-2">
				<li v-for="member in lmsClassStore.classDetail?.memberships" :key="member.id"
					class="flex flex-row items-center gap-3">
					<div
						class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 text-white flex items-center justify-center font-medium">
						A</div>
					<div class="flex flex-col">
						<b>{{ member.user.profile?.display_name }}</b>
						<span class="text-xs">{{ member.user.email }}</span>
					</div>
				</li>
			</ul>
			<div v-else class="bg-white rounded-md border border-gray-200 p-4 mt-2 text-center text-gray-500">
				<UIcon name="heroicons-information-circle" class="text-2xl mx-auto mb-2 text-gray-400" />
				<p class="font-medium">No members have joined yet.</p>
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
const classId = Number(route.params.id) || 1

// modal
const modalOpen = ref(false)
const step = ref<number>(1)

// lesson full state
const state = reactive<LessonCreate>({
	class_id: 0,
	title: '',
	summary: '',
	content: '',
	content_json: [],
	author_id: 0,
	is_published: true
})

// small form state for step1
const formState = reactive({
	title: '',
	summary: '',
	content: ''
})

const schema = v.object({
	title: v.pipe(v.string(), v.minLength(1, 'Title is required')),
	summary: v.pipe(v.string(), v.minLength(1, 'Summary is required')),
	content: v.pipe(v.string(), v.minLength(0))
})

const tabs = [
	{ label: 'Lessons', slot: 'lessons' },
	{ label: 'Students', slot: 'students' }
]

const openLessonModal = () => {
	step.value = 1
	formState.title = ''
	formState.summary = ''
	formState.content = ''
	state.title = ''
	state.summary = ''
	state.content = ''
	state.content_json = []
	newBlockCounter.value = 0
	modalOpen.value = true
}
const closeLessonModal = (): void => {
	modalOpen.value = false
}

const gotoStep2 = () => {
	state.title = formState.title
	state.summary = formState.summary
	state.content = formState.content
	step.value = 2
}
const goToPrevious = (): void => {
	step.value = 1
}

const newBlockCounter = ref(0)

function makeEmptyBlock() {
	const id = ++newBlockCounter.value
	return {
		type: 'text',
		title: '',
		content: '',
		__isNew: true,
		__id: 'new_' + id
	} as any
}

const addEmptyBlock = () => {
	; (state.content_json as any).push(makeEmptyBlock())
}

const setBlockType = (index: number, type: string) => {
	const block = (state.content_json as any)[index]
	if (!block) return

	let newBlock: any
	switch (type) {
		case 'text':
			newBlock = { type: 'text', title: block.title || '', content: block.content || '' }
			break
		case 'image':
			newBlock = { type: 'image', title: block.title || '', url: '', alt: '' }
			break
		case 'video':
			newBlock = { type: 'video', title: block.title || '', url: '' }
			break
		case 'multiple_choice':
			newBlock = {
				type: 'multiple_choice',
				title: '',
				options: [
					{ label: 'Option A', value: 'a', is_correct: false },
					{ label: 'Option B', value: 'b', is_correct: false }
				],
				explanation: ''
			}
			break
		case 'essay':
			newBlock = { type: 'essay', title: '', placeholder: '', max_length: 500, explanation: '' }
			break
		default:
			newBlock = { type: 'text', title: '', content: '' }
	}

	newBlock.__id = block.__id
		; (state.content_json as any)[index] = newBlock
}

const handleFileUpload = (event: Event, index: number, type: string) => {
	const input = event.target as HTMLInputElement
	const file = input.files?.[0]
	if (!file) return

	const reader = new FileReader()
	reader.onload = () => {
		const base64String = reader.result as string
		(state.content_json as any)[index].url = base64String
	}
	reader.readAsDataURL(file)
}


const removeBlock = (index: number) => {
	if (index < 0 || index >= state.content_json.length) return
	state.content_json.splice(index, 1)
}

const moveUp = (index: number) => {
	if (index <= 0) return
	const prev = state.content_json[index - 1]
	const current = state.content_json[index]
	if (!prev || !current) return
	state.content_json[index - 1] = current
	state.content_json[index] = prev
}

const moveDown = (index: number) => {
	if (index >= state.content_json.length - 1) return
	const next = state.content_json[index + 1]
	const current = state.content_json[index]
	if (!next || !current) return
	state.content_json[index + 1] = current
	state.content_json[index] = next
}

function isMultipleChoiceBlock(block: ContentJson | undefined): block is ContentJsonMultipleChoiceBlock {
	return !!block && (block as any).type === 'multiple_choice'
}

const addOption = (blockIndex: number) => {
	const block = state.content_json[blockIndex] as any
	if (!isMultipleChoiceBlock(block)) {
		console.warn('Block is not multiple_choice or missing')
		return
	}
	if (!block.options) block.options = []
	block.options.push({ label: 'New Option', value: `opt${block.options.length + 1}`, is_correct: false })
}

const removeOption = (blockIndex: number, optIndex: number) => {
	const block = state.content_json[blockIndex] as any
	if (!isMultipleChoiceBlock(block) || !block.options) return
	block.options.splice(optIndex, 1)
}

const submitFinal = async () => {
	if (!lmsClassStore.classDetail || !authStore.user) return


	state.class_id = lmsClassStore.classDetail.id
	state.author_id = authStore.user.id

	await lessonStore.createLesson({ ...state })
	await lmsClassStore.getDetailsClass(lmsClassStore.classDetail.id)
	closeLessonModal()
}

onMounted(async () => {
	await lmsClassStore.getDetailsClass(classId)
})
</script>