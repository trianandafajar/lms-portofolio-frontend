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
		<template #forums>
            <ul class="bg-white rounded-md border border-gray-200 p-4 mt-2 flex flex-col gap-3">
				<li
					v-for="i in 80"
					:key="i"
					class="flex flex-row mb-5 gap-3"
				>
					<div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 text-white flex items-center justify-center font-medium">
					A
					</div>
					<div class="flex flex-col gap-3">
						<div class="flex flex-row items-center">
							<b class="mr-3">Revan Dika {{ i }}</b>
							<span class="text-xs">21:32</span>
						</div>
						<div class="border border-gray-300 p-3 rounded-md">
							<p>Halo selamat pagi pak Eko, lorem ipsum, dolor amet, Maaf pak ijin gak berangkat.</p>
						</div>
					</div>
				</li>
			</ul>
		</template>
		<template #lessons>
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

<script setup>
const route = useRoute()
const classId = 1;

const tabs = [
	{ label: 'Forums', slot: 'forums' },
	{ label: 'Lessons', slot: 'lessons' },
	{ label: 'Students', slot: 'students' }
]
</script> 