<script setup>

import {onMounted, ref} from "vue";
  import DraggableCard from "../DraggableCard.vue";
  import {Chart, registerables} from "chart.js";
import {createLineChart, createPieChart} from "../../script/chartPresets.js";
import ChartFinishedTasks from "../dashboardwidgets/ChartFinishedTasks.vue";
import PiePriorities from "../dashboardwidgets/PiePriorities.vue";
  Chart.register(...registerables);

  function dragstartHandler(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }

  function dragoverHandler(ev) {
    ev.preventDefault();
  }

  function dropHandler(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
  }

</script>

<template>
  <div id="big-wrapper">
    <div id="droppable-zone-left" v-on:drop="dropHandler" v-on:dragover="dragoverHandler">
    </div>
    <div id="droppable-zone-right" v-on:drop="dropHandler" v-on:dragover="dragoverHandler">
      <div id="dragbar2" draggable="true" v-on:dragstart="dragstartHandler">
        <ChartFinishedTasks/>
      </div>
      <div id="dragbar3" draggable="true" v-on:dragstart="dragstartHandler">
        <PiePriorities/>
      </div>
    </div>
  </div>
</template>

<style scoped>
  #big-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    min-height: 50vh;
  }

  #droppable-zone-left, #droppable-zone-right {
    width: 100%;
    border: 2px solid;
    border-color: rgb(252 253 253 / 0.14);
    border-radius: 5px;
  }
</style>