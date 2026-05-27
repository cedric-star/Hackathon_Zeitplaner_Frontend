<script setup>
import {provide, ref, onMounted} from "vue";
import DashboardView from "./DashboardView.vue";
import TaskView from "./TaskView.vue";
import CalenderView from "./CalenderView.vue";
import Navbar from "../bars/Navbar.vue";
import Footer from "../bars/Footer.vue";
import { watch, nextTick } from "vue";

const siteState = ref(0);
provide("siteState", siteState);
const props = defineProps({ db: Object });
provide("pglite", props.db);
onMounted(() => {
  const main = document.getElementById("nav-window");
  const test = document.getElementById("dashboard-window");

  if (main) dragElement(main);
  if (test) dragElement(test);
});

function dragElement(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

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

    const footer = document.getElementById("app-footer");
    const footerTop = footer.getBoundingClientRect().top;

    let newTop = elmnt.offsetTop - pos2;
    let newLeft = elmnt.offsetLeft - pos1;

    // untere Grenze = Footer
    const maxTop = footerTop - elmnt.offsetHeight;

    newTop = Math.max(0, Math.min(maxTop, newTop));

    elmnt.style.top = newTop + "px";
    elmnt.style.left = newLeft + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
const showTestContainer = ref(true);
provide("showTestContainer", showTestContainer);
watch(siteState, (newVal) => {
  if (newVal === 0) {
    showTestContainer.value = true;
  }
});
watch(showTestContainer, (val) => {
  if (val) {
    nextTick(() => {
      const test = document.getElementById("dashboard-window");
      if (test) dragElement(test);
    });
  }
});
</script>

<template>
  <div id="main-wrapper">
    <Navbar/>

    <div id="main-container" >
      <div class="aero-window" id="nav-window" >
        <div class="aero-title-bar">
          <span class="aero-title-icon"></span>
          <span class="aero-title-bar-text">Navbar</span>
          <div class="aero-title-bar-controls">
          </div>
        </div>
        <div class="aero-window-body">

          <div id="navbar-container">
            <div class="navbar-item">
              <button class="frutiger-aero-button small" type="button" v-on:click="siteState = 0; console.log(siteState)">Dashboard</button>
            </div>
            <div class="navbar-item">
              <button class="frutiger-aero-button small" type="button" v-on:click="siteState = 1; console.log(siteState)">Aufgaben</button>
            </div>
            <div class="navbar-item">
              <button class="frutiger-aero-button small" v-on:click="siteState = 2; console.log(siteState)">Kalender</button>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div id="dashboard-container" >
      <div class="aero-window" id="dashboard-window" v-if="showTestContainer">
        <div class="aero-title-bar">
          <span class="aero-title-icon"></span>
          <span class="aero-title-bar-text">Dashboard</span>
          <div class="aero-title-bar-controls">
            <button aria-label="Minimize">&#8212;</button>
            <button aria-label="Maximize">&#9633;</button>
            <button aria-label="Close" class="close" @click="showTestContainer = false">&#215;</button>
          </div>
        </div>
        <div class="aero-window-body">

          <DashboardView v-if="siteState === 0"/>

        </div>
      </div>
    </div>
    <Footer id="app-footer"></Footer>
  </div>

</template>

<style>


</style>