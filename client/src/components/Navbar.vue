<template>
  <div>
    <nav class="bg-indigo-700 py-6 px-8 mt-5 rounded flex text-white max-w-4xl mx-auto items-center">
      <div class="text-sm leading-snug tracking-wider text-center">
        <span class="uppercase text-sm font-bold block">Cards Against Me</span>
      </div>
      <div class="flex flex-1 justify-end text-sm">
        <ul class="flex items-center">
          <li
            v-if="isAuthenticated"
            class="cursor-pointer nav-item active ml-8"
          >Home</li>
          <li
            v-if="isAuthenticated"
            class="cursor-pointer nav-item ml-8"
          >Rooms</li>
          <li
            @click="$router.push('/profile')"
            v-if="isAuthenticated"
            class="cursor-pointer nav-item ml-8"
          >My profile</li>
          <li
            v-if="isAuthenticated"
            @click="logout()"
            class="cursor-pointer nav-item ml-8"
          >Logout</li>
          <li
            v-if="!isAuthenticated"
            @click="$router.push('/login')"
            class="cursor-pointer nav-item ml-8"
          >Login</li>
        </ul>
      </div>
    </nav>
    <div
      v-if="!isVerified"
      class="items-center relative max-w-4xl mx-auto mt-5 flex bg-orange-200 border border-orange-300 text-orange-700 font-semibold text-sm rounded py-3 px-4"
    >
      <div>You must verify your email address to join games</div>
      <div class="flex flex-1 justify-end">
        <button class="hover:bg-orange-500 font-semibold rounded text-orange-100 bg-orange-400 px-4 py-2">Resend mail</button>
      </div>
    </div>
  </div>
</template>
<script>
import AuthService from '../services/AuthService'

export default {
  data () {
    return {
      isAuthenticated: false,
      isVerified: true
    }
  },

  async mounted () {
    let isAuthenticated = await AuthService.isAuthenticated()

    if (!isAuthenticated) {
      this.$router.push('/login')
    } else {
      let isVerified = await AuthService.isVerified()

      if (!isVerified) this.isVerified = false
      this.isAuthenticated = true
    }
  },

  methods: {
    logout () {
      AuthService.logout()
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
