<template>
  <div id="app">
    <Navbar ref="navbar" />
    <Toast ref="toast" />
    <router-view />
  </div>
</template>

<script>
import Navbar from './components/Navbar'
import Toast from './components/Toast'
export default {
  name: 'App',
  components: {
    Navbar,
    Toast
  },

  data () {
    return {
      googleKey: process.env.GOOGLE_RECAPTCHA
    }
  }
}
</script>

<style lang="sass">
@import "./assets/scss/app.scss";
</style>
