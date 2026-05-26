<template>
    <header :class="['bg-gray-50 fixed top-0 z-[999] w-full ...', hidden ? '-translate-y-full' : 'translate-y-0']">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-20 items-center justify-between">
                <div class="md:flex md:items-center md:gap-6">
                    <NuxtLink class="flex items-center" to="/">
                        <span class="sr-only">Home</span>
                        <img src="/images/logo.png" alt="Mentora" class="h-10 w-auto object-contain" />
                    </NuxtLink>
                </div>

                <div class="flex items-center gap-4">
                    <div class="flex gap-2 sm:gap-4">
                        <NuxtLink to="/auth/login"
                            data-walkthrough="landing-login-button"
                            class="rounded-md bg-green-600 px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium text-white shadow-sm">
                            Login
                        </NuxtLink>

                        <NuxtLink to="/auth/register"
                            data-walkthrough="landing-register-button"
                            class="rounded-md bg-gray-100 px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium text-green-500">
                            Register
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
const hidden = ref(false);
const lastScroll = ref(0);

const handleScroll = () => {
    const current = window.scrollY;

    if (Math.abs(current - lastScroll.value) < 10) return;

    // Don't hide header if walkthrough is active
    const walkthroughActive = document.querySelector('[data-walkthrough-overlay]');
    if (walkthroughActive) {
        hidden.value = false;
        return;
    }

    hidden.value = current > lastScroll.value && current > 100;

    lastScroll.value = current;
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>