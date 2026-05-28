<script setup>

import {onMounted, ref} from "vue";
  import DraggableCard from "../DraggableCard.vue";
  import {Chart, registerables} from "chart.js";
import {createLineChart, createPieChart} from "../../script/chartPresets.js";
import ChartFinishedTasks from "../dashboardwidgets/ChartFinishedTasks.vue";
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

  onMounted(() => {

    const data = [12, 19, 3, 5, 2, 3];
    const labels = ["Mo","Di","Mi","Do","Fr","Sa"];
    const title = "Aufgaben pro Tag erledigt"

    createLineChart(title, labels, data, document.getElementById('myChart'));
    createPieChart(title, labels, data, document.getElementById('myChart2'));

  })

</script>

<template>
  <div id="big-wrapper">
    <div id="droppable-zone-left" v-on:drop="dropHandler" v-on:dragover="dragoverHandler">
      <div id="dragbar" draggable="true" v-on:dragstart="dragstartHandler">
        <DraggableCard>
          Draggisierbar
          <template v-slot:content>
            <br>MyDinge</br>
          </template>
        </DraggableCard>
      </div>
    </div>
    <div id="droppable-zone-right" v-on:drop="dropHandler" v-on:dragover="dragoverHandler">
      <div id="dragbar2" draggable="true" v-on:dragstart="dragstartHandler">
        <ChartFinishedTasks/>
      </div>
      <div id="dragbar3" draggable="true" v-on:dragstart="dragstartHandler">
        <canvas id="myChart2"></canvas>
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
    width: 45%;
    border: #1f2028 2px solid;
    border-radius: 5px;
  }
</style>