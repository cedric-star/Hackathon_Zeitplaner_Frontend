<script setup>
import { ref, markRaw } from "vue";
import MainView from "./components/views/MainView.vue";
import LoginView from "./components/views/LoginView.vue";

const showLogin = ref(true);
const currentDb = ref(null);

function handleLogin(db) {
  currentDb.value = markRaw(db);
  showLogin.value = false;
}
</script>

<template>
  <LoginView v-if="showLogin" @login="handleLogin" />
  <MainView v-if="!showLogin" :db="currentDb" />
</template>