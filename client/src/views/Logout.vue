<template>
  <div>

  </div>
</template>
<script>
import axios from 'axios'

export default {
  async mounted () {
    let request = await axios.post(`${location.protocol}//${location.hostname}` + process.env.DEV ? '' : (':' + process.env.SERVER_PORT) + '/api/auth/logout', [], {
      withCredentials: true
    })

    if (request.status === 200) {
      this.$router.push('/')
    }
  }
}
</script>
