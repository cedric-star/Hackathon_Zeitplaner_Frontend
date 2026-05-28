<script setup lang="ts">

import {onMounted, ref} from 'vue';

const props = defineProps({
  title: String,
  footer: Element,
})

onMounted(() => {
  const win = document.getElementById("window-wrapper");

  if (win) dragElement(win);
});

function dragElement(element) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  const header = element.querySelector(".aero-title-bar");

  if (header) {
    header.onmousedown = dragMouseDown;
  } else {
    element.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e.preventDefault();

    pos3 = e.clientX;
    pos4 = e.clientY;

    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();

    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;

    pos3 = e.clientX;
    pos4 = e.clientY;

    const footer = props.footer;
    const footerTop = footer.getBoundingClientRect().top;

    let newTop = element.offsetTop - pos2;
    let newLeft = element.offsetLeft - pos1;

    const maxTop = footerTop - element.offsetHeight;

    newTop = Math.max(0, Math.min(maxTop, newTop));

    element.style.top = newTop + "px";
    element.style.left = newLeft + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

const showWindow = ref(true);
console.log(showWindow.value)

</script>

<template>
  <div class="dashboard-container" id="dashboard-container" v-if="showWindow === true">
    <div class="glas" id="window-wrapper">
      <div class="aero-title-bar">
        <span class="aero-title-bar-text">{{props.title}}</span>
        <button aria-label="Close" class="close" @click="showWindow = false">&#215;</button>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>

</style>