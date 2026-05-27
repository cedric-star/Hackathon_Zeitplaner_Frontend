<script setup>
import {markRaw, nextTick, provide, ref} from "vue";
import { getSavedDatabases, createDatabase, openDatabase } from "../../script/dbManager.js";

const showLogin = ref(true);
const savedDbs = ref(getSavedDatabases())
const newUserName = ref("");
const currentDb = ref(null);
const errorMsg = ref("");
provide("pglite", currentDb);



async function handleCreate() {
  if (!newUserName.value.trim()) return
  screen.value = "loading"
  try {
    const db = await createDatabase(newUserName.value.trim())
    await db.waitReady

    currentDb.value = markRaw(db)
    await nextTick()  // ← warten bis Vue den Render abgeschlossen hat
    emit('update:showLogin', false);
  } catch (e) {
    errorMsg.value = "Fehler: " + e.message
    emit('update:showLogin', true);
  }
}

async function handleSelect(dbName) {
  screen.value = "loading"
  try {
    const db = await openDatabase(dbName)
    await db.waitReady
    currentDb.value = markRaw(db)
    await nextTick()  // ← hier auch
    emit('update:showLogin', false);
  } catch (e) {
    errorMsg.value = "Fehler: " + e.message
    emit('update:showLogin', true);
  }
}

const props = defineProps({
  showLogin: Boolean
})
const emit = defineEmits(['update:showLogin'])
const loggedIn = () => {
  emit('update:showLogin', false);
}


</script>

<template>
  <div class="aero-window" id="login-window" v-if="showLogin">
    <div class="aero-title-bar">
      <span class="aero-title-icon"></span>
      <span class="aero-title-bar-text">Login</span>

    </div>
    <div class="aero-window-body" id="login-body">
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