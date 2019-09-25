<template>
  <div>
    <Navbar />
    <div
      class="text-center mt-8 bg-indigo-700 rounded w-1/4 mx-auto text-white font-bold p-10"
      v-if="error"
    >
      <h1 class="text-red-500 text-3xl uppercase mb-3">Error</h1>
      <h1>{{ status }}</h1>
      <button
        @click="$router.push('/')"
        class="focus:outline-none w-full text-sm hover:bg-indigo-500 mt-10 bg-indigo-600 rounded py-2 px-4 font-semibold text-white hover:shadow"
      >Go home</button>

    </div>
    <div
      class="max-w-md mx-auto flex mt-8 flex-col"
      v-if="verified"
    >
      <div class="text-white bg-indigo-700 text-sm font-bold px-4 py-4 rounded-t">
        Change password
      </div>
      <div class="px-4 py-4 bg-indigo-800 rounded-b">

        <div class="mb-3">
          <input
            @keydown="clearError('password')"
            :class="(hasError('password') ? 'has-error' : '') + ' mt-1 block w-full px-3 border border-transparent bg-indigo-700 text-white focus:outline-none py-2 text-sm rounded shadow'"
            type="password"
            placeholder="New password"
            autocomplete="off"
            v-model="password"
          />
          <div
            v-if="hasError('password')"
            class="error-message"
          >
            {{ getError('password') }}
          </div>
        </div>

        <div class="mb-3">
          <input
            @keydown="clearError('password_confirmation')"
            :class="(hasError('password_confirmation') ? 'has-error' : '') + ' mt-1 block w-full px-3 border border-transparent bg-indigo-700 text-white focus:outline-none py-2 text-sm rounded shadow'"
            type="password"
            placeholder="Confirm your password"
            autocomplete="off"
            v-model="password_confirmation"
          />
          <div
            v-if="hasError('password_confirmation')"
            class="error-message"
          >
            {{ getError('password_confirmation') }}
          </div>
        </div>

        <div>
          <button
            class="focus:outline-none w-full text-sm hover:bg-indigo-600 mt-2 bg-indigo-600 rounded py-2 px-4 font-semibold text-white"
            @click="submit()"
          >
            Change password
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import Navbar from '../components/Navbar'

export default {
  components: {
    Navbar
  },
  data () {
    return {
      verified: false,
      error: false,
      status: null,
      password: null,
      password_confirmation: null,
      errors: []
    }
  },

  async mounted () {
    try {
      let request = await axios.get(`${location.protocol}//${location.hostname}:` + process.env.SERVER_PORT + '/api/reset/' + this.$route.params.token, [], {
        withCredentials: true
      })

      if (request.status === 200) {
        this.status = 'Your token has been verified successfully'
        this.verified = true
      }
    } catch (err) {
      this.status = err.response.data.message
      this.error = true
    }
  },

  methods: {
    /**
     * Submits the data the user has entered and also validates the fields.
     *
     * @return {Boolean}
     */
    async submit () {
      if (!this.password) {
        this.errors.push({
          field: 'password',
          error: 'Please enter a password.'
        })
      }

      if (this.password !== this.password_confirmation) {
        this.errors.push({
          field: 'password_confirmation',
          error: 'Please confirm your password.'
        })
      }
      if (!this.password_confirmation) {
        this.errors.push({
          field: 'password_confirmation',
          error: 'Please confirm your password.'
        })
      }

      if (this.errors.length === 0) {
        try {
          let request = await axios.post(`${location.protocol}//${location.hostname}:` + process.env.SERVER_PORT + '/api/reset', {
            token: this.$route.params.token,
            new_password: this.password,
            new_password_confirmation: this.password_confirmation
          })

          if (request.status === 200) {
            this.$router.push({
              path: '/login',
              query: {
                'passwordChanged': true
              }
            })
          }
        } catch (err) {
          err.response.data.errors.forEach(error => {
            this.errors.push({
              field: error.field,
              error: error.message
            })
          })
        }
      }
    },

    /**
     * A helper function to check if the field parameter has an active error
     *
     * @param {String} field
     *
     * @return {Boolean}
     */
    hasError (field) {
      return (this.errors.find(e => {
        return e.field === field
      })) !== undefined
    },

    /**
     * A helper function to retrieve the active error of a specified field
     *
     * @param {String} field
     *
     * @return {String}
     */
    getError (field) {
      return this.errors.find(e => {
        return e.field === field
      }).error
    },

    /**
     * A helper function to clear the active error of a specified field

     * @param {String} field
     *
     * @return {Boolean}
     */
    clearError (field) {
      if (!this.hasError(field)) return

      this.errors = this.errors.filter(e => {
        return e.field !== field
      })
    }
  }
}

</script>
<style lang="scss" scoped>
input {
  &::placeholder {
    @apply .text-white;
  }

  &.has-error {
    @apply .border .border-red-500 .text-red-500;

    &::placeholder {
      @apply .text-red-200 .font-semibold;
    }
  }
}

.error-message {
  @apply .mt-1 .font-semibold .text-red-500 .text-xs;
}
</style>
