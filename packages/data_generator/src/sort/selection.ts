import type  {Item, SortResultData, State, ID} from './utils'
function swap(arr: Array<unknown>, i: number, j: number) {
  [arr[i], arr[j]] = [arr[j], arr[i]]
}
export function selection_sort<T extends Array<Item>>(arr: T): SortResultData<T[number]> {
  const length = arr.length;
  const state: Array<State<T[number]>> = [];
  const sorted = new Set<ID>()
  const is_end = false;

  // 初始帧
  state.push({
    data: [...arr],
    compared_id: [null, null],
    sorted: new Set(sorted),
    is_swap: false,
    max_id: arr[0].id,
    is_end,
  })

  for (let i = length - 1,max = 0, max_item = arr[max]; i > 0; i--) {
    // 找出最大值的下标
    for (let j = 0, next_item = arr[j+1]; j < i; ++j, next_item = arr[j+1]) {
      state.push({
        data: [...arr],
        compared_id: [max_item.id, next_item.id],
        sorted: new Set(sorted),
        is_swap: false,
        max_id: max_item.id,
        is_end
      })
      if (max_item.value < next_item.value) {
        max = j + 1;
        max_item = arr[j+1];
      }
    }
    // 将最大值和最后一项交换
    swap(arr, max, i);
    state.push({
      data: [...arr],
      compared_id: [max_item.id, max_item.id],
      sorted: new Set(sorted),
      is_swap: true,
      max_id: max_item.id,
      is_end
    })
    // 标记有序项
    sorted.add(max_item.id);

    max = 0;
    max_item = arr[max];
  }
  // 标记结束帧
  state[state.length - 1].is_end = true;
  return {
    state,
    step_num: state.length
  };
}