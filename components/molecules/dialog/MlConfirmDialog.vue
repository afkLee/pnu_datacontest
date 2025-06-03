<template>
  <div>
    <Dialog
      v-model:visible="isVisible"
      modal
      :class="widthClass"
      :header="props.header"
      :pt="{
        content: 'border-t-1 border-t-secondary-200',
      }"
    >
      <div class="my-6 flex w-full justify-center text-center font-paperlogy">
        <slot>
          <span>{{ props.content }}</span>
        </slot>
      </div>
      <div class="flex gap-4">
        <AtTextButton
          :label="props.cancelText"
          :css-class="{
            root: 'bg-white rounded-button-sm h-button-sm border-secondary-200 border-1 w-full font-paperlogy',
            label: 'font-medium text-secondary-500',
          }"
          variant="outlined"
          @click="handleCancel"
        />
        <AtTextButton
          :label="props.confirmText"
          :css-class="{
            root: 'bg-secondary-700 rounded-button-sm h-button-sm border-secondary-700 border-1 w-full font-paperlogy',
            label: 'font-medium text-secondary-50',
          }"
          variant="outlined"
          @click="handleConfirm"
        />
      </div>
      <template #closeicon>
        <CloseSvg />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CloseSvg from 'assets/icons/close.svg'
import AtTextButton from '~/components/atoms/AtTextButton.vue'

interface Props {
  header?: string
  content?: string
  cancelText?: string
  confirmText?: string
  callback?: () => void
  width?: string
}
const props = withDefaults(defineProps<Props>(), {
  header: '알림',
  content: '',
  cancelText: '닫기',
  confirmText: '확인',
  callback: () => {},
  width: 'w-11/12 tablet:w-100',
})
const isVisible = defineModel({ default: false, type: Boolean })

const widthClass = computed(() => props.width || 'w-11/12 tablet:w-100')

function handleCancel() {
  isVisible.value = false
}
function handleConfirm() {
  isVisible.value = false
  props.callback()
}
</script>
