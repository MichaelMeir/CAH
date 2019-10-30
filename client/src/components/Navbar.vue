<template>
  <div>
    <nav class="bg-indigo-700 py-6 px-8 mt-5 rounded flex text-white max-w-4xl mx-auto items-center">
      <div class="text-sm leading-snug tracking-wider text-center">
        <span
          @click="$router.push('/')"
          class="uppercase text-sm font-bold block cursor-pointer"
        >Cards Against Me</span>
      </div>
      <div class="flex flex-1 justify-end text-sm">
        <ul class="flex items-center">
          <li
            @click="$router.push('/')"
            v-if="isAuthenticated"
            class="cursor-pointer nav-item ml-8"
            v-bind:class="{ 'active': this.$route.path === '/' }"
          >Home</li>
          <li
            @click="$router.push('/cardpacks')"
            v-if="isAuthenticated"
            class="cursor-pointer nav-item ml-8"
            v-bind:class="{ 'active': this.$route.path === '/cardpacks' }"
          >Cardpacks</li>
          <li
            @click="$router.push('/profile')"
            v-if="isAuthenticated"
            class="cursor-pointer nav-item ml-8"
            v-bind:class="{ 'active': this.$route.path === '/profile' }"
          >My profile</li>
          <li
            v-if="isAuthenticated"
            @click="logout()"
            class="cursor-pointer nav-item ml-8"
          >Logout</li>
          <li
            v-if="!isAuthenticated"
            @click="$router.push('/register')"
            class="cursor-pointer nav-item ml-8"
          >Create account</li>
          <li
            v-if="!isAuthenticated"
            @click="$router.push('/login')"
            class="cursor-pointer nav-item ml-8"
          >Login</li>
        </ul>

        <div
          class="flex items-center ml-8"
          v-if="isAuthenticated"
        >
          <!-- <div
            :style="(user.avatar !== null) ? `background-image: url(data:image/jpeg;base64,${user.avatar})` : `background-image: url(https://clinicforspecialchildren.org/wp-content/uploads/2016/08/avatar-placeholder.gif)`"
            class="bg-cover bg-center rounded-full h-8 w-8"
          >
          </div> -->
          <div>

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

export default {
  data () {
    return {
      isAuthenticated: false,
      isVerified: true,
      user: null
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
    }
  },

  methods: {
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
          this.$refs['resendButton'].disabled = true
        }
      } catch (err) {
        this.$refs['resendButton'].innerText = 'Try again later'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.nav-item {
  @apply .text-indigo-200;
  &.active {
    @apply .font-bold .text-white;
  }

  &:hover {
    @apply .text-white;
  }
}
</style>
