<script setup>
import {provide, ref, onMounted} from "vue";
import DashboardView from "./DashboardView.vue";
import TaskView from "./TaskView.vue";
import CalenderView from "./CalenderView.vue";
import Navbar from "../bars/Navbar.vue";
import Footer from "../bars/Footer.vue";
import {watch, nextTick} from "vue";
import Window from "../Window.vue";

const showDashboard = ref(false);
const showTasks = ref(false);
const showCalender = ref(false);
function closeDashboard() {
  showDashboard.value = false;
}

function closeTasks() {
  showTasks.value = false;
}

function closeCalender() {
  showCalender.value = false;
}

const footer = ref();

onMounted(() => {
  footer.value = document.getElementById("app-footer");
})

</script>

<template>
  <div id="main-wrapper">
    <Navbar/>
    <Window :title="'Navbar'" :footer="footer" :show-close="false" :window-window="'navbar-container'" :window-container="'main-container'">
      <div class="navbar-items">
        <div class="navbar-item">
          <button class="glas-button" type="button"
                  v-on:click="showDashboard = true; console.log(siteState)">Dashboard
          </button>
        </div>
        <div class="navbar-item">
          <button class="glas-button" type="button"
                  v-on:click="showTasks = true; console.log(siteState)">Aufgaben
          </button>
        </div>
        <div class="navbar-item">
          <button class="glas-button" v-on:click="showCalender = true; console.log(siteState)">Kalender
          </button>
        </div>
      </div>
    </Window>

    <Window
        v-if="showTasks"
        :title="'Tasks'"
        :footer="footer"
        :show-close="true"
        :window-window="'dashboard-window'"
        :window-container="'dashboard-container'"
        @close="closeTasks"
    >
      <TaskView/>
    </Window>

    <Window
        v-if="showDashboard"
        :title="'Dashboard'"
        :footer="footer"
        :show-close="true"
        :window-window="'aufgaben-window'"
        :window-container="'aufgaben-container'"
        @close="closeDashboard"
    >
      <DashboardView/>
    </Window>

    <Window
        v-if="showCalender"
        :title="'Kalender'"
        :footer="footer"
        :show-close="true"
        @close="closeCalender"
    >
      <CalenderView/>
    </Window>

    <Footer id="app-footer"></Footer>
  </div>
</template>

<style>


</style>