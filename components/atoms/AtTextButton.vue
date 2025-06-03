<template>
  <Button
    class="box-border"
    :label="props.label"
    :disabled="props.disabled"
    :pt="pt"
    :rounded="props.rounded"
    unstyled
    @click="onClick"
  >
    <slot />
  </Button>
</template>

<script setup lang="ts">
import type { PassThrough } from '@primevue/core'
import type { ButtonPassThroughOptions } from 'primevue/button'

interface Props {
  label?: string
  rounded?: boolean
  disabled?: boolean
  cssClass?: {
    root?: string
    label?: string
  }
}

interface Emits {
  (event: 'click'): void
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  severity: 'primary',
  disabled: false,
  rounded: false,
  cssClass: () => ({
    root: '',
    label: '',
  }),
})

const emits = defineEmits<Emits>()

const pt = computed(
  (): PassThrough<ButtonPassThroughOptions> => ({
    root: {
      class: `${props.cssClass.root} box-border leading-none ${props.disabled ? '' : 'cursor-pointer'}`,
    },
    label: {
      class: `${props.cssClass.label}`,
    },
  }),
)

// method
function onClick() {
  emits('click')
}
</script>
