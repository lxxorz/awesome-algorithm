import type { InjectionKey } from "vue";
import type { Ref } from "vue";
export const toolsKey = Symbol() as InjectionKey<
  Ref<{
    pause: boolean;
  }>
>;
export const invertedKey = Symbol() as InjectionKey<Ref<boolean>>;