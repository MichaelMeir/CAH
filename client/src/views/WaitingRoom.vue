<template>
  <div>
    <navbar />
    <div class="max-w-4xl mx-auto mt-1 flex">
      <div class="bg-indigo-700 text-black my-5 rounded w-2/3 pb-1 overflow-y-auto mr-3">
        <div class="bg-white text-black h-56 m-2 rounded">
          <p v-bind:key="index" v-for="(message, index) in messages">{{ message }}</p>
        </div>

        <div class="flex">
          <input
            v-on:keyup.enter="sendMessage"
            v-model="message"
            class="ml-2 mt-1 mb-1 p-1 w-4/5 rounded"
            type="text"
            placeholder="Say..."
          >
          <button v-on:click="sendMessage" class="bg-indigo-200 hover:bg-indigo-300 mr-2 ml-2 my-1 border border-indigo-800 text-indigo-500 w-1/5 px-6 py-1 rounded ">Send</button>
        </div>

      </div>
      <div class="bg-indigo-700 text-white my-5 rounded w-1/3 pb-1 overflow-y-auto">
        <ul
          class=""
          style="height: 14rem"
        >
          <p class="text-center pt-1">Playerlist</p>
          <div class="text-white ">
            <li
              v-bind:key="index"
              v-for="(user, index) in usernames"
              class="bg-indigo-700 m-2 rounded"
            >
              <p class="mx-2">{{ user }}</p>
            </li>
          </div>
        </ul>
      </div>
    </div>
    <div class="max-w-4xl mx-auto mt-1 flex">
      <div class="flex-1">
        <button @click="leaveRoom" class="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 mr-2 rounded">Leave</button>
        <button class="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded">Cardpacks</button>
      </div>
      <div class="bg-indigo-700 text-white rounded w-1/3 pb-1">
        <ul
          class=""
          style="height: 14rem"
        >
          <p class="text-center pt-1">Settings</p>
          <div class="text-white ">
          </div>
        </ul>
      </div>
    </div>
    <div class="max-w-4xl mx-auto mt-1 flex">
      <div class="w-full flex-1 flex justify-end">
        <button class="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-12 mr-2 rounded ml-auto mr-20 mt-2">Start</button>
      </div>
    </div>
  </div>
</template>
<script>
import Navbar from '../components/Navbar'

export default {
  components: {
    Navbar
  },

  data () {
    return {
      usernames: [],
      message: '',
      messages: [],
      methods: {}
    }
  },

  methods: {
    sendMessage () {
      const methods = window.socket.import([
        'sendMessage'
      ])
      methods.sendMessage(this.$cookies.get('jwt'), this.message)
      this.message = ''
    },

    updateUserList (socket, list) {
      this.usernames = list
      return true
    },

    addMessage (socket, message) {
      this.messages.push(message)
    },

    async leaveRoom (socket, payload) {
      this.$router.push('/')
    }
  },

  async mounted () {
    this.methods = window.socket.import([
      'checkRoom',
      'sendMessage'
    ])

    window.socket.export({
      addMessage: this.addMessage,
      updateUserList: this.updateUserList,
      leaveRoom: this.leaveRoom
    })

    const response = await this.methods.checkRoom(this.$route.params.token)
    if (!response.room) {
      this.$router.push('/')
    }
  }
}
// $cookies.get("jwt")
</script>
