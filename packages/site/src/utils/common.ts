import { h, ref, type Component } from "vue"
import type { MaybeRef } from "@vueuse/core";
import renderMathInElement from "katex"
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

export function useMathScope(desc: MaybeRef<string>) {
  const inline_math_reg = /\$[^$]+?\$/g
  desc = ref(desc)
  let match = inline_math_reg.exec(desc.value);
  while (match != null) {
    console.log("match", match[0]);
    desc.value = desc.value.replace(match[0], renderMathInElement.renderToString(match[0].replaceAll("$", ""), {
      displayMode: false,
      output: "mathml"
    }))
    match = inline_math_reg.exec(desc.value);
  }
  console.log(desc.value);
  return desc;
}