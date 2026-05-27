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

  const events = reactive([
    {
      start: new Date(),
      end: new Date().addHours(1),
      title: 'Event 1'
    },
    {
      start: new Date().addHours(1),
      end: new Date().addHours(2),
      title: 'Event 2'
    },
    {
      start: new Date().addDays(1),
      end: new Date().addDays(1).addHours(1),
      title: 'Event 3'
    }
  ])

</script>

<template>
  <vue-cal v-bind="config" :events="events" @ready="({ view }) => view.scrollToCurrentTime()"/>
</template>

<style scoped>

</style>