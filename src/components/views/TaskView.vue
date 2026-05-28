<script setup>
import { ref, inject, onMounted } from "vue"
import { getTasks, insertTask, updateTask } from "../../script/getData.js"
import TaskForm from "../TaskForm.vue"
import {color} from "chart.js/helpers";

const currentDb = inject("pglite")
const tasks = ref([])
const isReady = ref(false)
const inserting = ref(false)
const errors = ref({})

const emptyTask = () => ({
  name: "",
  description: "",
  priority: "1",
  start_time: "",
  end_time: "",
  completed_time: null,
  tags: [],
  sub_tasks: []
})

const newTask = ref(emptyTask())

// Tracks which task row is expanded for editing (by name or id)
const editingTask = ref(null)   // stores the task name/id being edited
const editData = ref({})        // stores the live form data for the edited task

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

// ── Insert ──────────────────────────────────────────────
async function handleSaveNew(payload) {
  errors.value = {}
  const result = await insertTask(currentDb.value, payload)
  if (result?.errors) {
    errors.value = result.errors
    return
  }
  newTask.value = emptyTask()
  inserting.value = false
  await loadTasks()
}

// ── Edit / Update ────────────────────────────────────────
function openEdit(task) {
  // Toggle: clicking the same row again closes it
  if (editingTask.value === task.name) {
    editingTask.value = null
    return
  }
  editingTask.value = task.name
  // Deep-copy so the form doesn't mutate the table directly
  editData.value = JSON.parse(JSON.stringify(task))
}

function cancelEdit() {
  editingTask.value = null
}

async function handleUpdate(payload) {
  errors.value = {}
  // updateTask should accept the full payload and identify the row by name/id
  const result = await updateTask(currentDb.value, payload)
  if (result?.errors) {
    errors.value = result.errors
    return
  }
  editingTask.value = null
  await loadTasks()
}

// ── Delete ───────────────────────────────────────────────
async function deleteTask(name) {
  const db = currentDb.value
  if (!db) return
  try {
    await db.query(`DELETE FROM tasks WHERE name = $1`, [name])
    if (editingTask.value === name) editingTask.value = null
    await loadTasks()
  } catch (error) {
    console.error("Fehler beim Löschen:", error)
    errors.value.delete = error.message
  }
}

function hexToRgba(hex, alpha = 0.2) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
</script>

<template>
  <div v-if="!currentDb">Keine Datenbankverbindung!</div>
  <div v-else-if="!isReady">Lade Datenbank...</div>
  <div v-else>

    <!-- ── Neue Aufgabe ── -->
    <button class="glas-button-small" v-if="!inserting" @click="inserting = true">
      Neue Aufgabe
    </button>

    <div v-else>
      <TaskForm
          v-model="newTask"
          :errors="errors"
          :is-edit="false"
          submit-label="Erstellen"
          @submit="handleSaveNew"
          @cancel="inserting = false; errors = {}"
      />
    </div>

    <!-- ── Task-Tabelle ── -->
    <div v-if="tasks.length" class="task-list">
      <table>
        <thead>
        <tr>
          <th></th>
          <th>Task Name</th>
          <th>Beschreibung</th>
          <th>Priorität</th>
          <th>Tags</th>
          <th>Löschen</th>
        </tr>
        </thead>

        <tbody>
        <template v-for="task in tasks" :key="task.name">

          <!-- Normale Zeile -->
          <tr>
            <td>
              <button
                  class="glas-button-small"
                  :title="editingTask === task.name ? 'Schließen' : 'Bearbeiten'"
                  @click="openEdit(task)"
              >
                {{ editingTask === task.name ? '▲' : '▼' }}
              </button>
            </td>
            <td class="task-name">{{ task.name }}</td>
            <td class="task-row">{{ task.description }}</td>
            <td class="task-priority">{{ task.priority }}</td>
            <td class="task-row">
              <p v-for="tag in task.tags" :style="{ backgroundColor: hexToRgba(tag.color, 0.2), color: tag.color, padding: '4px', borderRadius: '8px' }">{{ tag.name }}</p>            </td>
            <td class="task-row">
              <button class="glas-button-small" @click="deleteTask(task.name)">
                Löschen
              </button>
            </td>
          </tr>

          <!-- Ausklappbares Edit-Fenster -->
          <tr v-if="editingTask === task.name" class="edit-row">
            <td colspan="5">
              <div class="edit-panel">
                <TaskForm
                    v-model="editData"
                    :errors="errors"
                    :isEdit="true"
                    submit-label="Aktualisieren"
                    @submit="handleUpdate"
                    @cancel="cancelEdit"
                />
              </div>
            </td>
          </tr>

        </template>
        </tbody>
      </table>
    </div>

    <div v-else>
      Keine Tasks vorhanden.
    </div>
  </div>
</template>

<style scoped>
.edit-row td {
  padding: 0;
}

.edit-panel {
  padding: 0.75rem 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.04);
  border-radius: 0 0 8px 8px;
}
</style>