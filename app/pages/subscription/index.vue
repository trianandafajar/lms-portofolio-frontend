<template>
  <div class="space-y-6">
    <UAlert v-if="successMessage" color="success" variant="soft" :title="successMessage" icon="heroicons-check-circle"
      :close-button="{ onClick: () => successMessage = '' }" />

    <UAlert v-if="errorMessage" color="error" variant="soft" :title="errorMessage" icon="heroicons-exclamation-triangle"
      :close-button="{ onClick: () => errorMessage = '' }" />

    <SubscriptionPlans />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const successMessage = ref('')
const errorMessage = ref('')

onMounted(async () => {
  // Restrict to teachers
  if (!auth.user?.roles?.includes('teacher')) {
    await router.replace('/classes')
    return
  }

  const status = route.query.status
  const subId = route.query.sub_id

  // Handle subscription checkout callbacks
  if (status === 'success' && subId) {
    successMessage.value = `Great news! Your subscription has been activated successfully.`
    router.replace({ path: route.path, query: {} })
  } else if (status === 'canceled') {
    errorMessage.value = `Your payment process was canceled. No charges were made.`
    router.replace({ path: route.path, query: {} })
  } else if (status === 'failed') {
    errorMessage.value = `Payment failed. Please check your card details and try again.`
    router.replace({ path: route.path, query: {} })
  }
})
</script>
