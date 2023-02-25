<template>
  <n-card style="overflow:auto">
    <div class="card">
      <span class="desc" v-html="rendered_desc.value">
      </span>
    </div>

  </n-card>
</template>

<script setup lang="ts">
import { NCard } from 'naive-ui';
import { ref, computed } from 'vue';
import { useMathScope } from '@/utils/common';
let desc = ref(String.raw`some thing about $E=mc^2$ and $f(x)=\sqrt{a+b}$`);
const rendered_desc = computed(() => useMathScope(desc));
</script>

<style scoped>
.card {
  max-height: 100%;
  font-size: 1.1rem;
}
</style>