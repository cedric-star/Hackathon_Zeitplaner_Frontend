<script setup>
import {provide, ref, onMounted} from "vue";
import DashboardView from "./DashboardView.vue";
import TaskView from "./TaskView.vue";
import CalenderView from "./CalenderView.vue";
import Navbar from "../bars/Navbar.vue";
import Footer from "../bars/Footer.vue";
import {watch, nextTick} from "vue";
import Window from "../Window.vue";

const siteState = ref(0);
provide("siteState", siteState);

const footer = ref();

onMounted(() => {
  footer.value = document.getElementById("app-footer");
})

</script>

<template>
  <div id="main-wrapper">
    <Navbar/>
    <Window :title="'Navbar'" :footer="footer">
      <div class="navbar-item">
        <button class="glas-button" type="button"
                v-on:click="siteState = 0; console.log(siteState)">Dashboard
        </button>
      </div>
      <div class="navbar-item">
        <button class="glas-button" type="button"
                v-on:click="siteState = 1; console.log(siteState)">Aufgaben
        </button>
      </div>
      <div class="navbar-item">
        <button class="glas-button" v-on:click="siteState = 2; console.log(siteState)">Kalender
        </button>
      </div>
    </Window>

    <Window :title="'Tasks'" :footer="footer" v-if="siteState === 1">
      <TaskView/>
    </Window>

    <Window :title="'Dashboard'" :footer="footer" v-if="siteState === 0">
      <DashboardView/>
    </Window>

    <Window :title="Kalender" :footer="footer" v-if="siteState === 2">
      <CalenderView/>
    </Window>

    <Footer id="app-footer"></Footer>
  </div>
</template>

<style>


</style>