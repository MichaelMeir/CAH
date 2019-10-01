<template>
  <div>
    <Navbar />
    <div class="max-w-md mx-auto flex mt-8 flex-col">
      <div class="text-white bg-indigo-700 text-sm font-bold px-4 py-4 rounded-t">
        Login
      </div>
      <div class="px-4 py-4 bg-indigo-800 rounded-b">
        <div
          class="bg-green-200 mb-2 border border-green-300 text-green-700 font-semibold text-sm rounded py-3 px-4"
          v-if="$route.query.accountCreated"
        >
          Your account has been created successfully, you are now able to login.
        </div>
        <div
          class="bg-green-200 mb-2 border border-green-300 text-green-700 font-semibold text-sm rounded py-3 px-4"
          v-if="$route.query.passwordChanged"
        >
          Your password has been changed successfully, you are now able to login.
        </div>
        <div class="mb-3">
          <input
            @keydown="clearErrors()"
            :class="(hasError('email') ? 'has-error' : '') + ' mt-1 block w-full px-3 border border-transparent bg-indigo-700 text-white focus:outline-none py-2 text-sm rounded shadow'"
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
            :class="(hasError('password') ? 'has-error' : '') + ' mt-1 block w-full px-3 border border-transparent bg-indigo-700 text-white focus:outline-none py-2 text-sm rounded shadow'"
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

        <div class="mt-8">
          <button
            class="focus:outline-none w-full text-sm hover:bg-indigo-600 mt-2 bg-indigo-600 rounded py-2 px-4 font-semibold text-white"
            @click="submit()"
          >
            Login
          </button>
          <div class="text-center text-white text-xs mt-5">
            Don't have an account yet? <span
              @click="$router.push('/register')"
              class="cursor-pointer underline"
            >Create one here</span>
          </div>

          <div class="text-center text-white text-xs mt-5">
            In case you forgot your password, <span
              @click="$router.push('/forgot-password')"
              class="cursor-pointer underline"
            >click here to reset it</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import AuthService from '../services/AuthService'

import Navbar from '../components/Navbar'

export default {
  components: {
    Navbar
  },

  data () {
    return {
      email: null,
      password: null,
      errors: []
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
          let request = await axios.post(`${location.protocol}//${location.hostname}` + (!process.env.DEV ? '' : (':' + process.env.SERVER_PORT)) + '/api/auth/login', {
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
