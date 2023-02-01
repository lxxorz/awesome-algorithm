<script setup lang="ts">
import { toolsKey } from "@/utils/toolKeys";
import {
  NSpace,
  NSwitch,
  NLayoutSider,
  NLayout,
  NMenu,
  NLayoutContent,
  useMessage,
  NDivider,
} from "naive-ui";
import { ref, h, provide, type Component } from "vue";
import {
  ArrowsSort as SortIcon,
  AlignRight as ItemIcon,
} from "@vicons/tabler";
import { RouterLink } from "vue-router";
import { renderIcon } from "@/utils/common"

const tools = ref({
  pause: false,
});
provide(toolsKey, tools);
const inverted = ref(false);
const message = useMessage();

const handleUpdateValue = (key: string) => {
  message.info(JSON.stringify(key));
};
const menuOptions = ref([
  {
    label: "排序算法",
    key: "sort-algorithm",
    icon: renderIcon(SortIcon),
    children: [
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: "sort",
              },
            },
            { default: () => "选择排序" }
          ),
        key: "selection-sort",
        icon: renderIcon(ItemIcon),
      },
      {
        label: () => h("div", null, { default: () => "冒泡排序" }),
        key: "bubble-sort",
        icon: renderIcon(ItemIcon),
      },
    ],
  },
]);

</script>
<template>
  <div id="app">
    <n-space vertical>
      <n-space> <n-switch v-model:value="inverted" /> inverted </n-space>
      <n-layout has-sider>
        <n-layout-sider bordered show-trigger collapse-mode="width" :collapsed-width="64" :width="240"
          :native-scrollbar="false" :inverted="inverted">
          <n-menu @update-value="handleUpdateValue" :inverted="inverted" :collapsed-width="64" :collapsed-icon-size="22"
            :options="menuOptions" />
        </n-layout-sider>
        <n-layout-content :inverted="inverted"  content-style="max-width: calc(100vw - 200px)">
          <RouterView />
        </n-layout-content>
      </n-layout>
    </n-space>
  </div>
</template>

<style scoped>
#app {
  height: 100vh;
}
</style>
