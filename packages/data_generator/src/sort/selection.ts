import type  {ID,Item, SortResultData, State} from './utils'
import {swap} from './utils'
export function selection_sort<T extends Array<Item>>(arr: T): SortResultData<T[number]> {
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

export const desc = String.raw`<strong>选择排序(Selection sort)</strong>排序算法。它的工作原理如下。首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置，然后，再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。以此类推，直到所有元素均排序完毕。
选择排序的主要优点与数据移动有关。如果某个元素位于正确的最终位置上，则它不会被移动。选择排序每次交换一对元素，它们当中至少有一个将被移到其最终位置上，因此对$n$个元素的表进行排序总共进行至多$(n-1)$次交换。在所有的完全依靠交换去移动元素的排序方法中，选择排序属于非常好的一种`