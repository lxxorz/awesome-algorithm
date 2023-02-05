<template>
  <n-button @click="toggle" :type="props.type" :render-icon="renderIcon(icon)">
      {{ text }}
  </n-button>
</template>

<script setup lang="ts">
import { ref, shallowRef } from "vue"
import { NButton } from 'naive-ui';
import type { Type } from 'naive-ui/es/button/src/interface';
import { renderIcon } from '@/utils/common';
import type { Component } from 'vue';
import {
  PlayerPause as PauseIcon,
  PlayerPlay as StartIcon,
} from "@vicons/tabler";
export type State = "1" | "2";
export type Props = {
  type?: Type
  initState?: State
  icon_1?: Component
  icon_2?: Component
  text_1?: string
  text_2?: string
}
const props = withDefaults(defineProps<Props>(), {
  type: "default",
  initState: "1",
  icon_1: StartIcon,
  icon_2: PauseIcon,
  text_1: "开始",
  text_2: "暂停"
})
const state = ref<State>(props.initState ?? "1")
const icon = shallowRef<Component>(props.icon_1);
const text = ref("开始" ?? props.text_1);
const emits = defineEmits<{
  (e: "onToggle", state: State): void
}>()
function reset() {
  icon.value = props.icon_1;
  state.value = props.initState ?? true;
  text.value = props.text_1 ?? "开始"
}
function toggle() {
  if (state.value === "1") {
    start()
  } else {
    end();
  }
  emits("onToggle", state.value);
}

function start() {
  state.value = "2";
  icon.value = props.icon_2;
  text.value = props.text_2;
  emits("onToggle", state.value);
}

function end() {
  state.value = "1";
  icon.value = props.icon_1
  text.value = props.text_1
  emits("onToggle", state.value);
}
defineExpose({
  reset
})
</script>

<style scoped>

</style>