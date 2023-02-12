<script setup lang="ts">
import {
  NMessageProvider,
  NConfigProvider,
} from "naive-ui";
import IndexPage from "@/views/IndexPage.vue";
import { theme } from './theme/theme';
</script>

<template>
  <n-config-provider style="height: 100%" :theme-overrides="theme">
    <n-message-provider>
      <index-page></index-page>
    </n-message-provider>
  </n-config-provider>
</template>
