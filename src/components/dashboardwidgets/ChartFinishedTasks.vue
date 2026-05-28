<script setup lang="ts">

import {inject, onMounted, ref} from "vue";
import {createLineChart, createPieChart} from "../../script/chartPresets.js";

const currentDb = inject("pglite")
const tasks = ref([])
const isReady = ref(false)

onMounted(async () => {
  const db = currentDb.value
  if (!db) return
  await db.waitReady
  isReady.value = true

  try {
    const result = await db.query(`SELECT COUNT(*) AS amount, DATE(completed_time) AS completed_day FROM tasks WHERE completed_time IS NOT NULL GROUP BY completed_day ORDER BY completed_day`)
    tasks.value = result.rows
    console.log(tasks.value)
  } catch (err) {
    console.error("Error loading tasks:", err)
  }

  const data = ref([]);
  const labels = ref([]);

  tasks.value.forEach((task) => { data.value.push(task.amount) })
  tasks.value.forEach((task) => { labels.value.push(timestampToDMY(task.completed_day)) })
  const title = "Aufgaben pro Tag erledigt"

  createLineChart(title, labels.value, data.value, document.getElementById('myChart'));

})

function timestampToDMY(timestamp) {
  return timestamp.getDate() + "." + (timestamp.getMonth() + 1) + "." + timestamp.getFullYear();
}

</script>

<template>
  <canvas id="myChart"></canvas>
</template>

<style scoped>

</style>