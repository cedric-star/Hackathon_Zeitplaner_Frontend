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

  await db.live.query(
      `SELECT * FROM tasks WHERE start_time IS NOT NULL AND end_time IS NOT NULL`,
      [],
      (results) => {
        events.value = results.rows.map(task => task2Event(task));
      }
  );
})
</script>

<template>
  <vue-cal v-bind="config" :events="events" @ready="({ view }) => view.scrollToCurrentTime()"/>
</template>

<style scoped>

</style>