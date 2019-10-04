<template>
  <div class="flex flex-col justify-center h-screen items-center">
    {{ status }}

    <button
      @click="$router.push('/')"
      class="mt-8 block px-5 rounded py-3 bg-blue-500 text-white text-sm font-semibold"
    >
      Go to the homepage
    </button>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  data () {
    return {
      status: null
    }
  },

  async mounted () {
    try {
      let request = await axios.post(`${location.protocol}//${location.hostname}` + (!process.env.DEV ? '' : (':' + process.env.SERVER_PORT)) + '/api/verification/' + this.$route.params.uuid, [], {
        withCredentials: true
      })

      if (request.status === 200) {
        this.status = 'Your email address has been verified successfully'
      }
    } catch (err) {
      this.status = err.response.data.message
    }
  }
}
</script>
