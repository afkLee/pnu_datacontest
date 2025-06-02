<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <MlAlertDialog v-model="apiError.isError" :content="apiError.message" />
  </div>
</template>

<script setup lang="ts">
import MlAlertDialog from '~/components/molecules/dialog/MlAlertDialog.vue'
import useApiError from '~/composables/useApiError'

const apiError = useApiError()
</script>
