<template>
  <n-space vertical>
    <n-space>
      <toggle-button
        ref="refToggleButton"
        type="tertiary"
        :init-state="'1'"
        @on-toggle="handleToggle"
      />
      <n-button
        type="primary"
        :render-icon="renderIcon(ResetIcon)"
        @click="handleReset"
      >
        reset
      </n-button>
    </n-space>
    <sort-slider
      v-model:value="progress"
      :max="props.max"
    />
    <array-input
      :loading="props.loading"
      :localize="{key: 'sort-array', enable: true}"
      @on-create-array="$event => emits('on-reset-data', $event)"
    />
  </n-space>
</template>

<script setup lang="ts">
import {Refresh as ResetIcon,} from '@vicons/tabler';
import { useVModel } from '@vueuse/core'
import { NButton,NSpace } from 'naive-ui';
import { ref,  watchEffect } from 'vue'

import ArrayInput from '@/components/input/ArrayInput.vue'
import ToggleButton, { type State } from '@/components/ToggleButton.vue';
import { renderIcon } from '@/utils/common'

import SortSlider from '../SortSlider.vue';

export type Props = {
  autoStart: boolean
  loading: boolean
  progress?: number
  max: number,
}
const props = withDefaults(defineProps<Props>(), {
  autoStart: false,
  progress: 0
})
const emits = defineEmits(['onPause', 'onStart', 'onReset', 'update:progress', 'on-reset-data'])
const refToggleButton = ref<InstanceType<typeof ToggleButton> | null>(null)
const progress = useVModel(props, 'progress', emits)

watchEffect(() => {
  if (progress.value === props.max) {
    refToggleButton.value?.reset();
  }
})

function handleToggle(is_start: State) {
  is_start === '1' ? emits('onPause') : emits('onStart')
}

function reset() {
  refToggleButton?.value?.reset();
}

function handleReset() {
  emits('onReset');
  reset();
}
</script>