<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import axios from 'axios'
import Socket from './services/SocketService'

export default {
  name: 'App',

  mounted () {
    axios.post(`${location.protocol}//${location.hostname}` + (!process.env.DEV ? '' : (':' + process.env.SERVER_PORT)) + '/api/socket/port').then(response => {
      const port = response.data.payload.port
      Socket.connect(port)
      window.socket = Socket
    }).catch(e => {
      console.error(e)
    })
  }
}
</script>

<style lang="sass">
@import "./assets/scss/app.scss";
</style>
