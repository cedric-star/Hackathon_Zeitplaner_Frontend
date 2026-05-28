<script setup>

import { VueCal, addDatePrototypes } from 'vue-cal'
import 'vue-cal/style'
import {inject, onBeforeMount, reactive, ref} from "vue";
import {getTasks} from "../../script/getData.js";

addDatePrototypes();

const config = {
  hideWeekends: false,
  time: true,
  dark: true,
  editable: false,
}

const currentDb = inject("pglite");
let events = ref([]);
let tasks = ref([]);

function task2Event(task) {
  return {
    id: task.id,
    start: new Date(task.start_time),
    end: new Date(task.end_time),
    title: task.name,
  }
}

onBeforeMount(async () => {
  const db = currentDb.value
  if (!db) return
  await db.waitReady
  tasks.value = await getTasks(currentDb.value);

  events.value = tasks.value
      .filter(task => task.start_time && task.end_time)
      .map(task => task2Event(task));
})
</script>

<template>
  <vue-cal v-bind="config" :events="events" @ready="({ view }) => view.scrollToCurrentTime()"/>
</template>

<style scoped>

:deep(.vuecal) {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(8px);

  border-radius: 12px;

  color: white;

  border: 1px solid rgba(255,255,255,0.1);

  overflow: hidden;
}

/* Header */
:deep(.vuecal__title-bar) {
  background: rgba(255,255,255,0.1);

  backdrop-filter: blur(6px);

  color: white;

  border-bottom: 1px solid rgba(255,255,255,0.08);
}

/* Tageszellen */
:deep(.vuecal__cell) {
  background: rgba(255,255,255,0.03);

  border: 1px solid rgba(255,255,255,0.04);

  transition: 0.2s;
}

/* Hover */
:deep(.vuecal__cell:hover) {
  background: rgba(255,255,255,0.12);
}

/* Events */
:deep(.vuecal__event) {
  background: rgba(80,120,255,0.5);

  border: none;

  border-radius: 8px;

  backdrop-filter: blur(4px);

  color: white;
}

/* Uhrzeiten links */
:deep(.vuecal__time-column) {
  background: rgba(0,0,0,0.15);
}

/* Heute */
:deep(.vuecal__cell--today) {
  background: rgba(80,120,255,0.18);
}

</style>