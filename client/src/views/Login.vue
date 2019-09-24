<template>
  <div class="max-w-sm mx-auto">
    <div>
      <div class="mb-4 px-3 py-3 text-sm font-semibold rounded flex justify-center">
        <img
          class="h-40"
          src="@/assets/logo.png"
        >
      </div>
      <div class="mb-3">
        <div
          v-if="loggedIn"
          class="bg-green-500 rounded-t"
        >
          <p class="text-center text-white font-bold">Logged in</p>
        </div>
        <input
          @keydown="clearErrors()"
          :class="(hasError('email') ? 'has-error' : '') + ' mt-1 block w-full px-3 border border-gray-400 focus:outline-none py-2 text-sm rounded shadow'"
          type="text"
          placeholder="Email address"
          autocomplete="off"
          v-model="email"
        />
        <div
          v-if="hasError('email')"
          class="error-message"
        >
          {{ getError('email') }}
        </div>
      </div>

      <div class="mb-3">
        <input
          @keydown="clearErrors()"
          :class="(hasError('password') ? 'has-error' : '') + ' mt-1 block w-full px-3 border border-gray-400 focus:outline-none py-2 text-sm rounded shadow'"
          type="password"
          placeholder="Password"
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

      <div>
        <button
          class="w-full focus:outline-none rounded bg-blue-500 shadow font-semibold text-sm text-white py-3 hover:bg-blue-600 transition"
          @click="submit()"
        >
          Login
        </button>
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
      email: null,
      password: null,
      errors: []
    }
  },

  async mounted () {
    let isAuthenticated = await AuthService.isAuthenticated()

    if (isAuthenticated) {
      this.$router.push('/')
    }
  },

  methods: {
    /**
     * Submits the data the user has entered and also validates the fields.
     *
     * @return {Boolean}
     */
    async submit () {
      if (!this.email) {
        this.errors.push({
          field: 'email',
          error: 'Please fill in your email address.'
        })
      }

      if (!this.password) {
        this.errors.push({
          field: 'password',
          error: 'Please enter your password.'
        })
      }

      if (this.errors.length === 0) {
        try {
          let request = await axios.post(`${location.protocol}//${location.hostname}:` + process.env.SERVER_PORT + '/api/auth/login', {
            email: this.email,
            password: this.password
          }, {
            withCredentials: true
          })

          if (request.status === 200) {
            location.href = '/'
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
    },

    /**
     * A helper function clear all errors
     *
     * @return {Boolean}
     */
    clearErrors () {
      this.errors = []
    }
  }
}
</script>
<style lang="scss" scoped>
input {
  &.has-error {
    @apply .border .border-red-300 .text-red-500;

    &::placeholder {
      @apply .text-red-500 .font-semibold;
    }
  }
}

.error-message {
  @apply .mt-1 .font-semibold .text-red-500 .text-xs;
}
</style>
