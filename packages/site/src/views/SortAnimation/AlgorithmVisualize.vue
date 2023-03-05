<script setup lang="ts">
import {reactify} from '@vueuse/core'
import {type BaseType, select, type Selection} from 'd3-selection';
import {type Transition,transition} from 'd3-transition'
import type {ID,SortFn, State} from 'data_generator'
import { NCard } from 'naive-ui';
import {
  computed,
  onMounted,ref,
} from 'vue';

import type {SortItem, Widget} from '@/types';

import SortToolBar from './SortToolBar.vue';
export type Props = {
  sortFn: SortFn<SortItem[]>
}
const cur = ref(0);
const props = defineProps<Props>();
const container = ref(null);
const delay = ref(250);
const svgTheme = {
  // bar_color: "#404040",
  bar_color: 'none',
  stroke_color: '#404040'
}
const raw_data = ref([1, 2, 3, 4, 58, 8, 24, 59, 80])
// 排序算法生成初始数据
const widget: Widget = {
  width: 800,
  height: 600,
};
function getData(raw_data: Array<number>, widget: Widget) {
  const { height } = widget;
  const wrap_data: Array<SortItem> = raw_data.map((value, i) => ({
    value, id: i++, label: value
  }))
  const max = Math.max(...raw_data);
  return wrap_data.map(datum => {
    const { value } = datum;
    // 将实际的值映射为高度
    return {
      ...datum,
      value: (value / (max + 15)) * height
    }
  })
}
// 获取排序项的宽度
// gap: (1/5)*width
// bar: (4/5)*width
function getBarWidth(length:number) {
  const bar_num = length;
  const item_width = (widget.width / bar_num);
  return {
    bar_width: item_width * 4 / 5,
    bar_gap: item_width / 5
  }
}

function resetData(custom_data: Array<number>) {
  if(custom_data.length !== 0) {
    raw_data.value = custom_data;
    onReset();
  }
}
const useSort = reactify(() => {
  const wrap_data = getData(raw_data.value, widget);
  return props.sortFn(wrap_data);
})
const sort_result = useSort();
const all_state =  computed(() => sort_result.value.state)
const current_state = computed(() => all_state.value[cur.value])
const bar_size = computed(() => getBarWidth(raw_data.value.length))
const bar_width = computed(() => bar_size.value.bar_width);
const bar_gap = computed(() => bar_size.value.bar_gap);


const getX = (index: number) => index * (bar_gap.value + bar_width.value)
const getY = (nodeHeight: number) => widget.height - nodeHeight;
const pause = ref(true);

function bindKey(datum: SortItem | number) {
  if (typeof datum === 'number') {
    return datum + '';
  } else {
    return datum.id
  }
}

type SelectionLike<T extends SVGElement, U> =
  | Selection<T, U, BaseType, unknown>
  | Transition<T, U, BaseType, unknown>
function textStyle(selection_like: SelectionLike<SVGTextElement, SortItem>) {
  return selection_like
    .style('font-size', '12px')
    .style('font-variant-numeric', 'tabular-nums')
    .style('fill', '#fff')
}

function getDefaultTransition(duration: (() => number) | number = delay.value) {
  let stepCostTime: number;
  if (typeof duration === 'function') {
    stepCostTime = duration();
  } else if (typeof duration === 'number') {
    stepCostTime = duration;
  } else {
    throw new Error('duration must a function that return a number or a number');
  }

  return transition().duration(stepCostTime);
}
const selectChart = () => select(container.value)
  .append('g')
  .attr('id', 'sort-bar')


const selectLabel = () => select(container.value)
  .append('g')
  .attr('id', 'text')
  .attr('text-anchor', 'middle')


function initChart() {
  selectChart()
  selectLabel()
  select(container.value)
    .attr('width', widget.width)
    .attr('height', widget.height)
    .attr('viewBox', [0, 0, widget.width, widget.height])
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');
}

 type BarSelection = Selection<SVGRectElement | BaseType, SortItem, BaseType, unknown>
 type TextSelection = Selection<SVGTextElement | BaseType, SortItem, BaseType, unknown>


// 绑定hover效果
function bindMouseEffect(labels: TextSelection, rects: BarSelection) {
  const scale_factor = 1.05;
  function mouseOver(this:BaseType | SVGRectElement, event: unknown, datum: SortItem) {
    if (!pause.value)
      return;
    const rect = select(this);
    const label = labels.filter((d) => d.id === datum.id)
    const x = +rect.attr('x')
    const factor_offset = scale_factor - 1;
    const x_offset = -(x * factor_offset + bar_width.value * factor_offset / 2);
    select(this)
      .transition()
      .attr('stroke-width', 2)
      .attr('transform', `translate(${x_offset}, 0) scale(${scale_factor}, 1)`)
    label.style('font-weight', 'bold')
      .style('font-size', '14px')
    addArrow(datum.id);
  }
  function mouseOut(this:BaseType | SVGRectElement, event: unknown, datum: SortItem) {
    if (!pause.value)
      return;
    const label = labels.filter((d) => d.id === datum.id)
    select(this)
      .transition()
      .attr('transform', 'translate(0, 0) scale(1)')
      .attr('stroke-width', 1)
    label.style('font-weight', 'normal')
      .style('font-size', '12px')
    removeArrow(datum.id);
  }
  rects.on('mouseover.effect', null);
  rects.on('mouseover.effect', mouseOver).on('mouseout', mouseOut)
}

async function addArrow(id: ID) {
  const {data} = current_state.value;
  const order = data.findIndex((item) => item.id === id);
  const item_data = data[order];
  const x = getX(order);
  const y = getY(item_data.value);
  let arrow = select(container.value)
    .select<SVGPathElement>(`#max_arrow_${id}`);
  if (arrow.empty()) {
    arrow = select(container.value)
      .append('path')
      .attr('id', `max_arrow_${id}`);
  }
  arrow
    .attr('d', `M${x + bar_width.value / 2 + 5} ${y - 70} v15 h15 l-20 20 l-20 -20 h15 v-15 h10`)
    .style('fill', '#f1c40f')
    .style('stroke', '#000')
    .style('stroke-width', 2)
    .style('filter', 'drop-shadow(0px 0px 10px rgba(255,255,255,1))')
}
function removeArrow(id: ID){
  const arrow = select(container.value)
    .select<SVGPathElement>(`#max_arrow_${id}`)
  if(!arrow.empty()) {
    arrow.remove();
  }
}
async function updateChart(frame: State<SortItem>) {
  const { data } = frame;
  const colors = getColorMap(frame);
  const rects = select('#sort-bar')
    .selectAll<SVGRectElement, number>('rect')
    .data(data, bindKey)
  const labels = select('#text')
    .selectAll<SVGTextElement, number>('text')
    .data(data, bindKey)
  let transition_bar: Transition<SVGRectElement, SortItem, BaseType,  unknown>, transition_text: Transition<SVGTextElement, SortItem, BaseType, unknown> | null;
  const all_labels = labels.join(
    enter => enter.append('text')
      .attr('x', (d, i) => getX(i))
      .attr('y', widget.height)
      .attr('dy', '-10px')
      .attr('dx', bar_width.value / 2)
      .call(textStyle)
      .text(d => d.label)
      .transition(getDefaultTransition())
      .attr('y', (d) => getY(d.value)),
    update => transition_text = update
      .transition(getDefaultTransition())
      .attr('x', (d, i) => getX(i))
      .attr('y', d => getY(d.value))
      .attr('dy', '-10px')
      .attr('dx', bar_width.value / 2)
      .call(textStyle)
      .text(d => d.label),
    exit => exit.remove()
  )
  const all_rects = rects.join(
    enter => enter
      .append('rect')
      .attr('width', () => bar_width.value)
      .attr('height', (d) => d.value)
      .attr('x', (d, i) => getX(i))
      .attr('y', widget.height)
      .attr('pointer-events', 'all')
      .style('fill', (d) => colors[d.id])
      .style('stroke', svgTheme.stroke_color)
      .style('stroke-width', '1')
      .transition(getDefaultTransition())
      .attr('y', (d) => getY(d.value)),
    update => transition_bar = update
      .transition(getDefaultTransition())
      .attr('x', (d, i) => getX(i))
      .attr('y', d => getY(d.value))
      .attr('width', () => bar_width.value)
      .attr('height', (d) => d.value)
      .attr('pointer-events', 'all')
      .style('fill', (d) => colors[d.id])
      .style('stroke', svgTheme.stroke_color)
      .style('stroke-width', '1'),
    exit => exit.remove()
  )
  bindMouseEffect(all_labels, all_rects);
  await Promise.all([transition_bar!.end(), transition_text!.end()])
}


// 初始化动画
onMounted(() => {
  initChart()
  renderFrame(current_state.value);
})

function getColorMap(state: State<SortItem>) {
  const {
    compared_id, sorted, is_end, max_id
  } = state;
  const colorMap: Record<string, string> = {};
  for (const item of state.data) {
    const { id } = item;
    if (is_end || sorted.has(id)) {
      colorMap[id] = 'orange';
    } else if (max_id === id) {
      colorMap[id] = 'green';
    } else if (compared_id.includes(id)) {
      colorMap[id] = 'red';
    } else {
      colorMap[id] = svgTheme.bar_color;
    }
  }

  return colorMap;
}
async function renderFn(execute_times: number | null) {
  for (let times = 0; execute_times === null || times < execute_times; ++times) {
    // 算法完成
    if (!current_state.value) {
      return;
    }
    // 如果处于暂停状态立即结束过渡
    if (pause.value) {
      return;
    }
    await renderFrame(current_state.value);
    const next_state = getState(cur.value + 1);
    if (next_state && (execute_times === null || times + 1 < execute_times)) {
      setState(cur.value + 1);
    }
  }
}

async function renderFrame(frame: State<SortItem>) {
  await updateChart(frame);
}
/**
 * 渲染可视化动画
 * @param execute_times 执行次数，可以是正整数和0以及null, 如果为null则一直执行
 */
function render(execute_times: number | null) {
  if (execute_times != null && (typeof execute_times !== 'number' || execute_times < 0)) {
    throw new Error('执行次数必须是正整数或者0');
  }
  return renderFn(execute_times);
}


function setState(frame_index: number) {
  cur.value = frame_index;
}

function getState(frame_index: number) {
  return all_state.value[frame_index];
}

// 开始播放动画
async function onStart(execute_times: number | null = null) {
  console.log('on start')
  pause.value = false;
  render(execute_times);
}

// 暂停动画
async function onPause() {
  console.log('on pause')
  pause.value = true;
}

// 重置动画
async function onReset() {
  console.log('on reset')
  setState(0);
  onPause()
  await renderFrame(current_state.value)
}

// 调整动画进度
async function onUpdateProgress(progress: number) {
  console.log('on update', pause.value)
  setState(progress);
  if (pause.value) {
    // 渲染当前帧
    renderFrame(current_state.value);
  }
}
</script>
<template>
  <n-card>
    <svg
      id="container"
      ref="container"
    >
    <!-- 高斯滤镜 -->

    </svg>
    <sort-tool-bar
      :loading="false"
      class="tool-bar"
      :auto-start="false"
      :max="sort_result.step_num - 1"
      :progress="cur"
      @on-start="onStart"
      @on-pause="onPause"
      @on-reset="onReset"
      @update:progress="onUpdateProgress"
      @on-reset-data="resetData"
    />
  </n-card>
</template>