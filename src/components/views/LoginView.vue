<script setup>
import { ref } from "vue";
import { getSavedDatabases, createDatabase, openDatabase } from "../../script/dbManager.js";

const emit = defineEmits(['login'])
const savedDbs = ref(getSavedDatabases())
const newUserName = ref("");
const errorMsg = ref("");

async function handleCreate() {
  if (!newUserName.value.trim()) return;
  try {
    const db = await createDatabase(newUserName.value.trim());
    await db.waitReady;
    emit('login', db);          // ← DB direkt mitgeben
  } catch (e) {
    errorMsg.value = "Fehler: " + e.message;
  }
}

async function handleSelect(dbName) {
  try {
    const db = await openDatabase(dbName);
    await db.waitReady;
    emit('login', db);          // ← DB direkt mitgeben
  } catch (e) {
    errorMsg.value = "Fehler: " + e.message;
  }
}
</script>

<template>
  <div class="glas" id="login-window">
    <div class="aero-title-bar">
      <span class="aero-title-bar-text">Login</span>

    </div>
    <div id="login-body">
      <h3>Profil auswählen</h3>
      <button v-for="entry in savedDbs" :key="entry.dbName" @click="handleSelect(entry.dbName)">
        {{ entry.userName }}
      </button>
      <h3>Neu Erstellen</h3>
      <input v-model="newUserName" placeholder="Dein Name" />
      <button @click="handleCreate">Erstellen</button>
      <p v-if="errorMsg" style="color:red">{{ errorMsg }}</p>
      hallo welt
    </div>
  </div>
</template>



<style scoped>


#login-window {
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  width: 75% !important;
  height: 75% !important;
  min-width: 300px;
  min-height: 200px;
  /* Verhindert jegliche Bewegung */
  margin: 0 !important;
  right: auto !important;
  bottom: auto !important;
  /* Optional: Verhindert, dass das Fenster gezogen werden kann */
  user-select: none;
  pointer-events: auto; /* Stellen sicher, dass Buttons noch klickbar sind */
}
</style>