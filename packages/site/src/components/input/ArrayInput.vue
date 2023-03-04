<template>
  <n-input-group>
    <n-input
      v-model:value="value"
      type="text"
      placeholder="input array"
      :loading="props.loading"
    />
    <n-button
      type="primary"
      ghost
      @click="onCreateArray"
    >
      create
    </n-button>
    <n-button
      type="primary"
      ghost
      @click="randomArray"
    >
      random
    </n-button>
  </n-input-group>
</template>

<script setup lang="ts">
import { type RemovableRef,useLocalStorage } from '@vueuse/core';
import {NButton, NInput, NInputGroup} from 'naive-ui'
import { computed,ref, watchEffect } from 'vue';

import { rangeRandom } from '../../utils/common';
export type Props = {
  loading: boolean,
  localize?: {
    key: string
    enable: boolean
  }
}
const props = defineProps<Props>();
const value = ref('')
const array_value = computed(() => value.value.replaceAll(/[\uff0c]/g, ',').split(',')
  .map(item => item.trim())
  .filter(Boolean)
  .map(item => parseFloat(item)));

let storage: RemovableRef<string>
if(props.localize?.enable) {
  storage = useLocalStorage(props.localize.key, '', {writeDefaults: true})
  value.value = storage.value
}
const emit = defineEmits(['update:value', 'on-create-array']);

watchEffect(() => {
  emit('update:value', array_value.value);
})

function onCreateArray() {
  emit('on-create-array', array_value.value)
  storage.value = array_value.value.join(',')
  value.value = '';
}

// 随机一个数组
function randomArray() {
  const MIN_LENGTH = 10, MAX_LENGTH = 20, MIN_VALUE = 10, MAX_VALUE = 100;
  const length = rangeRandom(MIN_LENGTH, MAX_LENGTH);
  const random_arr = new Array(length);
  for(let i = 0; i < length; ++i) {
    const value = rangeRandom(MIN_VALUE, MAX_VALUE);
    random_arr[i] = value;
  }
  value.value = random_arr.join(',');
}
</script>