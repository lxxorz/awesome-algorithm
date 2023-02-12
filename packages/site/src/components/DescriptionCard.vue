<template>
  <n-card style="overflow:auto">
    <div class="card">
      选择排序（英语：Selection sort）是一种简单直观的排序算法。它的工作原理是每次找出第 i 小的元素（也就是<span class="desc"></span>中最小的元素），然后将这个元素与数组第 i
      个位置上的元素交换。Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum perferendis tempore ut. Sit, maiores
      culpa? Possimus cumque distinctio vitae nobis necessitatibus. Ratione placeat dolor omnis illo similique,
      voluptatum aliquid optio. Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt quia reiciendis
      obcaecati culpa quaerat doloremque corporis ipsa nobis officia vero qui quo sint sit, suscipit aliquam. Est porro
      facere accusamus! Lorem ipsum, dolor sit amet consectetur adipisicing elit. At, explicabo cum voluptatibus
      consequuntur impedit ipsam minima, delectus est sed accusamus sequi nam laborum exercitationem dolorem ratione
      iste omnis perferendis tempore? Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat mollitia dolorem
      rerum natus repellendus, sunt quibusdam maxime nisi omnis illo in quae dolor, obcaecati enim excepturi est
      incidunt quaerat vero! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut expedita labore beatae?
      Doloribus quia voluptatibus laudantium iusto sint perspiciatis quas, soluta, modi dolor exercitationem unde totam.
      Exercitationem nulla nihil at.
    </div>

  </n-card>
</template>

<script setup lang="ts">
import { NCard } from 'naive-ui';
import { onMounted, nextTick } from 'vue';
import renderMathInElement from "katex"
onMounted(() => {
  nextTick(() => {
    const element: HTMLElement = document.querySelector(".desc")!;
    renderMathInElement.render(String.raw`f(x)=2x^2 `, element, {
      "displayMode": false,
      "output": "mathml"
    })
  })
})
</script>

<style scoped>
.card {
  max-height: 100%;
  font-size: 1.1rem;
  color: #404040;
}
</style>