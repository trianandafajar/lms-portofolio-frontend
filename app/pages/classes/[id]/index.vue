<template>
    <div class="flex items-center gap-2 mb-4 bg-white px-4 py-2 rounded-lg border border-gray-200">
        <h1 class="text-base font-bold">XII RPL 1 > English Learning > Budi Santoso</h1>
    </div>

	<UTabs :items="tabs">
		<template #forums>
            Forums
		</template>
		<template #lessons>
			Lessons
		</template>
        <template #students>
			Students
		</template>
	</UTabs>
</template>

<script setup>


const tabs = [
	{ label: 'Forums', slot: 'forums' },
	{ label: 'Lessons', slot: 'lessons' },
	{ label: 'Students', slot: 'students' }
]
</script> 