<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <UCard class="w-full max-w-md shadow-md border border-gray-200 dark:border-gray-800 rounded-xl p-8 space-y-6">
      <!-- Logo & Title -->
      <div class="text-center space-y-3 mb-10">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Sign up to LMS</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Create your account to continue
        </p>
      </div>

      <!-- Form -->
      <UForm :state="form" @submit="handleRegister" class="space-y-5">
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
            autocomplete="new-password"
          />
        </UFormField>

        <UFormField label="Confirm Password" name="confirmPassword" required>
          <UInput
            class="w-full"
            v-model="confirmPassword"
            type="password"
            size="lg"
            placeholder="Repeat your password"
            autocomplete="new-password"
          />
        </UFormField>

        <div class="flex items-center justify-between">
          <UCheckbox
            v-model="form.is_active"
            label="I agree with the terms"
            name="terms"
          />
        </div>

        <UButton
          type="submit"
          block
          :loading="loading"
          :disabled="loading || !isPasswordMatch"
          class="h-11 text-base font-medium"
        >
          {{ loading ? 'Signing up...' : 'Sign Up' }}
        </UButton>
      </UForm>

      <!-- Login -->
      <p class="text-center text-sm text-gray-500">
        Already have an account?
        <UButton variant="link" to="/auth/login" size="sm">
          Log in now
        </UButton>
      </p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

definePageMeta({
  layout: 'auth'
})

const loading = ref(false)
const confirmPassword = ref('')
const form = ref<AuthRegister>({
  email: '',
  password: '',
  is_active: false
})

const isPasswordMatch = computed(() => {
  return form.value.password === confirmPassword.value
})

const handleRegister = async () => {
  if (!isPasswordMatch.value) {
    useToast().add({
      title: 'Error',
      description: 'Password and confirmation password do not match',
      color: 'warning'
    })
    return
  }

  try {
    loading.value = true
    await authStore.register(form.value)
    await router.push('/home')
  } catch (error: any) {
    useToast().add({
      title: 'Error',
      description: error.message || 'Registration failed, please try again',
      color: 'warning'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
</style>
