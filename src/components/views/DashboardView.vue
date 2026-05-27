<script setup>

  import {ref} from "vue";
  import DraggableCard from "../DraggableCard.vue";

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
        <DraggableCard>
          Draggisierbar2
          <template v-slot:content>
            <br>MyDinge2</br>
          </template>
        </DraggableCard>
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