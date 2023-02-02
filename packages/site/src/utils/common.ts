import { h, type Component } from "vue"
import { NIcon } from "naive-ui";
export const randomArray = (arr: number[]) => {
  for (let i = arr.length - 1; i >= 0; --i) {
    const swap_id = Math.floor(Math.random() * i);
    [arr[i], arr[swap_id]] = [arr[swap_id], arr[i]];
  }
};

export async function sleep(delay: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}

export function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}