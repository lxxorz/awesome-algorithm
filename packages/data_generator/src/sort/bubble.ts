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

export const desc = String.raw`
<strong>冒泡排序（英语：Bubble sort）</strong>是一种简单的排序算法。由于在算法的执行过程中，较小的元素像是气泡般慢慢「浮」到数列的顶端，故叫做冒泡排序。它的工作原理是每次检查相邻两个元素，如果前面的元素与后面的元素满足给定的排序条件，就将相邻两个元素交换。当没有相邻的元素需要交换时，排序就完成了。
经过$1$次扫描后，数列的末尾$1$项必然是最大的$1$项，因此冒泡排序最多需要扫描$1$遍数组就能完成排序。<h3>时间复杂度</h3>时间复杂度在序列完全有序时，冒泡排序只需遍历一遍数组，不用执行任何交换操作，时间复杂度为 $O(n)$。在最坏情况下，冒泡排序要执行$\frac{(n-1)n}{2}$次交换操作，时间复杂度为 $O(n^2)$。冒泡排序的平均时间复杂度为 $O(n^2)$。`