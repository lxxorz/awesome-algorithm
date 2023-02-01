<script setup lang="ts">
import { ref, onMounted, } from "vue";
import "d3-transition";
import { select } from "d3-selection";
import SortToolBar from "./SortToolBar.vue";
const delay = ref(100);
// 排序算法生成初始数据
function sort(arr: number[]): Array<State> {
  const length = arr.length;
  const tmp: Array<State> = [];
  const sorted = new Array<boolean>(arr.length);
  let is_end = false;
  tmp.push({
    data: [...arr],
    index: [null, null],
    sorted: [...sorted],
    is_swap: false,
    is_end
  })
  for (let i = length - 1; i > 1; i--) {
    for (let j = 0; j < i; ++j) {
      let is_swap = false;
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        is_swap = true;
      }

      tmp.push({
        data: [...arr],
        index: [j, j + 1],
        sorted: [...sorted],
        is_swap,
        is_end
      })
    }
    sorted[i] = true;
  }

  tmp[tmp.length - 1].is_end = true;
  return tmp;
}
type State = {
  data: Array<number>
  readonly index: [number | null, number | null],
  sorted: boolean[],
  is_swap: boolean,
  is_end: boolean,
};
const height = 50,
  width = 100;
const raw_data = [93, 30, 59, 23, 99, 20, 83];
const max = Math.max(...raw_data);
const data = raw_data.map((h) => (h / (max + 10)) * height);
const getY = (nodeHeight: number, height: number) => height - nodeHeight;
const allState: Array<State> = sort(data);
const cur = ref(0);
const pause = ref(false);
function reset() {
  cur.value = 0;
  pause.value = true;

}
onMounted(() => {
  select("#container")
    .style("border", "1px solid black")
    .attr("viewBox", [0, 0, width, height])
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("width", "10")
    .attr("height", (d) => d)
    .attr("x", (_, i) => i * 12)
    .attr("y", (d) => getY(d, height))
    .attr("fill", "blue");

  async function update() {
    for (; ;) {
      let currentState = allState[cur.value];
      const all_item = select("#container")
        .selectAll("rect")
        .data(currentState.data, function (datum) {
          return datum + "";
        });
      const color_transition = all_item
        .transition()
        .duration(delay.value)
        .attr("fill", (d, i) => {
          const { index, sorted, is_end } = currentState;
          if(is_end) {
            return "orange"
          }
          if (index.includes(i)) {
            return "red";
          }
          if (sorted[i]) {
            return "orange"
          }
          return "blue";
        });
      await color_transition.end();

      const pos_transition = all_item
        .transition()
        .duration(delay.value)
        .attr("x", (_, i) => i * 12)
        .attr("y", (d) => getY(d, height));
      await pos_transition.end();
      if (!pause.value && cur.value < allState.length - 1) {
        ++cur.value;
      }
    }
  }
  update();
});
</script>
<template>
  <n-space>
    <svg id="container"></svg>
    <sort-tool-bar @pause="pause = !pause" @reset="reset"></sort-tool-bar>
  </n-space>
</template>
