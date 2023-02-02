<template>
  <n-button @click="toggle" :type="props.type" :render-icon="renderIcon(icon)">
    <slot></slot>
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
}
const props = withDefaults(defineProps<Props>(), {
  type: "default",
  initState: "1",
  icon_1: StartIcon,
  icon_2: PauseIcon
})
const state = ref<State>(props.initState ?? "1")
const icon = shallowRef<Component>(props.icon_1);
const emits = defineEmits<{
  (e: "onToggle", state: State): void
}>()
function reset() {
  icon.value = props.icon_1;
  state.value = props.initState ?? true;
}
function toggle() {
  if (state.value === "1") {
    state.value = "2";
    icon.value = props.icon_2;
  } else {
    state.value = "1";
    icon.value = props.icon_1
  }
  emits("onToggle", state.value);
}
defineExpose({
  reset
})
</script>

<style scoped>

</style>