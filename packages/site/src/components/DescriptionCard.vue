<template>
  <n-card style="overflow:auto">
    <!-- eslint-disable vue/no-v-html -->
    <div class="card">
      <span
        class="desc"
        v-html="rendered_desc"
      />
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { NCard } from 'naive-ui';

import { useMathScope } from '@/utils/common';
export type Props = {
  desc: string
}
const props = defineProps<Props>()
const rendered_desc = useMathScope(() => props.desc);
</script>

<style scoped>
.card {
  max-height: 100%;
  font-size: 1.1rem;
}
</style>