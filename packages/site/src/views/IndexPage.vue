<script setup lang="ts">
import {
  AlignRight as ItemIcon,
  ArrowsSort as SortIcon,
} from "@vicons/tabler";
import {
  NLayout,
  NLayoutContent,
  NLayoutSider,
  NMenu,
  useMessage,
} from "naive-ui";
import {h, provide,ref} from "vue";
import { RouterLink } from "vue-router";

import { renderIcon } from "@/utils/common"
import { toolsKey } from "@/utils/toolKeys";

const tools = ref({pause: false,});
provide(toolsKey, tools);
const inverted = ref(false);
const message = useMessage();
const is_collapsed = ref(true);
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
            {to: {name: "sort",},},
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
  <div class="animation-container">
    <n-layout
      embedded
      has-sider
      style="width: 100vw; height: 100vh;"
      content-style="padding: 24px"
    >
      <n-layout-sider
        v-model:collapsed="is_collapsed"
        bordered
        show-trigger
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :native-scrollbar="false"
        :inverted="inverted"
      >
        <n-menu
          :inverted="inverted"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
          @update-value="handleUpdateValue"
        />
      </n-layout-sider>
      <n-layout-content
        :native-scrollbar="false"
        :inverted="inverted"
      >
        <RouterView />
      </n-layout-content>
    </n-layout>
  </div>
</template>
