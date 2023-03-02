<script setup lang="ts">
import {
  darkTheme,
  NConfigProvider,
  NMessageProvider,
} from 'naive-ui';

import IndexPage from '@/views/IndexPage.vue';
</script>

<template>
  <n-config-provider
    style="height: 100%"
    :theme="darkTheme"
  >
    <n-message-provider>
      <index-page />
    </n-message-provider>
  </n-config-provider>
</template>
