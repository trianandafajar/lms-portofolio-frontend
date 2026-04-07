<template>
  <section class="relative overflow-hidden bg-white pt-32 pb-32">
    <!-- Decorative background - hidden from screen readers -->
    <div aria-hidden="true"
      class="absolute top-0 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-teal-50/50 blur-3xl">
    </div>

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-2 items-center gap-16">
        <div class="text-center md:text-left">
          <h1 class="text-5xl py-1.5 sm:text-6xl font-extrabold text-gray-900 leading-[1.1]">
            Smart Learning
            <span class="relative inline-block">
              <span class="relative z-10 text-green-500">Management System (LMS)</span>
              <span aria-hidden="true" class="absolute bottom-2 left-0 h-3 w-full bg-teal-100 -z-10"></span>
            </span>
          </h1>

          <p class="mt-8 text-gray-600 text-xl leading-relaxed">
            Automate assessment generation, track real-time analytics, and unify the educational experience
            for admins, teachers, and students in one powerful AI-driven system.
          </p>

          <div class="mt-10 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <NuxtLink to="/auth/register" aria-label="Get Started with Smart LMS"
              class="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-green-600 px-8 py-4 font-bold text-white transition-all focus:outline-none hover:bg-green-700 active:scale-95 duration-200">
              Get Started Now
            </NuxtLink>
          </div>
        </div>

        <div class="relative">
          <div class="relative z-10 overflow-hidden rounded-2xl transition hover:scale-[1.02]">
            <!-- Responsive image optimized for LCP -->
            <img src="/images/image_banner.png" alt="Visualization of Smart LMS Platform Interface"
              class="w-full object-cover" width="600" height="450" fetchpriority="high" loading="eager"
              decoding="async" />
          </div>
          <div aria-hidden="true" class="absolute -bottom-6 -right-6 -z-10 h-64 w-64 rounded-2xl bg-teal-500/10"></div>
        </div>
      </div>
    </div>
  </section>
</template>
