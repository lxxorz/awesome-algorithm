type ID = string | number
export type State<T extends Item> = {
  data: Array<T>
  readonly compared_id: [ID | null , ID | null]
  max_id: ID
  sorted: Set<ID>
  is_swap: boolean
  is_end: boolean
};
export type Item = {
  id: ID
  value: number
  [key:string]: any
}
export type SortResultData<T extends Item> = {
  state: Array<State<T>>
  step_num: number
}

function swap_arr(arr, i, j) {
  ;[arr[i], arr[j]] = [arr[j], arr[i]]
}
export function selection_sort<T extends Array<Item>>(arr: T): SortResultData<T[number]> {
  const length = arr.length;
  const state: Array<State<T[number]>> = [];
  const sorted = new Set<ID>()
  let is_end = false;
  let max = 0;
  state.push({
    data: [...arr],
    compared_id: [null, null],
    sorted: new Set(sorted),
    is_swap: false,
    is_end,
    max_id: arr[0].id
  })
  for (let i = length - 1; i > 0; i--) {
    max = 0;
    // 找出最大值的下标
    for (let j = 0; j < i; ++j) {
      state.push({
        data: [...arr],
        compared_id: [arr[max].id, arr[j + 1].id],
        sorted: new Set(sorted),
        is_swap: false,
        max_id: max,
        is_end
      })
      if (arr[max].value < arr[j + 1].value) {
        max = j + 1;
      }
    }
    // 将最大值和最后一个交换
    swap_arr(arr, i, max);
    state.push({
      data: [...arr],
      compared_id: [max, i],
      sorted: new Set(sorted),
      is_swap: true,
      max_id: arr[i].id,
      is_end
    })
    // 将最后一个元素标记为有序
    sorted.add(arr[i].id);
  }
  state[state.length - 1].is_end = true;

  return {
    state,
    step_num: state.length
  };
}