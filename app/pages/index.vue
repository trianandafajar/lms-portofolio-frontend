<script setup>
definePageMeta({
  layout: 'landing'
})

useHead({
  title: 'Smart AI-Powered Platform',
})

useSeoMeta({
  ogTitle: 'Mentora - Smart AI-Powered Learning Management System',
  description: 'Experience the future of education with Mentora. Automate assessment generation, track student progress, and manage classrooms with AI-driven insights.',
  ogDescription: 'Experience the future of education with Mentora. Automate assessment generation and track student progress.',
  ogImage: '/images/image_banner.png',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <main class="overflow-x-hidden">
    <!-- Components rendered immediately without animations -->
    <LandingpageHero />
    <LandingpageContent />
    <LandingpageFeatures />
    <LandingpageCTA />
  </main>
</template>


<style scoped></style>
