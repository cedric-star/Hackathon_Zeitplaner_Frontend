<script setup>

import {inject, onBeforeMount, onMounted, ref} from "vue";
import {createLineChart, createPieChart} from "../../script/chartPresets.js";
import {getTasks} from "../../script/getData.js";

const currentDb = inject("pglite")
const tasks = ref([])
const isReady = ref(false)
const data = ref([]);
const labels = ref([]);
let myChart = null;

onMounted(async () => {
  const db = currentDb.value
  if (!db) return
  await db.waitReady
  tasks.value = await getTasks(currentDb.value);

  await db.live.query(`
      SELECT COUNT(*) AS amount, priority
      FROM tasks
      GROUP BY priority ORDER BY priority
      `, [], (results) => {
    tasks.value = results.rows;
    data.value = tasks.value.map(task => task.amount);
    labels.value = tasks.value.map(task => task.priority);
    const title = "Aufteilung deiner Prioritäten"
    if(myChart) myChart.destroy()
    myChart = createPieChart(title, labels.value, data.value, document.getElementById('prioPie'));
  })
})

</script>

<template>
  <canvas id="prioPie"></canvas>
</template>

<style scoped>

</style>