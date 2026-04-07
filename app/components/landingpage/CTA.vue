<template>
  <section class="relative overflow-hidden bg-green-600 py-24">
    <div class="absolute inset-0" aria-hidden="true">
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[800px] bg-green-400/30 blur-3xl rounded-full">
      </div>
    </div>

    <div class="relative mx-auto max-w-4xl px-6 text-center">
      <h2 class="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
        Ready to Transform Your Learning Experience?
      </h2>

      <p class="mt-6 text-lg text-green-100 leading-relaxed">
        Start using Mentora today and experience AI-powered learning, smarter assessments, and real-time insights.
      </p>

      <div class="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <NuxtLink to="/auth/register"
          class="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 font-bold text-green-600 hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95">
          Get Started Free
        </NuxtLink>
      </div>
    </div>
  </section>
</template>