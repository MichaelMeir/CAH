<template>
  <div>

  </div>
</template>
<script>
import axios from 'axios'

export default {
  async mounted () {
    await axios.post(`${location.protocol}//${location.hostname}:` + process.env.SERVER_PORT + '/api/auth/logout', [], {
      withCredentials: true
    })
  }
}
</script>
