<template>
  <div class="select-none">
    <div
      @click="openInterface($event)"
      class="flex items-center p-3"
    >
      <div class="flex items-center mr-3 align-middle">
        <div
          v-if="$parent.$parent.$refs.navbar.user.avatar !== null"
          :style="`background-image: url(${$parent.$parent.$refs.navbar.user.username !== user ? avatar : $parent.$parent.$refs.navbar.user.avatar})`"
          class="bg-cover bg-center rounded-full h-6 w-6"
        ></div>
      </div>
      <div>
        {{ user }}
      </div>
    </div>
    <transition name="fade">
      <div
        ref="interface"
        class="h-20 z-20 w-1/5 absolute cursor-default"
        v-show="visible"
      >
        <div :class="`flex relative p-3 mx-2 shadow rounded-b-none rounded items-center bg-${getTheme}-900`">
          <div>
            <div
              :style="`background-image: url(${$parent.$parent.$refs.navbar.user.username !== user ? avatar : $parent.$parent.$refs.navbar.user.avatar})`"
              :class="`p-6 m-1 rounded-t-full rounded-b-full bg-${getTheme}-700 bg-cover`"
            ></div>
          </div>
          <div class="flex flex-1 text-white ml-3 mt-1">
            <div>
              <div>{{ user }}</div>
              <div class="text-xs font-normal opacity-75">Created on 1th February 2016</div>
            </div>
          </div>
          <div class="absolute mt-3 mr-3 right-0 top-0 flex flex-1 justify-end text-white mr-1">
            <button
              class="text-xs font-semibold focus:outline-none"
              @click="closeInterface()"
            ><i class="fas fa-times"></i></button>
          </div>
        </div>
        <div :class="`flex bg-white rounded mx-2 p-1 rounded-t-none shadow items-center`">
          <div class="flex items-center my-2 mx-1">
            <button :class="`bg-${getTheme}-600 hover:bg-${getTheme}-700 py-2 px-4 ml-1 font-semibold rounded text-xs focus:outline-none`">
              <i class="fas fa-user-plus mr-2 opacity-50"></i> Add friend
            </button>
            <button  v-if="owner && ownername != user"
              @click="kickUser(user)" :class="`bg-${getTheme}-600 hover:bg-${getTheme}-700 py-2 px-4 ml-1 font-semibold rounded text-xs focus:outline-none`">
              <i class="fas fa-door-open mr-2 opacity-50"></i> Kick user
            </button>
          </div>
          <div class="flex flex-1 justify-end ml-8">
            <div class="cursor-pointer">
              <i :class="`transition fas fa-ellipsis-v text-${getTheme}-800 hover:text-${getTheme}-600 mr-3`"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import ThemeStore from '../store/ThemeStore'

export default {
  computed: {
    getTheme () {
      return ThemeStore.state.theme
    }
  },

  data () {
    return {
      visible: false,
      methods: {},
      owner: false,
      ownername: ''
    }
  },

  props: [
    'user'
  ],

  mounted () {
    this.methods = window.socket.import([
      'isOwner',
      'kickUser'
    ])

    this.showKickButtons()

    window.socket.export({
      leaveRoom: this.leaveRoom
    })
  },

  methods: {
    openInterface (e) {
      this.visible = !this.visible
      if (this.visible) {
        this.$refs.interface.style.left = `${e.clientX - 100}px`
        this.$refs.interface.style.top = `${(e.clientY + window.scrollY) + 15}px`
      }
    },

    closeInterface () {
      this.visible = false
    },

    async showKickButtons () {
      const jwt = this.$cookies.get('jwt')
      if (!jwt) {
        console.error('could not get jwt token')
        return
      }
      let resp = await this.methods.isOwner(jwt)
      this.owner = resp.isOwner
      this.ownername = resp.username
    },

    async kickUser (user) {
      console.log(user)
      const jwt = this.$cookies.get('jwt')
      if (!jwt) {
        console.error('could not get jwt token')
        return
      }
      let resp = await this.methods.kickUser(jwt, user)
      return resp
    },

    async leaveRoom (socket, reason) {
      console.log(reason)
      if (!this.redirected) {
        this.$router.push('/')
      }
    }
  }
}
</script>
