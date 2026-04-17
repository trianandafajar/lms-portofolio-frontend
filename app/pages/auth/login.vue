<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h1 class="text-2xl font-bold text-slate-900">Sign in to Mentora</h1>
      <p class="text-sm text-slate-500">Enter your credentials to access your account</p>
    </div>

    <UForm :state="form" @submit="handleLogin" class="space-y-5">
      <UFormField label="Email" name="email" required>
        <UInput
          class="w-full"
          v-model="form.email"
          type="email"
          size="lg"
          placeholder="you@example.com"
          autocomplete="email"
        />
      </UFormField>

      <UFormField label="Password" name="password" required>
        <UInput
          class="w-full"
          v-model="form.password"
          type="password"
          size="lg"
          placeholder="Enter your password"
          autocomplete="current-password"
        />
      </UFormField>

      <div class="flex items-center justify-between">
        <UCheckbox v-model="rememberMe" label="Remember me" name="remember" />
        <UButton variant="link" to="/auth/forgot-password" size="sm" class="text-slate-600">
          Forgot password?
        </UButton>
      </div>

      <UButton
        type="submit"
        block
        :loading="loading"
        :disabled="loading"
        color="neutral"
        class="h-11 text-base font-medium"
      >
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </UButton>
    </UForm>

    <p class="text-center text-sm text-slate-500">
      Don't have an account?
      <NuxtLink to="/auth/register" class="font-medium text-slate-900 hover:underline">
        Sign up
      </NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useLmsClassStore } from '~/stores/lmsclass'

const router = useRouter()
const authStore = useAuthStore()
const lmsClassStore = useLmsClassStore()

definePageMeta({
  layout: 'auth'
})

const loading = ref(false)
const rememberMe = ref(false)

const form = ref<AuthLogin>({
  email: 'admin@example.com',
  password: 'password'
})

const handleLogin = async () => {
  try {
    loading.value = true
    await authStore.login(form.value)
    await lmsClassStore.getMyClass()
    await router.push('/home')
  } catch (error: any) {
    useToast().add({
      title: 'Error',
      description: error.message || 'Login gagal, silakan coba lagi',
      color: 'warning'
    })
  } finally {
    loading.value = false
  }
}
</script>
