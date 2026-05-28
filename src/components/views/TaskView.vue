<script setup>
import { ref, inject, onMounted } from "vue"
import { getTasks, insertTask, insertTestData } from "../../script/getData.js"

const currentDb = inject("pglite")
const tasks = ref([])
const isReady = ref(false)
const inserting = ref(false)
const errors = ref({})

const newTask = ref({
  name: "",
  description: "",
  priority: "1",
  start_time: "",
  end_time: "",
  completed_time: null,
  tags: [],
  sub_tasks: []
})

onMounted(async () => {
  const db = currentDb.value
  if (!db) return
  await db.waitReady
  isReady.value = true
  await loadTasks()
})

async function loadTasks() {
  tasks.value = await getTasks(currentDb.value)
}

async function handleSaveNew() {
  errors.value = {}
  const payload = {
    ...newTask.value
  }
  const result = await insertTask(currentDb.value, payload)
  if (result?.errors) {
    errors.value = result.errors
    return
  }
  newTask.value = { name: "", description: "", priority: "1", start_time: "", end_time: "", completed_time: null, tags: [], sub_tasks: [] }
  inserting.value = false
  await loadTasks()
}

function addTag() {
  newTask.value.tags.push({ name: "", color: "#000000" })
}
function removeTag(index) {
  newTask.value.tags.splice(index, 1)
}

function addSubTask() {
  newTask.value.sub_tasks.push({ name: "" })
}
function removeSubTask(index) {
  newTask.value.sub_tasks.splice(index, 1)
}
</script>

<template>

  <div v-if="!currentDb">Keine Datenbankverbindung!</div>
  <div v-else-if="!isReady">Lade Datenbank...</div>
  <div v-else>
    <button v-if="!inserting" @click="inserting = true">Neue Aufgabe</button>
    <div v-else>

      <!-- Name -->
      <div>
        <input type="text" placeholder="Name *" v-model="newTask.name" />
        <span v-if="errors.name" style="color:red"> {{ errors.name }}</span>
      </div>

      <!-- Beschreibung -->
      <div>
        <textarea placeholder="Beschreibung *" v-model="newTask.description" />
        <span v-if="errors.description" style="color:red"> {{ errors.description }}</span>
      </div>

      <!-- Priorität -->
      <div>
        <select v-model="newTask.priority">
          <option value="1">1 – Niedrig</option>
          <option value="2">2</option>
          <option value="3">3 – Mittel</option>
          <option value="4">4</option>
          <option value="5">5 – Hoch</option>
        </select>
      </div>

      <!-- Zeiten -->
      <div>
        <label>Start: <input type="datetime-local" v-model="newTask.start_time" /></label>
        <label>Ende: <input type="datetime-local" v-model="newTask.end_time" /></label>
      </div>

      <!-- Tags -->
      <div>
        <strong>Tags</strong>
        <div v-for="(tag, i) in newTask.tags" :key="i">
          <input type="text" placeholder="Tag-Name" v-model="tag.name" />
          <input type="color" v-model="tag.color" />
          <button @click="removeTag(i)">✕</button>
        </div>
        <button @click="addTag">+ Tag hinzufügen</button>
      </div>

      <!-- Sub-Tasks -->
      <div>
        <strong>Unteraufgaben</strong>
        <div v-for="(sub, i) in newTask.sub_tasks" :key="i">
          <input type="text" placeholder="Unteraufgabe" v-model="sub.name" />
          <button @click="removeSubTask(i)">✕</button>
        </div>
        <button @click="addSubTask">+ Unteraufgabe hinzufügen</button>
      </div>

      <br />
      <button @click="handleSaveNew">Speichern</button>
      <button @click="inserting = false">Abbrechen</button>
    </div>

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
