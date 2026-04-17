<template>
  <div class="min-h-screen w-full flex bg-slate-50">

    <!-- Panel Kiri -->
    <div
      class="hidden lg:flex lg:w-1/2
      bg-gradient-to-br from-emerald-400 to-emerald-500
      text-white flex-col justify-between p-12"
    >

      <!-- Logo -->
      <nuxt-link to="/">
        <img
          src="/images/logo.png"
          alt="Mentora Logo"
          class="h-12 w-auto object-contain"
        />
      </nuxt-link>

      <!-- Hero Text -->
      <div class="space-y-6">
        <h2 class="text-4xl font-bold leading-tight">
          Empower your learning<br />
          journey with AI
        </h2>

        <p class="text-white/80 text-lg max-w-md">
          Manage classes, create interactive lessons, and track student
          progress — all in one platform.
        </p>
      </div>

      <!-- Footer -->
      <p class="text-sm text-white/60">
        © 2026 Mentora. All rights reserved.
      </p>
    </div>

    <!-- Panel Kanan -->
    <div class="flex-1 flex items-center justify-center px-6 py-12">
      <div class="w-full max-w-md">

        <!-- Logo Mobile -->
        <div class="lg:hidden mb-10 text-center">
          <img
            src="/images/logo.png"
            alt="Mentora Logo"
            class="h-10 w-auto object-contain mx-auto"
          />
        </div>

        <slot />

      </div>
    </div>

  </div>
</template>