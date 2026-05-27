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
</script>

<template>
  <div class="aero-window" id="login-window">
    <div class="aero-title-bar">
      <span class="aero-title-icon"></span>
      <span class="aero-title-bar-text">Login</span>

    </div>
    <div class="aero-window-body" id="login-body">

      hallo welt
    </div>
  </div>
</template>
