<template>
  <div>
    <div class="max-w-4xl mx-auto mt-1 flex flex-1">
      <div class="w-1/3 pl-1">
        <button class="cursor-pointer bg-indigo-700 text-center hover:bg-indigo-800 text-white font-bold py-3 text-sm mr-2 rounded ml-auto mr-20 mt-2 w-full transition"><i class="fas fa-flag-checkered mr-2 opacity-50" @click="stopGame"></i> Stop game</button>
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
      methods: {},
      usernames: []
    }
  },

  methods: {
    async stopGame () {
      const methods = window.socket.import(['stopGame'])
      const jwt = this.$cookies.get('jwt')
      if (!jwt) {
        this.$parent.$refs.toast.openToast('danger', 5, 'Could not get authentication token.')
        return
      }
      methods.stopGame(jwt)
    }
  },

  async mounted () {
    this.methods = window.socket.import(['checkRoom'])

    const response = await this.methods.checkRoom(this.$route.params.token)
    if (!response.room) {
      this.$router.push('/')
    } else {
      this.usernames = response.usernames
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
