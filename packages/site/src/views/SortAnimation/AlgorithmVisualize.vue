<script setup lang="ts">
import { ref, onMounted, inject } from "vue";
import "d3-transition";
import { select } from "d3-selection";
import SortToolBar from "./SortToolBar.vue";
import { toolsKey } from "@/utils/toolKeys";
import {type State, sort} from "data_generator"
const inverted = inject(toolsKey);
const delay = ref(100);
// 排序算法生成初始数据


function getViewBox() {
  let pageWidth = window.innerWidth,
    pageHeight = window.innerHeight;
  if (typeof pageWidth != "number") {
    if (document.compatMode == "CSS1Compat") {
      pageWidth = document.documentElement.clientWidth;
      pageHeight = document.documentElement.clientHeight;
    } else {
      pageWidth = document.body.clientWidth;
      pageHeight = document.body.clientHeight;
    }
  }
  return {
    height: pageHeight,
    width: pageWidth
  }
}
const { height, width } = getViewBox();
const raw_data = [93, 30, 59, 23, 99, 20, 83, 1, 2, 3, 4, 5, 6];
const getBarSize = () => {
  const totalSize = (width / raw_data.length);
  return {
    barWidth: totalSize * 4 / 5,
    barPadding: totalSize / 5
  }
}
const { barWidth, barPadding } = getBarSize();
console.log(barPadding, barWidth);

const max = Math.max(...raw_data);
const data = raw_data.map((h) => (h / (max + 10)) * height);
const getY = (nodeHeight: number, height: number) => height - nodeHeight;
const allState: Array<State> = sort(data);
const cur = ref(0);
const pause = ref(true);
function reset() {
  cur.value = 0;
  pause.value = true;
}

onMounted(() => {
  select("#container")
    .style("border", "1px solid black")
    .attr("viewBox", [0, 0, width, height])
    .selectAll("rect")
    .data(allState[0].data)
    .enter()
    .append("rect")
    .attr("width", () => barWidth)
    .attr("height", (d) => d)
    .attr("x", (_, i) => i * barPadding)
    .attr("y", (d) => getY(d, height))
    .attr("fill", "blue");
  render();
})
async function render() {
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
        if (is_end) {
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
      .attr("x", (_, i) => i * (barPadding + barWidth))
      .attr("y", (d) => getY(d, height));
    await pos_transition.end();
    if (!pause.value && cur.value < allState.length - 1) {
      ++cur.value;
    }
  }
}

</script>
<template>
  <svg id="container"></svg>
  <sort-tool-bar @on-start="pause = false" @on-pause="pause=true" @on-reset="reset" :auto_start="false"></sort-tool-bar>
</template>
