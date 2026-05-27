<script setup>

import {inject} from "vue";

const siteState = inject("siteState");

</script>

<template>
  <div id="navbar-container">
    <div class="navbar-item">
      <button type="button" v-on:click="siteState = 0; console.log(siteState)">Dashboard</button>
    </div>
    <div class="navbar-item">
      <button type="button" v-on:click="siteState = 1; console.log(siteState)">Aufgaben</button>
    </div>
    <div class="navbar-item">
      <button type="button" v-on:click="siteState = 2; console.log(siteState)">Kalender</button>
    </div>
  </div>

</template>

<style scoped>

  #navbar-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 1rem;
    gap: 0.5rem;
  }

</style>