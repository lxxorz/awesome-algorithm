<script setup lang="ts">
import { ref, onMounted } from "vue";
import { select, type BaseType, type Selection } from "d3-selection";
import SortToolBar from "./SortToolBar.vue";
import DescriptionCard from '@/components/DescriptionCard.vue'
import { type SortResultData, sort } from "data_generator"
import type { Transition } from "d3-transition"
import "d3-transition"
const delay = ref(250);
// 排序算法生成初始数据
const { height, width } = {
  width: 100,
  height: 100
};
const raw_data = [93, 30, 59, 23, 99, 20, 83, 1, 2, 3, 4, 5, 6];
const getBarSize = () => {
  const totalSize = (width / raw_data.length);
  return {
    barWidth: totalSize * 4 / 5,
    barPadding: totalSize / 5
  }
}
const { barWidth, barPadding } = getBarSize();
const renderQueue: Array<() => Promise<void>> = [];
const max = Math.max(...raw_data);
const data = raw_data.map((h) => (h / (max + 10)) * height);
const getX = (index: number) => index * (barPadding + barWidth)
const getY = (nodeHeight: number, height: number) => height - nodeHeight;
const sortResult: SortResultData = sort(data);
const allState = sortResult.state;
const cur = ref(0);
const pause = ref(true);
let chart: Selection<SVGRectElement, unknown, SVGElement, unknown> | null = null;
let label: Selection<SVGTextElement, unknown, SVGElement, unknown> | null = null;

type SelectionLike<T extends SVGElement, U extends unknown> =
  Transition<T, U, SVGElement, unknown> | Selection<T, U, SVGElement, unknown>


function bindKey(datum: unknown) {
  return datum + ""

}
function textStyle(selection: SelectionLike<SVGTextElement, number>) {
  selection
    .style("font-size", "0.2em")
    .style("font-variant-numeric", "tabular-nums")
}
// 初始化动画
onMounted(() => {
  function initial() {
    chart = select("#container")
      .attr("viewBox", [0, 0, width, height])
      .append("g")
      .attr("id", "sort-bar")
      .selectAll("rect")

    chart
      .data(allState[0].data)
      .enter()
      .append("rect")
      .attr("width", () => barWidth)
      .attr("height", (d) => d)
      .attr("x", (d, i) => getX(i))
      .attr("y", (d) => getY(d, height))
      .attr("fill", "blue");

    label = select("#container")
      .append("g")
      .attr("id", "text")
      .attr("text-anchor", "middle")
      .selectAll("text")

    label
      .data(allState[0].data)
      .enter()
      .append("text")
      .attr("x", (d, i) => getX(i))
      .attr("y", (d, i) => getY(d, height))
      .attr("dx", () => barWidth / 2)
      .attr("dy", () => "-0.5em")
      .call(textStyle)
      .text(Math.floor)

  }
  initial();
})
/**
 * 渲染可视化动画
 * @param execute_times 执行次数，可以是正整数和0以及null, 如果为null则一直执行
 */
async function render(execute_times: number | null) {
  if (execute_times != null && (typeof execute_times !== "number" || execute_times < 0)) {
    throw new Error("执行次数必须是正整数或者0");
  }
  async function renderFn(
    chart: Selection<SVGRectElement, unknown, SVGElement, unknown> | null,
    label: Selection<SVGTextElement, unknown, SVGElement, unknown> | null
  ) {
    for (let times = 0; !execute_times || times < execute_times; ++times, ++cur.value) {
      let currentState = allState[cur.value]; // 当前的数据
      const sort_transition = chart
        ?.data(currentState.data, bindKey)
        .transition()
        .duration(delay.value)
        .attr("fill", (d, i) => {
          const { index, sorted, is_end, max } = currentState;
          if (is_end) {
            return "orange"
          }
          if (max === i) {
            return "green"
          }
          if (index.includes(i)) {
            return "red";
          }
          if (sorted[i]) {
            return "orange"
          }
          return "blue";
        })
        .transition()
        .duration(delay.value)
        .attr("x", (d, i) => getX(i))
        .attr("y", (d) => getY(d, height))

      label
        ?.data(currentState.data, bindKey)
        .transition()
        .duration(delay.value)
        .attr("x", (d, i) => getX(i))
        .attr("y", (d) => getY(d, height))
        .call(textStyle);

      // 等待过渡结束
      await sort_transition?.end()

      // 如果处于暂停状态立即结束过渡
      if (pause.value) {
        return;
      }

      // 算法完成
      if (cur.value >= sortResult.max - 1) {
        onPause();
        return
      }
    }
  }
  renderFn(chart, label);
}


// 开始播放动画
function onStart() {
  pause.value = false;
  render(null);
}

// 暂停动画
function onPause() {
  pause.value = true;
}

// 重置动画
function onReset() {
  onPause();
  cur.value = 0;
  render(1);
}

// 调整动画进度
async function onUpdateProgress(progress: number) {
  cur.value = progress;
  if (pause.value) {
    render(1);
  }
}
</script>
<template>
  <div class="panel">
    <div>
      <svg id="container"></svg>
      <sort-tool-bar class="tool-bar" @on-start="onStart" @on-pause="onPause" @on-reset="onReset" :auto_start="false"
        :max="sortResult.max - 1" :progress="cur" @update:progress="onUpdateProgress"></sort-tool-bar>
    </div>
    <description-card style="height: 100%"></description-card>
  </div>
</template>

<style scoped>
.panel {
  height: 100%;
  width: 100%;
  align-items: center;
  display: flex;
  flex-flow: row;
  row-gap: 20px;
  position: absolute;
}

.panel>* {
  flex: 1;
}
</style>