import type {ComputedRef} from 'vue'
import {computed} from 'vue'
export type ID = string | number
export type State<T extends Item> = {
  data: Array<T>
  readonly compared_id: [ID | null, ID | null]
  max_id: ID
  sorted: Set<ID>
  is_swap: boolean
  is_end: boolean
};
export type Item = {
  id: ID
  value: number
  [key: string]: unknown
}
export type SortResultData<T extends Item> = {
  state: Array<State<T>>
  step_num: number
}

export type SortFn<T extends Array<Item>> = ((arr: T) => SortResultData<T[number]>)
export type SortFnRef<T extends Array<Item>> = ((arr: T) => ComputedRef<SortResultData<T[number]>>)
export function useSortFn<T extends Item>(sort: SortFn<Array<T>>) {
  return (arr: Array<T>) => computed(() => sort(arr))
}