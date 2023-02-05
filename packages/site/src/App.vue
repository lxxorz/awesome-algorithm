<script setup lang="ts">
import {
  NMessageProvider,
  NConfigProvider,
  darkTheme
} from "naive-ui";
import IndexPage from "@/views/IndexPage.vue";
</script>

<template>
  <n-config-provider style="height: 100%" :theme="darkTheme">
    <n-message-provider>
      <index-page></index-page>
    </n-message-provider>
  </n-config-provider>
</template>
