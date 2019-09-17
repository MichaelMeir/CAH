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
        <input
          @keydown="clearError('username')"
          :class="(hasError('username') ? 'has-error' : '') + ' mt-1 block w-full px-3 border border-gray-400 focus:outline-none py-2 text-sm rounded shadow'"
          type="text"
          placeholder="Username"
          autocomplete="off"
          v-model="username"
        />
        <div
          v-if="hasError('username')"
          class="error-message"
        >
          {{ getError('username') }}
        </div>
      </div>

      <div class="mb-3">
        <input
          @keydown="clearError('password')"
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

      <div class="mb-3">
        <input
          @keydown="clearError('password_confirmation')"
          :class="(hasError('password_confirmation') ? 'has-error' : '') + ' mt-1 block w-full px-3 border border-gray-400 focus:outline-none py-2 text-sm rounded shadow'"
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

      <div class="mb-3">
        <input
          @keydown="clearError('email')"
          :class="(hasError('email') ? 'has-error' : '') + ' mt-1 block w-full px-3 border border-gray-400 focus:outline-none py-2 text-sm rounded shadow'"
          type="email"
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

      <div class="mb-4">
        <label :class="(hasError('tos') ? 'error-message underline' : '') + ' flex text-xs items-center cursor-pointer'">
          <input
            @change="clearError('tos')"
            class="mr-3"
            type="checkbox"
            v-model="tos"
          >
          I agree to the terms &amp; conditions
        </label>
      </div>

      <div>
        <button
          class="w-full focus:outline-none rounded bg-blue-500 shadow font-semibold text-sm text-white py-3 hover:bg-blue-600 transition"
          @click="submit()"
        >
          Create account
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  data () {
    return {
      username: null,
      password: null,
      password_confirmation: null,
      email: null,
      tos: false,

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
      if (!this.username) {
        this.errors.push({
          field: 'username',
          error: 'Please fill in a username.'
        })
      }

      if (!this.email) {
        this.errors.push({
          field: 'email',
          error: 'Please fill in a valid e-mail address.'
        })
      }

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

      if (!this.tos) {
        this.errors.push({
          field: 'tos',
          error: 'You must agree to our terms and conditions.'
        })
      }

      if (this.errors.length === 0) {
        try {
          await axios.post(`${location.protocol}//${location.hostname}:` + process.env.SERVER_PORT + '/api/auth/register', {
            username: this.username,
            email: this.email,
            password: this.password,
            password_confirmation: this.password_confirmation
          })
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
