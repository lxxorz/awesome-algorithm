<template>
  <n-space vertical>
    <n-slider
      v-model:value="progress"
      :step="props.step"
      :max="props.max"
      :keyboard="true"
    >
      <template #thumb>
        <n-icon-wrapper
          :border-radius="12"
          :size="24"
        >
          <n-icon :component="ChevronRight" />
        </n-icon-wrapper>
      </template>
    </n-slider>
    <n-input-number
      v-model:value="progress"
      size="small"
      :max="props.max"
      :min="props.min"
    />
  </n-space>
</template>

<script setup lang="ts">
import { ChevronRight } from '@vicons/tabler'
import { useVModel } from '@vueuse/core'
import {
 NIcon, NIconWrapper,NInputNumber, NSlider, NSpace 
} from 'naive-ui'
export type Props = {
  value: number
  step?: number
  max?: number
  min?: number
}
const props = withDefaults(defineProps<Props>(), {
  value: 30,
  step: 1,
  max: 100,
  min: 0
})

const emits = defineEmits(['update:value'])
const progress = useVModel(props, 'value', emits)


</script>
