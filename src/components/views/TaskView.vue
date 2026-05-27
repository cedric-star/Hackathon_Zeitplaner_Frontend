<script setup>
import { ref, inject, onMounted } from "vue"

const currentDb = inject("pglite")
const tasks = ref([])
const isReady = ref(false)
const name = ref("")

onMounted(async () => {
  //db initialisieren
  const db = currentDb.value
  if (!db) return
  await db.waitReady
  isReady.value = true

  try {
    const result = await db.query(`SELECT * FROM tasks ORDER BY name`)
    tasks.value = result.rows
  } catch (err) {
    console.error("Error loading tasks:", err)
  }
})

async function loadTasks() {
  const db = currentDb.value
  if (!db || !isReady.value) return
  const result = await db.query(`SELECT * FROM tasks ORDER BY name`)
  tasks.value = result.rows
}

async function insertTest() {
  const db = currentDb.value
  if (!db || !isReady.value || !name.value.trim()) return
  await db.query(
      `INSERT INTO tasks (name, description, start_time, end_time, completed_time, priority)
     VALUES ($1, 'Plan...', '2024-01-15 09:00:00+01', '2024-01-15 17:00:00+01', '2024-01-15 17:00:00+01', '2')`,
      [name.value]
  )
  await loadTasks()
  name.value = ""
}
</script>

<template>

  <div v-if="!currentDb">Keine Datenbankverbindung!</div>
  <div v-else-if="!isReady">Lade Datenbank...</div>
  <div v-else>
    <input
        type="text"
        placeholder="Event Name"
        v-model="name"
        @keyup.enter="insertTest"
    />
    <button @click="insertTest">Test Insert</button>

    <div v-if="tasks.length">
      <div v-for="(task, index) in tasks" :key="index">
        {{ task.name }}
      </div>
    </div>
    <div v-else>
      Keine Tasks vorhanden.
    </div>
  </div>

</template>
