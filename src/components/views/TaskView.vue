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

async function deleteTask(name) {
  const db = currentDb.value;
  if (!db) return;

  try {
    await db.query(`DELETE FROM tasks WHERE name = $1`, [name]);  // ✅ Komma und await
    await loadTasks();  // ✅ Tasks neu laden
    console.log(`Task "${name}" erfolgreich gelöscht`);
  } catch (error) {
    console.error("Fehler beim Löschen:", error);
    // Optional: Fehlermeldung anzeigen
    errors.value.delete = error.message;
  }
}
</script>

<template>

  <div v-if="!currentDb">Keine Datenbankverbindung!</div>
  <div v-else-if="!isReady">Lade Datenbank...</div>
  <div v-else>
    <button class="glas-button-small" v-if="!inserting" @click="inserting = true">Neue Aufgabe</button>
    <div v-else>

      <!-- Name -->
      <div>
        <input class="glas-input" type="text" placeholder="Name *" v-model="newTask.name" />
        <span v-if="errors.name" style="color:red"> {{ errors.name }}</span>
      </div>

      <!-- Beschreibung -->
      <div>
        <textarea class="glas-input" placeholder="Beschreibung *" v-model="newTask.description" />
        <span v-if="errors.description" style="color:red"> {{ errors.description }}</span>
      </div>

      <!-- Priorität -->
      <div>
        <select class="glas-button-small" v-model="newTask.priority">
          <option value="1">1 – Niedrig</option>
          <option value="2">2</option>
          <option value="3">3 – Mittel</option>
          <option value="4">4</option>
          <option value="5">5 – Hoch</option>
        </select>
      </div>

      <!-- Zeiten -->
      <div>
        <label>Start: <input class="glas-input" type="datetime-local" v-model="newTask.start_time" /></label>
        <label>Ende: <input class="glas-input" type="datetime-local" v-model="newTask.end_time" /></label>
      </div>

      <!-- Tags -->
      <div>
        <strong>Tags</strong>
        <div v-for="(tag, i) in newTask.tags" :key="i">
          <input class="glas-input" type="text" placeholder="Tag-Name" v-model="tag.name" />
          <input class="glas-input" type="color" v-model="tag.color" />
          <button @click="removeTag(i)">✕</button>
        </div>
        <button class="glas-button-small" @click="addTag">+ Tag hinzufügen</button>
      </div>

      <!-- Sub-Tasks -->
      <div>
        <strong>Unteraufgaben</strong>
        <div v-for="(sub, i) in newTask.sub_tasks" :key="i">
          <input class="glas-input" type="text" placeholder="Unteraufgabe" v-model="sub.name" />
          <button class="glas-button-small" @click="removeSubTask(i)">✕</button>
        </div>
        <button class="glas-button-small" @click="addSubTask">+ Unteraufgabe hinzufügen</button>
      </div>

      <br />
      <button class="glas-button-small" @click="handleSaveNew">Speichern</button>
      <button class="glas-button-small" @click="inserting = false">Abbrechen</button>
    </div>

    <div v-if="tasks.length">
      <div class="task-list">
        <table>
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Löschen</th>

            </tr>
          </thead>

          <tbody>
            <tr
                v-for="task in tasks"
            >
              <td class="task-name">{{ task.name }}</td>
              <td class="task-row">{{ task.description }}</td>
              <td class="task-priority">{{ task.priority }}</td>
              <td class="task-row " ><button @click="deleteTask(task.name)" class="glas-button-small">Löschen</button></td>


            </tr>
          </tbody>
        </table>

      </div>
    </div>
    <div v-else>
      Keine Tasks vorhanden.
    </div>
  </div>

</template>
