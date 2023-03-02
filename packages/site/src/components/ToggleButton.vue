<template>
  <n-button
    :type="props.type"
    :render-icon="renderIcon(icon)"
    @click="toggle"
  >
    {{ text }}
  </n-button>
</template>

<script setup lang="ts">
import {
  PlayerPause as PauseIcon,
  PlayerPlay as StartIcon,
} from '@vicons/tabler';
import { NButton } from 'naive-ui';
import type { Type } from 'naive-ui/es/button/src/interface';
import type { Component } from 'vue';
import { ref, shallowRef } from 'vue'

import { renderIcon } from '@/utils/common';
export type State = '1' | '2';
export type Props = {
  type?: Type
  initState?: State
  icon1?: Component
  icon2?: Component
  text1?: string
  text2?: string
}
const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  initState: '1',
  icon1: StartIcon,
  icon2: PauseIcon,
  text1: 'start',
  text2: 'pause'
})
const state = ref<State>(props.initState ?? '1')
const icon = shallowRef<Component>(props.icon1);
const text = ref('start' ?? props.text1);
const emits = defineEmits<{
  (e: 'onToggle', state: State): void
}>()
function reset() {
  icon.value = props.icon1;
  state.value = props.initState ?? true;
  text.value = props.text1 ?? 'start'
}
function toggle() {
  if (state.value === '1') {
    start()
  } else {
    end();
  }
  emits('onToggle', state.value);
}

function start() {
  state.value = '2';
  icon.value = props.icon2;
  text.value = props.text2;
}

function end() {
  state.value = '1';
  icon.value = props.icon1
  text.value = props.text1
}
defineExpose({reset})
</script>