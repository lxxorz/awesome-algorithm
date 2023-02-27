<script setup lang="ts">
import { ref, onMounted } from "vue";
import { select, type BaseType, type Selection } from "d3-selection";
import SortToolBar from "./SortToolBar.vue";
import { NCard } from "naive-ui";
import DescriptionCard from '@/components/DescriptionCard.vue'
import { type SortResultData, selection_sort, type State } from "data_generator"
import { transition, type Transition } from "d3-transition"
import type { SortItem, Widget } from "@/types";

const container = ref(null);
const delay = ref(250);
const svgTheme = {
  // bar_color: "#404040",
  bar_color: "none",
  stroke_color: "#404040"
}
// 排序算法生成初始数据
const widget: Widget = {
  width: 800,
  height: 600,
};
// TODO: 自定义生成数据
// 数据归一化处理
function getData(raw_data: Array<number>, widget: Widget) {
  const { height } = widget;
  const wrap_data: Array<SortItem> = raw_data.map((value, i) => ({ value, id: i++, label: value }))
  const max = Math.max(...raw_data);
  return wrap_data.map(datum => {
    const { value } = datum;
    // 将实际的值映射为高度
    return {
      ...datum,
      value: (value / (max + 5)) * height
    }
  })
}
// 获取排序项的宽度
// gap: (1/5)*width
// bar: (4/5)*width
function getBarWidth(sort_items: Array<SortItem>) {
  const bar_num = sort_items.length;
  const item_width = (widget.width / bar_num)
  return {
    bar_width: item_width * 4 / 5,
    bar_gap: item_width / 5
  }
}
const data = getData([1, 2, 3, 4, 58, 8, 24, 59, 80], widget);

const { bar_width, bar_gap } = getBarWidth(data);
const getX = (index: number) => index * (bar_gap + bar_width)
const getY = (nodeHeight: number, height: number) => height - nodeHeight;
const sortResult: SortResultData<SortItem> = selection_sort(data);
const all_state = sortResult.state;
const cur = ref(0);
const pause = ref(true);

function bindKey(datum: SortItem | number) {
  if (typeof datum === "number") {
    return datum + "";
  } else {
    return datum.id
  }
}

type SelectionLike<T extends SVGElement, U extends unknown> =
  | Selection<T, U, BaseType, unknown>
  | Transition<T, U, BaseType, unknown>
function textStyle(selection_like: SelectionLike<SVGTextElement, SortItem>) {
  return selection_like
    .style("font-size", "12px")
    .style("font-variant-numeric", "tabular-nums")
    .style("fill", "#fff")
}

function getDefaultTransition(duration: (() => number) | number = delay.value) {
  let stepCostTime: number;
  if (typeof duration === "function") {
    stepCostTime = duration();
  } else if (typeof duration === "number") {
    stepCostTime = duration;
  } else {
    throw new Error("duration must a function that return a number or a number");
  }

  return transition().duration(stepCostTime);
}
const selectChart = () => select(container.value)
  .append("g")
  .attr("id", "sort-bar")
  .selectAll<SVGRectElement, number>("rect")

const selectLabel = () => select(container.value)
  .append("g")
  .attr("id", "text")
  .attr("text-anchor", "middle")
  .selectAll<SVGTextElement, number>("text")

function createChart() {
  const { data } = all_state[0];
  const scale_factor = 1.05;

  select(container.value)
    .attr("width", widget.width)
    .attr("height", widget.height)
    .attr("viewBox", [0, 0, widget.width, widget.height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  const rects = selectChart()
    .data(data, bindKey)
    .enter()
    .append("rect")
    .attr("width", () => bar_width)
    .attr("height", (d) => d.value)
    .attr("x", (d, i) => getX(i))
    .attr("y", widget.height)
    .attr("fill", svgTheme.bar_color)
    .attr("stroke", svgTheme.stroke_color)
    .attr("stroke-width", "1")
    .attr("pointer-events", "all")

  const labels = selectLabel()
    .data(data, bindKey)
    .enter()
    .append("text")
    .attr("x", (d, i) => getX(i))
    .attr("y", widget.height)
    .attr("dx", () => bar_width / 2)
    .attr("dy", () => "-10px")
    .call(textStyle)
    .text(d => d.label)
    .attr("pointer-events", "all")

  rects.on("mouseover", function (event, datum,) {
    if (!pause.value)
      return;
    const rect = select(this);
    const label = labels.filter((d) => d.id === datum.id)
    const x = +rect.attr("x")
    const factor_offset = scale_factor - 1;
    const x_offset = -(x * factor_offset + bar_width * factor_offset / 2);
    select(this)
      .transition()
      .attr("stroke-width", 2)
      .attr("transform", `translate(${x_offset}, 0) scale(${scale_factor}, 1)`)
    label.style("font-weight", "bold")
      .style("font-size", "14px")
  }).on("mouseout", function (event, datum) {
    if (!pause.value)
      return;
    const label = labels.filter((d) => d.id === datum.id)
    select(this)
      .transition()
      .attr("transform", "translate(0, 0) scale(1)")
      .attr("stroke-width", 1)
    label.style("font-weight", "normal")
      .style("font-size", "12px")
  })

  rects
    .transition(getDefaultTransition())
    .attr("y", (d) => getY(d.value, widget.height))

  labels.transition(getDefaultTransition())
    .attr("y", (d, i) => getY(d.value, widget.height))

}

// 初始化动画
onMounted(() => {
  createChart();
})

async function updateBar(currentState: State<SortItem>) {
  const { data } = currentState;

  const svg = select("#sort-bar");
  const bars = svg.selectAll<SVGElement, number>("rect")
    .data(data, bindKey);

  const colors = getColorMap(currentState);

  const updateTransition = bars.transition(getDefaultTransition())
    .attr("fill", (d, i) => colors[d.id])
    .transition()
    .attr("x", (d, i) => getX(i))
    .attr("y", (d) => getY(d.value, widget.height));

  await updateTransition.end();
}

function getColorMap(currentState: State<SortItem>) {
  const { compared_id, sorted, is_end, max_id } = currentState;
  const colorMap: Record<string, string> = {};

  for (const item of currentState.data) {
    const { id } = item;
    if (is_end) {
      colorMap[id] = "orange";
    } else if (max_id === id) {
      colorMap[id] = "green";
    } else if (compared_id.includes(id)) {
      colorMap[id] = "red";
    } else if (sorted.has(id)) {
      colorMap[id] = "orange";
    } else {
      colorMap[id] = svgTheme.bar_color;
    }
  }

  return colorMap;
}
async function updateText(currentState: State<SortItem>) {
  const { data } = currentState;
  const update_transition = select("#text").selectAll<SVGTextElement, number>("text").data(data, bindKey)
    .transition()
    .delay(delay.value)
    .duration(delay.value)
    .attr("x", (d, i) => getX(i))
    .attr("y", (d) => getY(d.value, widget.height))
    .call(textStyle);

  await update_transition.end()
}

async function renderFn(execute_times: number | null) {
  let state = all_state[cur.value];
  for (let times = 0; execute_times === null || times < execute_times; ++times) {

    // 算法完成
    if (!state) {
      return;
    }
    // 如果处于暂停状态立即结束过渡
    if (pause.value) {
      return;
    }
    console.log("execute");
    await renderFrame(state);
    state = all_state[cur.value + 1];
    if (execute_times === null || times + 1 < execute_times && state) {
      cur.value++;
    }
  }
}

async function renderFrame(frame: State<SortItem>) {
  await Promise.all([updateBar(frame), updateText(frame)])
}
/**
 * 渲染可视化动画
 * @param execute_times 执行次数，可以是正整数和0以及null, 如果为null则一直执行
 */
function render(execute_times: number | null) {
  if (execute_times != null && (typeof execute_times !== "number" || execute_times < 0)) {
    throw new Error("执行次数必须是正整数或者0");
  }
  return renderFn(execute_times);
}

function interruptTransition() {
  console.log("interrupt");

  selectChart().interrupt()
  selectLabel().interrupt()
}

// 开始播放动画
async function onStart(execute_times: number | null = null) {
  console.log("on start")
  interruptTransition();
  pause.value = false;
  render(execute_times);
}

// 暂停动画
async function onPause() {
  console.log("on pause")
  pause.value = true;
}

// 重置动画
async function onReset() {
  console.log("on reset")
  cur.value = 0
  onPause()
  interruptTransition()
  await renderFrame(all_state[0])
}

// 调整动画进度
async function onUpdateProgress(progress: number) {
  console.log("on update", pause.value)
  cur.value = progress;
  if (pause.value) {

  }
}
</script>
<template>
  <div class="panel">
    <n-card>
      <svg id="container" ref="container"></svg>
      <sort-tool-bar class="tool-bar" @on-start="onStart" @on-pause="onPause" @on-reset="onReset" :auto_start="false"
        :max="sortResult.step_num - 1" :progress="cur" @update:progress="onUpdateProgress"></sort-tool-bar>
    </n-card>
    <description-card class="desc-card"></description-card>
  </div>
</template>

<style scoped>
.panel {
  inline-size: 100%;
  block-size: 100%;
  display: flex;
  flex-flow: row;
  justify-content: space-evenly;
  align-items: stretch;
}

@media (max-width: 1024px) {
  .panel {
    flex-flow: column;
  }
}

.panel>* {
  flex: 1 1 50%
}

.container {
  max-height: 100%;
}

.bar-text {
  fill: #f00
}
</style>