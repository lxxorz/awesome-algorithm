<template>
  <n-space class="tool-bar">
    <toggle-button ref="refToggleButton" type="tertiary" @on-toggle="handleToggle" :init-state="'1'"/>
    <n-button type="primary" :render-icon="renderIcon(ResetIcon)" @click="handleReset">重置</n-button>
    <sort-slider v-model:value="progress" :max="props.max"></sort-slider>
  </n-space>
</template>

<script setup lang="ts">
import {
  Refresh as ResetIcon,
} from "@vicons/tabler";
import { invertedKey } from '@/utils/toolKeys';
import { renderIcon } from "@/utils/common"
import { inject, ref, onMounted, type Ref, watchEffect } from "vue"
import ToggleButton, { type State } from "@/components/ToggleButton.vue";
import { NSpace, NButton } from "naive-ui";
import SortSlider from "../SortSlider.vue";
import { useVModel } from "@vueuse/core"

export type Props = {
  auto_start: boolean
  progress?: number
  max: number
}

const inverted = inject(invertedKey, ref(false));
const refToggleButton = ref<InstanceType<typeof ToggleButton> | null>(null)
const props = withDefaults(defineProps<Props>(), {
  auto_start: false,
  progress: 0
})

const emits = defineEmits(["onPause", "onStart", "onReset", "update:progress"])
const progress = useVModel(props, "progress", emits)

watchEffect(() => {
  if (progress.value === props.max) {
    refToggleButton.value?.reset();
  }
})

function handleToggle(is_start: State) {
  is_start === "1" ? emits("onPause") : emits("onStart")
}

function reset() {
  refToggleButton?.value?.reset();
}

function handleReset() {
  emits('onReset');
  reset();
}
</script>