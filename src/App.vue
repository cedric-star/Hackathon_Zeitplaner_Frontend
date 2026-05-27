<script>
import MainView from "./components/views/MainView.vue"
import LoginView from "./components/views/LoginView.vue";
import {defineComponent} from "vue";

export default defineComponent({
  components: {MainView, LoginView},
  data() {
    return {
      showLogin: true
    }
  }
})

</script>

<template>
  <LoginView v-model="showLogin"/>
  <MainView v-if="!showLogin"/>
</template>