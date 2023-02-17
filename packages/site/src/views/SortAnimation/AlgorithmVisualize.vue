<script setup lang="ts">
import { ref, onMounted } from "vue";
import { select , type BaseType, type Selection} from "d3-selection";
import SortToolBar from "./SortToolBar.vue";
import { NCard } from "naive-ui";
import DescriptionCard from '@/components/DescriptionCard.vue'
import { type SortResultData, selection_sort, type State } from "data_generator"
import { transition, type Transition } from "d3-transition"
import type { SortItem, Widget } from "@/types";
import "d3-transition"

const delay = ref(250);
const svgTheme = {
  bar_color: "#404040",
}
// 排序算法生成初始数据
const widget = {
  height: 100,
  width: 100,
} satisfies Widget
// TODO: 自定义生成数据
// 数据归一化处理
function getData(raw_data: Array<number>, Widget: Widget) {
  const { height } = widget;
  const wrap_data: Array<SortItem> = raw_data.map((value, i) => ({ value, id: i++, label: value }))
  const max = Math.max(...raw_data);
  return wrap_data.map(datum => {
    const { value } = datum;
    // 将实际的值映射为高度
    return {
      ...datum,
      value: (value / (max + 10)) * height
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
const allState = sortResult.state;
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
    .style("font-size", "0.2em")
    .style("font-variant-numeric", "tabular-nums")
}

function defaultTransition(duration: (() => number) | number = delay.value) {
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
const getChart = () => select("#container")
  .attr("viewBox", [0, 0, widget.width, widget.height])
  .append("g")
  .attr("id", "sort-bar")
  .selectAll<SVGRectElement, number>("rect")

const getLabel = () => select("#container")
  .append("g")
  .attr("id", "text")
  .attr("text-anchor", "middle")
  .selectAll<SVGTextElement, number>("text")

function initialSortBar() {
  const { data } = allState[0];
  getChart()
    .data(data, bindKey)
    .enter()
    .append("rect")
    .attr("width", () => bar_width)
    .attr("height", (d) => d.value)
    .attr("x", (d, i) => getX(i))
    .attr("y", widget.height)
    .attr("fill", svgTheme.bar_color)
    .transition(defaultTransition())
    .attr("y", (d) => getY(d.value, widget.height))


  getLabel()
    .data(data, bindKey)
    .enter()
    .append("text")
    .attr("x", (d, i) => getX(i))
    .attr("y", widget.height)
    .attr("dx", () => bar_width / 2)
    .attr("dy", () => "-0.5em")
    .call(textStyle)
    .text(d => d.label)
    .transition(defaultTransition())
    .attr("y", (d, i) => getY(d.value, widget.height))

}



// 初始化动画
onMounted(() => {
  initialSortBar();
})

async function updateBar(currentState: State<SortItem>) {
  const { data } = currentState;
  const update_transition = select("#sort-bar")
    .selectAll<SVGElement, number>("rect")
    .data(data, bindKey)
    .transition(defaultTransition())
    .attr("fill", (sort_item, i) => {
      const { compared_id, sorted, is_end, max_id } = currentState;
      const {id} = sort_item;
      // 如果到了最后一步，全部都是有序的
      if (is_end) {
        return "orange"
      }
      // 最值
      if (max_id === id) {
        return "green"
      }
      // 正在进行对比的项
      if (compared_id.includes(id)) {
        return "red";
      }
      // 有序的项
      if (sorted.has(id)) {
        return "orange"
      }
      // 默认颜色
      return svgTheme.bar_color;
    })
    .transition()
    .attr("x", (d, i) => getX(i))
    .attr("y", (d) => getY(d.value, widget.height))

  await update_transition.end();
}

async function updateText(currentState: State<SortItem>) {
  const { data } = currentState;
  const update_transition = select("#text")
    .selectAll<SVGTextElement, number>("text")
    .data(data, bindKey)
    .transition()
    .delay(delay.value)
    .duration(delay.value)
    .attr("x", (d, i) => getX(i))
    .attr("y", (d) => getY(d.value, widget.height))
    .call(textStyle);

  await update_transition.end();
}

async function renderFn(execute_times: number | null) {
  for (let times = 0; !execute_times || times < execute_times; ++times, ++cur.value) {
    // 获取当前切片
    let currentState = allState[cur.value];
    await Promise.all([updateBar(currentState), updateText(currentState)])
    // 如果处于暂停状态立即结束过渡
    if (pause.value) {
      break;
    }
    // 算法完成
    if (cur.value >= sortResult.step_num - 1) {
      onPause();
      break;
    }
  }
}
/**
 * 渲染可视化动画
 * @param execute_times 执行次数，可以是正整数和0以及null, 如果为null则一直执行
 */
function render(execute_times: number | null) {
  if (execute_times != null && (typeof execute_times !== "number" || execute_times < 0)) {
    throw new Error("执行次数必须是正整数或者0");
  }
  renderFn(execute_times);
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
    <n-card>
      <svg id="container"></svg>
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
</style>