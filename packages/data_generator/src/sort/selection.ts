export type State = {
  data: Array<number>
  readonly index: [number | null, number | null]
  sorted: boolean[]
  is_swap: boolean
  is_end: boolean
  max: number
};

export type SortResultData = {
  state: Array<State>
  step_num: number
}
function swap_arr(arr, i, j) {
  ;[arr[i], arr[j]] = [arr[j], arr[i]]
}
export function selection_sort(arr: number[]): SortResultData {
  const length = arr.length;
  const state: Array<State> = [];
  const sorted = new Array<boolean>(arr.length);
  let is_end = false;
  let max = 0;
  state.push({
    data: [...arr],
    index: [null, null],
    sorted: [...sorted],
    is_swap: false,
    is_end,
    max
  })
  for (let i = length - 1; i > 0; i--) {
    max = 0;
    // 找出最大值的下标
    for (let j = 0; j < i; ++j) {
      state.push({
        data: [...arr],
        index: [max, j + 1],
        sorted: [...sorted],
        is_swap: false,
        max,
        is_end
      })
      if (arr[max] < arr[j + 1]) {
        max = j + 1;
      }
    }
    // 将最大值和最后一个交换
    swap_arr(arr, i, max);
    state.push({
      data: [...arr],
      index: [max, i],
      sorted: [...sorted],
      is_swap: true,
      max: i,
      is_end
    })
    // 将最后一个元素标记为有序
    sorted[i] = true;
  }

  state[state.length - 1].is_end = true;

  return {
    state,
    step_num: state.length
  };
}