<template>
  <nav class="bg-indigo-700 py-6 px-8 mt-5 rounded flex text-white max-w-4xl mx-auto items-center">
    <div class="text-sm leading-snug tracking-wider text-center">
      <span class="uppercase text-sm font-bold block">Cards Against Me</span>
    </div>
    <div class="flex flex-1 justify-end text-sm">
      <ul class="flex items-center">
        <li class="cursor-pointer nav-item active ml-8">Home</li>
        <li class="cursor-pointer nav-item ml-8">Rooms</li>
        <li
          v-if="isAuthenticated"
          class="cursor-pointer nav-item ml-8"
        >Settings</li>
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
</template>
<script>
import AuthService from '../services/AuthService'

export default {
  data () {
    return {
      isAuthenticated: false
    }
  },

  async mounted () {
    let isVerified = await AuthService.isVerified()

    console.log(isVerified)

    let isAuthenticated = await AuthService.isAuthenticated()

    if (!isAuthenticated) {
      this.$router.push('/login')
    } else {
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
