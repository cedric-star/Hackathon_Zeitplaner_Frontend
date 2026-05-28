<script setup>
import {ref, provide, markRaw, nextTick, onMounted} from "vue";
import MainView from "./components/views/MainView.vue";
import LoginView from "./components/views/LoginView.vue";
import Window from "./components/Window.vue";
import Footer from "./components/bars/Footer.vue";
import {Chart} from "chart.js";

const showLogin = ref(true);
const currentDb = ref(null);
provide("pglite", currentDb);   // ← einmal hier, fertig

async function handleLogin(db) {
  currentDb.value = markRaw(db);
  await nextTick();
  showLogin.value = false;
}

Chart.defaults.backgroundColor = '#9BD0F5';
Chart.defaults.borderColor = '#ddeff4';
Chart.defaults.color = '#ffffff';

</script>

<template>
  <LoginView v-if="showLogin" @login="handleLogin" />
  <MainView v-else />
</template>