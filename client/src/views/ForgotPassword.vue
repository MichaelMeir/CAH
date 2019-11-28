<template>
  <div>
    <div class="max-w-md mx-auto flex mt-8 flex-col">
      <div
        class="bg-green-200 mb-2 border border-green-300 text-green-700 font-semibold text-sm rounded py-3 px-4"
        v-if="status !== null"
      >
        {{ status }}
      </div>

      <div class="text-white bg-indigo-700 text-sm font-bold px-4 py-4 rounded-t">
        Reset password
      </div>
      <div class="px-4 py-4 bg-indigo-800 rounded-b">

        <div class="mb-3">
          <input
            @keydown="clearError('email')"
            :class="(hasError('email') ? 'has-error' : '') + ' mt-1 block w-full px-3 border border-transparent bg-indigo-700 text-white focus:outline-none py-2 text-sm rounded shadow'"
            type="email"
            placeholder="Your email address"
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
        <div>
          <button
            @click="submit()"
            class="focus:outline-none w-full text-sm hover:bg-indigo-600 mt-2 bg-indigo-600 rounded py-2 px-4 font-semibold text-white"
          >
            Send reset link
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  data () {
    return {
      errors: [],

      email: null,
      status: null
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
          error: 'Please enter your email address.'
        })
      }

      if (this.errors.length === 0) {
        try {
          let request = await axios.post(`${location.protocol}//${location.hostname}` + (!process.env.DEV ? '' : (':' + process.env.SERVER_PORT)) + '/api/sendResetLink', {
            email: this.email
          })

          if (request.status === 200) {
            this.status = 'Check your inbox for the verification link'
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
