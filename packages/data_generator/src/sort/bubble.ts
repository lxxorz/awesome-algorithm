import type  {ID,Item, SortResultData, State} from './utils'
import { swap } from './utils';
export function bubble_sort<T extends Array<Item>>(arr: T): SortResultData<T[number]> {
  const length = arr.length;
  const state: Array<State<T[number]>> = [];
  const sorted = new Set<ID>()
  const is_end = false;
  // 初始帧
  state.push({
    data: [...arr],
    compared_id: [],
    sorted: new Set(sorted),
    is_swap: false,
    max_id: arr[0].id,
    is_end,
  })

  for (let i = 0,max = 0, max_item = arr[max]; i < length - 1; ++i) {
    // 找出最大值的下标
    for (let j = 1, next_item = arr[j]; j < length - i;max = j, j += 1, next_item = arr[j]) {
      let is_swap =false;
      const compared_id = [max_item.id, next_item.id];
      if(max_item.value > next_item.value) {
        is_swap = true;
        swap(arr, max, j);
      } else {
        max_item = next_item;
      }
      state.push({
        data: [...arr],
        compared_id,
        sorted: new Set(sorted),
        is_swap,
        max_id: max_item.id,
        is_end
      })
    }
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