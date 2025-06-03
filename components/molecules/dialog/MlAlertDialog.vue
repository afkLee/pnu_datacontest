<template>
  <div>
    <Dialog
      v-model:visible="isVisible"
      modal
      :class="props.width"
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
      <div>
        <AtTextButton
          label="닫기"
          :css-class="{
            root: 'bg-white rounded-button-sm h-button-sm border-secondary-200 border-1 w-full font-paperlogy',
            label: 'font-medium text-secondary-500',
          }"
          variant="outlined"
          @click="handleClick"
        />
      </div>
      <template #closeicon>
        <CloseSvg />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import CloseSvg from '~/assets/icons/close.svg'
import AtTextButton from '~/components/atoms/AtTextButton.vue'

interface Props {
  header?: string
  content?: string
  callback?: () => void
  width?: string
}

// value
const props = withDefaults(defineProps<Props>(), {
  header: '알림',
  content: '',
  callback: () => {},
  width: 'w-11/12 tablet:w-100',
})
const isVisible = defineModel({ default: false, type: Boolean })

// method
function handleClick() {
  isVisible.value = false
  props.callback()
}
</script>
