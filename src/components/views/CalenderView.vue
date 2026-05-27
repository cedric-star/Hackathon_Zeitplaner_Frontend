<script setup>

  import { VueCal, addDatePrototypes } from 'vue-cal'
  import 'vue-cal/style'
  import {reactive} from "vue";

  addDatePrototypes();

  const config = {
    hideWeekends: false,
    time: true,
    dark: true,
  }

  function transformTaskToEvent(task) {
    return reactive({
      start: new Date(task.start),
      end: new Date(task.end),
      title: task.title,
    })
  }

  let events = [];
  let tasks = [];

  tasks.forEach(task => { events.push( transformTaskToEvent(task) ); });

</script>

<template>
  <vue-cal v-bind="config" :events="events" @ready="({ view }) => view.scrollToCurrentTime()"/>
</template>

<style scoped>

</style>