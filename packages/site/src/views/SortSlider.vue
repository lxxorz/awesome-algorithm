<template>
  <n-space vertical>
    <n-slider v-model:value="value" :step="10" />
    <n-input-number v-model:value="value" size="small" />
  </n-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {NSpace, NInputNumber, NSlider} from "naive-ui"
const value = ref(30);

</script>
