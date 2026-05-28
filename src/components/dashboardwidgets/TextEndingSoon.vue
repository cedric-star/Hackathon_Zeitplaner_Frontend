<script setup lang="ts">

import {inject, onBeforeMount, onMounted, ref} from "vue";
import {getTasks} from "../../script/getData.js";

const currentDb = inject("pglite")
const tasks = ref([])
const names = ref([]);
const endDates = ref([]);
let myChart = null;

onMounted(async () => {
  const db = currentDb.value
  if (!db) return
  await db.waitReady
  tasks.value = await getTasks(currentDb.value);

  await db.live.query(`
    SELECT TOP 5 name, end_time
    FROM tasks WHERE end_time IS NOT NULL AND end_time > current_time
    ORDER BY end_time
  `, [], (results) => {
    tasks.value = results.rows;
    names.value = tasks.value.map(task => task.name);
    endDates.value = tasks.value.map(task => timestampToDMY(task.end_time));
    const title = "Anstehende Deadlines"
  })
})

function timestampToDMY(timestamp) {
  return timestamp.getDate() + "." + (timestamp.getMonth() + 1) + "." + timestamp.getFullYear();
}

</script>

<template>
  <div id="text-header">
    Aufgaben enden bald:
  </div>
  <div id="task-list">
    <div class="task" v-for="task in tasks">
      <p class="name">{{ task.name }} {{ task.end_date }}</p>
    </div>
  </div>
</template>

<style scoped>
  #text-header {
    font-weight: bold;
  }
  .task {
    font-size: 11pt;
  }
</style>