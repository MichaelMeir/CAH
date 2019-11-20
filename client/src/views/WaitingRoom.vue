<template>
  <div>
    <transition name="fade">
      <div v-if="leaveModal">
        <div class="fixed z-20 left-0 top-0 bg-black opacity-75 h-full w-full"></div>
        <div class="fixed left-0 right-0 top-0 z-50">
          <div class="p-5 mt-20">
            <div class="h-full flex justify-center items-center relative">
              <div class="w-1/3 bg-white p-10 pb-4 rounded shadow">
                <div
                  @click="leaveModal = false"
                  class="flex flex-1 justify-end -m-5"
                >
                  <svg
                    data-v-a1fbe5b4=""
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 cursor-pointer"
                  >
                    <path
                      data-v-a1fbe5b4=""
                      d="M10 8.586L2.929 1.515 1.515 2.929 8.585 10l-7.07 7.071 1.414 1.414L10 11.415l7.071 7.07 1.414-1.414L11.415 10l7.07-7.071-1.414-1.414L10 8.585z"
                      fill-rule="evenodd"
                      class="close"
                    ></path>
                  </svg>
                </div>
                <h1 class="mt-6 text-3xl">Are you sure you want to leave?</h1>
                <p class="font-thin">
                  You are about to leave your room. If you leave you will lose
                  all your points
                </p>
                <div class="flex border-t mt-4">
                  <div class="flex flex-1 justify-end mt-4">
                    <button
                      class="text-sm bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none transition mr-4"
                      @click="leaveRoom"
                    >
                      Yes
                    </button>
                    <button
                      class="text-sm bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none transition"
                      @click="leaveModal = false"
                    >
                      No take me back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div class="max-w-4xl mx-auto mt-1 flex">
      <div class="bg-indigo-700 text-black my-5 rounded w-2/3 pb-1 overflow-y-auto mr-3">
        <div class="bg-white text-black h-56 m-2 rounded">
          <p
            v-bind:key="index"
            v-for="(message, index) in messages"
          >
            {{ message }}
          </p>
        </div>

        <div class="flex">
          <input
            v-on:keyup.enter="sendMessage"
            v-model="message"
            class="ml-2 mt-1 mb-1 p-1 w-4/5 rounded"
            type="text"
            placeholder="Say..."
          />
          <button
            v-on:click="sendMessage"
            class="bg-indigo-200 hover:bg-indigo-300 mr-2 ml-2 my-1 border border-indigo-800 text-indigo-500 w-1/5 px-6 py-1 rounded "
          >
            Send
          </button>
        </div>
      </div>
      <div class="bg-indigo-700 text-white my-5 rounded w-1/3 pb-1 overflow-y-auto">
        <ul
          class=""
          style="height: 14rem"
        >
          <p class="text-center pt-1">Playerlist</p>
          <div class="text-white">
            <li
              v-bind:key="index"
              v-for="(user, index) in usernames"
              class="bg-indigo-700 m-2 rounded"
            >
              <div>
                <Interface :user="user" />
              </div>
            </li>
          </div>
        </ul>
      </div>
    </div>
    <div class="max-w-4xl mx-auto mt-1 flex">
      <div class="flex-1">
        <button
          @click="leaveModal = true"
          class="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 mr-2 rounded"
        >
          Leave
        </button>
        <button class="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded">
          Cardpacks
        </button>
      </div>
      <div class="bg-indigo-700 text-white rounded w-1/3 pb-1">
        <ul
          class=""
          style="height: 14rem"
        >
          <p class="text-center pt-1">Settings</p>
          <div class="text-white"></div>
        </ul>
      </div>
    </div>
    <div class="max-w-4xl mx-auto mt-1 flex">
      <div class="w-full flex-1 flex justify-end">
        <a class="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-12 mr-2 rounded ml-auto mr-20 mt-2">Start</a>
      </div>
    </div>
  </div>
</template>
<script>
import Interface from '../components/Interface'

export default {
  components: {
    Interface
  },

  data () {
    return {
      usernames: [],
      leaveModal: false,
      message: '',
      messages: [],
      methods: {},
      redirected: false,
      visible: false
    }
  },

  methods: {
    openInterface () {
      this.visible = true
    },

    closeInterface () {
      this.visible = false
    },

    onredirect () {
      this.redirected = true
    },

    sendMessage () {
      const methods = window.socket.import(['sendMessage'])
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

    async leaveRoom (socket, reason) {
      if (!this.redirected) {
        this.$router.push('/')
      }
    }
  },

  async mounted () {
    this.methods = window.socket.import(['checkRoom', 'sendMessage'])

    window.socket.export({
      addMessage: this.addMessage,
      updateUserList: this.updateUserList,
      leaveRoom: this.leaveRoomClient
    })

    const response = await this.methods.checkRoom(this.$route.params.token)
    if (!response.room) {
      this.$router.push('/')
    }
  }
}
// $cookies.get("jwt")
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter, .fade-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
