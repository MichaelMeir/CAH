<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',

  async beforeMount () {
    if (!document.cookie.includes('jwt=')) return

    try {
      let check = await axios.post(`${location.protocol}//${location.hostname}:` + process.env.SERVER_PORT + '/api/auth/check', [], {
        withCredentials: true
      })

      if (!check.data.failure && check.status === 200) this.authenticated = true
    } catch (err) {
      console.error(err)
    }
  },

  data () {
    return {
      authenticated: false
    }
  }
}
</script>

<style lang="sass">
@import "./assets/scss/app.scss";
</style>
