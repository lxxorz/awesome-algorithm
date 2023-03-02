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
  </n-input-group>
</template>

<script setup lang="ts">
import {NButton, NInput, NInputGroup} from 'naive-ui'
import {computed, ref, watchEffect} from 'vue'
export type Props = {
  loading: boolean,
}
const value = ref('');
const props = defineProps<Props>();
const emit = defineEmits(['update:value', 'on-create-array']);

const array_value = computed(() => value.value.split(',').map(item => item.trim())
.filter(Boolean)
.map(item => parseFloat(item)));
watchEffect(() => {
  emit('update:value', array_value.value);
})

function onCreateArray() {
  emit('on-create-array', array_value.value)
  value.value = '';
}
</script>