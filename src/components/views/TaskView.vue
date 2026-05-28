<script setup>
import { ref, inject, onMounted } from "vue"
import {getTasks, insertTestData} from "../../script/getData.js";

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

  await insertTestData(db)
  await loadTasks()
})

async function loadTasks() {
  tasks.value = await getTasks(currentDb.value);
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
    <button class="glas-button-small" @click="insertTest">Test Insert</button>

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
