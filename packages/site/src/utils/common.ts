import type { MaybeComputedRef } from '@vueuse/core';
import { resolveRef } from '@vueuse/core';
import renderMathInElement from 'katex'
import { NIcon } from 'naive-ui';
import { type Component,computed,h, ref } from 'vue'
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

export function useMathScope(desc: MaybeComputedRef<string>) {
  return computed(() => {
    desc = resolveRef(desc);
    const inline_math_reg = /\$[^$]+?\$/
    desc = ref(desc)
    let match = inline_math_reg.exec(desc.value);
    let text = desc.value;
    while (match != null) {
      text = desc.value.replace(match[0], renderMathInElement.renderToString(match[0].replaceAll('$', ''), {
        displayMode: false,
        output: 'mathml'
      }))
      match = inline_math_reg.exec(text);
    }
    return text;
  })
}

export function rangeRandom(start:number, end: number){
  return Math.ceil(start + Math.random() * (end - start));
}