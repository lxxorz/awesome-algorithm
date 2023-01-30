<template>
  <n-menu mode="horizontal" @update-value="handleClick" :inverted="inverted" :collapsed-width="64"
    :collapsed-icon-size="22" :options="toolsMenu" />
</template>

<script setup lang="ts">
import {
  PlayerPause as PauseIcon,
  Refresh as ResetIcon,
  PlayerPlay as StartIcon
} from "@vicons/tabler";
import { invertedKey } from '@/utils/toolKeys';
import { renderIcon } from "@/utils/common"
import { inject, ref, render } from "vue"
import { NMenu, NLayoutSider, NLayout, type MenuOption } from "naive-ui"
const inverted = inject(invertedKey, ref(false));
type AnimationEvent = "reset" | "pause";
const emits = defineEmits<{
  (e: AnimationEvent, item: MenuOption): void
}>()
function handleClick(key: AnimationEvent, menu: MenuOption) {
  emits(key, menu)
  if (key === "pause") {
    const { label } = menu;
    menu.label = label === "暂停" ? "开始" : "暂停"
    if (menu.label === "暂停") {
      menu.icon = renderIcon(PauseIcon)
    } else {
      menu.icon = renderIcon(StartIcon)
    }
    return;
  }

  if (key === "reset") {
    return;

  }
}
const toolsMenu = ref([
  { label: "暂停", icon: renderIcon(PauseIcon), key: "pause" },
  { label: "重置", icon: renderIcon(ResetIcon), key: "reset" },
]satisfies MenuOption[]);
</script>

<style scoped>

</style>