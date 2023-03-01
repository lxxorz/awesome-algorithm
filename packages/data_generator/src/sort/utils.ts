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
  [key: string]: any
}
export type SortResultData<T extends Item> = {
  state: Array<State<T>>
  step_num: number
}

export type SortFn<T extends Array<Item>> = ((arr: T) => SortResultData<T[number]>)