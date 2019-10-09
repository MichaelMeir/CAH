// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueCookies from 'vue-cookies'

<<<<<<< HEAD
=======
import axios from 'axios'
import Socket from './services/SocketService'

axios.post(`${location.protocol}//${location.hostname}` + (!process.env.DEV ? '' : (':' + process.env.SERVER_PORT)) + '/api/socket/port').then(response => {
  const port = response.data.payload.port
  Socket.connect(port)
  window.socket = Socket
}).catch(e => {
  console.error(e)
})

>>>>>>> cfbbbe66fa79c8c44a8a00fdf9aa5b9e49a485d2
Vue.use(VueCookies)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
