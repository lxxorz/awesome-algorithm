<template>
  <div class="panel">
    <algorithm-visualize :sort-fn="sort_algorithm.fn" />
    <description-card :desc="sort_algorithm.desc" />
  </div>
</template>

<script setup lang="ts">
import type {SortAlgorithmName, SortFn} from 'data_generator';
import { bubble_desc,bubble_sort,selection_desc,selection_sort } from 'data_generator';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import DescriptionCard from '@/components/DescriptionCard.vue';
import type { SortItem } from '@/types';

import AlgorithmVisualize from './AlgorithmVisualize.vue';
const route = useRoute();
type SortAlgorithm = {
  fn: SortFn<SortItem[]>
  desc: string
}
const algorithm_table: Record<SortAlgorithmName, SortAlgorithm> = {
  'selection-sort': {
    fn: selection_sort<SortItem[]>,desc: selection_desc
  },
  'bubble-sort': {
    fn: bubble_sort<SortItem[]>, desc: bubble_desc
  },
} as const;


const sort_algorithm = computed(() => {
  let sort: SortAlgorithmName = 'bubble-sort';
  const name = route.params.sort as SortAlgorithmName;
  if(name != null){
    sort =name;
  }
  return algorithm_table[sort];
})
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