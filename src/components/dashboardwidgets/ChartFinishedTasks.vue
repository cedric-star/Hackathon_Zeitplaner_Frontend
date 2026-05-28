<script setup lang="ts">

import {inject, onMounted, ref} from "vue";

const currentDb = inject("pglite")
const tasks = ref([])

onMounted(async () => {
  const db = currentDb.value
  if (!db) return
  await db.waitReady
  isReady.value = true

  try {
    const result = await db.query(`SELECT COUNT(*) AS amount, DATE(completed_time) AS completed_day, FROM tasks GROUP BY completed_day ORDER BY name`)
    tasks.value = result.rows
  } catch (err) {
    console.error("Error loading tasks:", err)
  }

  const data = ref([]);
  const labels = ref([]);

  tasks.value.forEach((task) => { data.value.push(task.amount) })
  tasks.value.forEach((task) => { labels.value.push(task.completed_day) })
  const title = "Aufgaben pro Tag erledigt"

  createLineChart(title, labels, data, document.getElementById('myChart'));

})

</script>

<template>
  <canvas id="myChart"></canvas>
</template>

<style scoped>

</style>