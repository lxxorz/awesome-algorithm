<template>
  <div class="panel">
    <algorithm-visualize :sort_fn="sort_fn" />
    <description-card :desc="desc" />
  </div>
</template>

<script setup lang="ts">
import { selection_sort } from 'data_generator';
import { ref } from "vue"

import DescriptionCard from '@/components/DescriptionCard.vue';

import AlgorithmVisualize from './AlgorithmVisualize.vue';
const sort_fn = ref(selection_sort)
const desc = String.raw`选择排序（英语：Selection sort）是一种简单直观的排序算法。它的工作原理是每次找出第$i$小的元素（也就是 $A_{i..n}$ 中最小的元素），然后将这个元素与数组第$i$个位置上的元素交换。`
</script>

<style scoped>
.panel {
  inline-size: 100%;
  block-size: 100%;
  display: flex;
  flex-flow: row;
  justify-content: space-evenly;
  align-items: stretch;
}

@media (max-width: 1024px) {
  .panel {
    flex-flow: column;
  }
}

.panel>* {
  flex: 1 1 50%
}

.container {
  max-height: 100%;
}
</style>