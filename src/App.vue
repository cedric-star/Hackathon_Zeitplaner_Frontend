<script setup>
import {provide, ref} from "vue";
import DashboardView from "./components/views/DashboardView.vue";
import TaskView from "./components/views/TaskView.vue";
import CalenderView from "./components/views/CalenderView.vue";
import Navbar from "./components/bars/Navbar.vue";
import Footer from "./components/bars/Footer.vue";

const siteState = ref(0);
provide('siteState', siteState);

</script>

<template>
  <div id="main-wrapper">
    <Navbar/>
    <div id="main-container">
      <DashboardView v-if="siteState === 0"/>
      <TaskView v-if="siteState === 1"/>
      <CalenderView v-if="siteState === 2"/>
    </div>
    <Footer/>
  </div>
</template>

<style>

#main-container {
  display: flex;
  flex-direction: column;
}

#main-wrapper {
}

</style>
