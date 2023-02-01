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
import { inject, ref, type Ref } from "vue"
import { NMenu, NLayoutSider, NLayout, type MenuOption } from "naive-ui"
const inverted = inject(invertedKey, ref(false));
type AnimationEvent = "reset" | "pause" | "start";
const emits = defineEmits<{
  (e: AnimationEvent, item: MenuOption): void
}>()
function handleClick(key: AnimationEvent, menu: MenuOption) {
  emits(key, menu)
  if (key === "pause") {
    menu.disabled = true;
    return;
  }

  if (key === "reset") {
    const pauseMenu = toolsMenu.value.find(item => item.key === "pause");
    pauseMenu!.icon = renderIcon(StartIcon)
    return;
  }
}
const toolsMenu: Ref<Array<MenuOption>> = ref([
  { label: "开始", icon: renderIcon(StartIcon), key: "start" },
  { label: "暂停", icon: renderIcon(PauseIcon), key: "pause" },
  { label: "重置", icon: renderIcon(ResetIcon), key: "reset" },
]satisfies { key: AnimationEvent, [key:string]: any }[]);
</script>

<style scoped>

</style>