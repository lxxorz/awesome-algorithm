<script setup lang="ts">
import { NMessageProvider } from "naive-ui";
import IndexPage from "@/views/IndexPage.vue";
</script>

<template>
  <n-message-provider>
    <index-page></index-page>
  </n-message-provider>
</template>
