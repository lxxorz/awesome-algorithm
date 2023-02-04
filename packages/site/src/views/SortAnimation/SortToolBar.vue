<template>
  <n-space>
    <toggle-button ref="refToggleButton" type="tertiary" @on-toggle="handleToggle" :init-state="'1'">{{
      startButtonText
    }}</toggle-button>
    <n-button type="primary" :render-icon="renderIcon(ResetIcon)" @click="handleReset">重置</n-button>
    <sort-slider></sort-slider>
  </n-space>
</template>

<script setup lang="ts">
import {
  Refresh as ResetIcon,
} from "@vicons/tabler";
import { invertedKey } from '@/utils/toolKeys';
import { renderIcon } from "@/utils/common"
import { inject, ref, onMounted, type Ref } from "vue"
import ToggleButton, { type State } from "@/components/ToggleButton.vue";
import { NSpace, NButton } from "naive-ui";
import SortSlider from "../SortSlider.vue";
export type Props = {
  auto_start: boolean
}

const inverted = inject(invertedKey, ref(false));
const startButtonText = ref<"暂停" | "开始">("开始")
const refToggleButton = ref<InstanceType<typeof ToggleButton> | null>(null)
const props = withDefaults(defineProps<Props>(), {
  auto_start: false
})

const emits = defineEmits(["onPause", "onStart", "onReset"])

function handleToggle(is_start: State) {
  startButtonText.value = is_start === "1" ? "开始" : "暂停"
  is_start === "1" ? emits("onPause") : emits("onStart")
}

function reset() {
  startButtonText.value = "开始"
  refToggleButton?.value?.reset();
  console.log(refToggleButton.value);

}
function handleReset() {
  emits('onReset');
  reset();
}
</script>

<style scoped>

</style>