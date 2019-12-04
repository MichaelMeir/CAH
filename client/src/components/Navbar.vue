<template>
  <div>
    <nav :class="`bg-${getTheme}-700 py-6 px-8 mt-5 rounded flex text-white max-w-4xl mx-auto items-center`">
      <div class="text-sm leading-snug tracking-wider text-center">
        <span
          @click="redirect('/')"
          class="uppercase text-sm font-bold block cursor-pointer"
        >Cards Against Me</span>
      </div>
      <div class="flex flex-1 justify-end text-sm">
        <ul
          class="flex items-center"
          v-if="loaded"
        >
          <li
            @click="redirect('/')"
            v-if="isAuthenticated"
            :class="`cursor-pointer nav-item text-${getTheme}-200 ml-8 transition ` + (this.$route.path === '/' ? 'active' : '')"
          >Home</li>
          <li
            @click="redirect('/cardpacks')"
            v-if="isAuthenticated"
            :class="`cursor-pointer nav-item text-${getTheme}-200 ml-8 transition ` + (this.$route.path === '/cardpacks' ? 'active' : '')"
          >Cardpacks</li>
          <li
            @click="redirect('/profile')"
            v-if="isAuthenticated"
            :class="`cursor-pointer nav-item text-${getTheme}-200 ml-8 transition ` + (this.$route.path === '/profile' ? 'active' : '')"
          >My profile</li>
          <li
            v-if="isAuthenticated"
            @click="logout()"
            :class="`cursor-pointer nav-item text-${getTheme}-200 ml-8 transition`"
          >Logout</li>
          <li
            v-if="!isAuthenticated"
            @click="redirect('/register')"
            :class="`cursor-pointer nav-item text-${getTheme}-200 ml-8 transition`"
          >Create account</li>
          <li
            v-if="!isAuthenticated"
            @click="redirect('/login')"
            :class="`cursor-pointer nav-item text-${getTheme}-200 ml-8 transition`"
          >Login</li>
        </ul>

        <div
          class="flex items-center ml-8"
          v-if="isAuthenticated && user.avatar !== null"
        >
          <div
            :style="`background-image: url(${user.avatar})`"
            class="bg-cover bg-center rounded-full h-8 w-8"
          >
          </div>
        </div>
      </div>
    </nav>
    <div
      v-if="!isVerified"
      class="items-center relative max-w-4xl mx-auto mt-5 flex bg-orange-200 border border-orange-300 text-orange-700 font-semibold text-sm rounded py-3 px-4"
    >
      <div>You must verify your email address to join games</div>
      <div class="flex flex-1 justify-end">
        <button
          ref="resendButton"
          @click="resendMail()"
          class="focus:outline-none hover:bg-orange-500 font-semibold rounded text-white bg-orange-400 px-4 py-2"
        >Resend mail</button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import AuthService from '../services/AuthService'
import ThemeStore from '../store/ThemeStore'

export default {
  props: ['onredirect'],

  computed: {
    getTheme () {
      return ThemeStore.state.theme
    }
  },

  data () {
    return {
      isAuthenticated: false,
      isVerified: true,
      user: null,
      loaded: false
    }
  },

  async mounted () {
    let isAuthenticated = await AuthService.isAuthenticated()

    if (isAuthenticated) {
      let isVerified = await AuthService.isVerified()
      let user = await AuthService.getUser()
      this.user = user.payload.user

      if (!isVerified) this.isVerified = false

      this.isAuthenticated = true
      this.loaded = true
    } else {
      this.loaded = true
    }
  },

  methods: {
    getAvatarFromBuffer (buffer) {
      return Buffer.from(buffer).toString('base64')
    },

    redirect (url) {
      if (this.onredirect) this.onredirect(url)
      this.$router.push(url)
    },

    logout () {
      AuthService.logout()
    },

    async resendMail () {
      try {
        let request = await axios.post(`${location.protocol}//${location.hostname}` + (!process.env.DEV ? '' : (':' + process.env.SERVER_PORT)) + '/api/auth/resendMail', [], {
          withCredentials: true
        })

        if (request.status === 200) {
          this.$refs['resendButton'].innerText = 'Check your inbox'
          this.$parent.$refs.toast.openToast(
            'success',
            5,
            'Verification mail has been sent'
          )
          this.$refs['resendButton'].disabled = true
        }
      } catch (err) {
        this.$parent.$refs.toast.openToast(
          'danger',
          5,
          err.response.data.message
        )
        this.$refs['resendButton'].innerText = 'Try again later'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.nav-item {
  &.active {
    @apply .font-bold .text-white;
  }

  &:hover {
    @apply .text-white;
  }
}
</style>
