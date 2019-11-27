<template>
  <transition
    appear
    appear-class="page-fade-enter"
    appear-to-class="page-fade-enter-active"
  >
    <div>
      <div
        v-if="status !== null"
        class="max-w-4xl mt-4 mx-auto bg-green-200 mb-2 border border-green-300 text-green-700 font-semibold text-sm rounded py-3 px-4"
      >
        {{ status }}
      </div>
      <div
        v-if="statusError !== null"
        class="max-w-4xl mt-4 mx-auto bg-red-200 mb-2 border border-red-300 text-red-700 font-semibold text-sm rounded py-3 px-4"
      >
        {{ statusError }}
      </div>
      <div
        @click="deleteModalOpen = false"
        v-if="deleteModalOpen"
        class="absolute z-10 left-0 top-0 bg-white opacity-50 h-full w-full"
      ></div>
      <div class="absolute left-0 right-0 top-0 z-20" v-if="deleteModalOpen">
        <div
          class="shadow bg-indigo-100 text-indigo-800 border border-indigo-200 rounded max-w-2xl mx-auto flex flex-col mt-32 p-4"
        >
          <div class="text-base font-semibold flex items-center">
            <div>Please enter your current password</div>
            <div class="flex flex-1 justify-end">
              <svg
                @click="deleteModalOpen = false"
                class="h-4 w-4 cursor-pointer"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  class="close"
                  d="M10 8.586L2.929 1.515 1.515 2.929 8.585 10l-7.07 7.071 1.414 1.414L10 11.415l7.071 7.07 1.414-1.414L11.415 10l7.07-7.071-1.414-1.414L10 8.585z"
                  fill-rule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div class="mt-3 text-sm">
            Make sure that this action cannot be undone and that this will
            permanently delete your account information.

            <div class="mt-4 border-t border-indigo-200 pt-4">
              <label for="password">Current password</label>
              <input
                @keydown="clearError('deleteCurrentPassword')"
                :class="
                  (hasError('deleteCurrentPassword') ? 'has-error' : '') +
                    ' focus:outline-none mt-1 block w-full py-1 px-2 text-base rounded border border-indigo-200'
                "
                type="password"
                v-model="deleteCurrentPassword"
              />
              <div
                v-if="hasError('deleteCurrentPassword')"
                class="error-message"
              >
                {{ getError("deleteCurrentPassword") }}
              </div>
              <button
                @click="deleteAccount()"
                class="mt-8 focus:outline-none hover:bg-red-600 mt-2 bg-red-500 rounded py-2 px-4 font-semibold text-white"
                type="button"
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="max-w-4xl mx-auto mt-5 flex">
        <div class="text-indigo-800 bg-indigo-100 rounded p-4 text-sm w-full">
          <div class="font-semibold mb-4 text-base">
            Modify your account settings
          </div>

          <div class="mb-3">
            <label for="username">Username</label>
            <input
              @keydown="clearError('deleteCurrentPassword')"
              :class="
                (hasError('deleteCurrentPassword') ? 'has-error' : '') +
                  ' focus:outline-none focus:border-indigo-300 transition mt-1 block w-full py-1 px-2 text-base rounded border border-indigo-200'
              "
              type="password"
              v-model="deleteCurrentPassword"
              disabled
            />
            <small>You are not able to modify your username</small>
          </div>

          <div class="mb-3">
            <label for="avatar">Avatar</label>
            <input
              @change="handleAvatarChange()"
              :class="
                (hasError('avatar') ? 'has-error' : '') +
                  ' p-3 bg-indigo-600 rounded text-white focus:outline-none mt-1 block w-1/3 mb-1'
              "
              type="file"
              accept="image/*"
            />
            <small
              >The recommended dimensions (in pixels) are:
              {{ required.avatarHeight }} x {{ required.avatarWidth }}</small
            >
          </div>

          <div class="mb-3">
            <label for="username">Email address</label>
            <input
              @keydown="clearError('email')"
              :class="
                (hasError('email') ? 'has-error' : '') +
                  ' focus:outline-none mt-1 block w-1/3 p-2 rounded border border-indigo-200'
              "
              type="email"
              v-model="user.email"
            />
            <div v-if="hasError('email')" class="error-message">
              {{ getError("email") }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="max-w-4xl mx-auto mt-5 flex">
      <div class="text-indigo-800 bg-indigo-100 rounded p-4 text-sm w-full">
        <div class="font-semibold mb-4 text-base">
          Modify your account settings
        </div>

        <div class="mb-3">
          <label for="username">Username</label>
          <input
            @keydown="clearError('username')"
            :class="
              (hasError('username') ? 'has-error' : '') +
                ' focus:outline-none focus:border-indigo-300 transition mt-1 block w-1/3 p-2 rounded border border-indigo-200'
            "
            type="text"
            v-model="user.username"
            disabled
          />
          <small>You are not able to modify your username</small>
        </div>

        <div class="mb-3">
          <label for="avatar">Avatar</label>
          <input
            @change="handleAvatarChange()"
            :class="
              (hasError('avatar') ? 'has-error' : '') +
                ' p-3 bg-indigo-600 rounded text-white focus:outline-none mt-1 block w-1/3 mb-1'
            "
            type="file"
            accept="image/*"
          />
          <small
            >The recommended dimensions (in pixels) are:
            {{ required.avatarHeight }} x {{ required.avatarWidth }}</small
          >
        </div>

        <div class="mb-3">
          <label for="username">Email address</label>
          <input
            @keydown="clearError('email')"
            :class="
              (hasError('email') ? 'has-error' : '') +
                ' focus:outline-none focus:border-indigo-300 transition mt-1 block w-1/3 p-2 rounded border border-indigo-200'
            "
            type="email"
            v-model="user.email"
          />
          <div v-if="hasError('email')" class="error-message">
            {{ getError("email") }}
          </div>
        </div>

        <div class="mb-3">
          <label for="new_password">New password</label>
          <input
            @keydown="clearError('new_password')"
            :class="
              (hasError('new_password') ? 'has-error' : '') +
                ' focus:outline-none focus:border-indigo-300 transition mt-1 block w-1/3 p-2 rounded border border-indigo-200'
            "
            type="password"
            v-model="new_password"
          />
          <div v-if="hasError('new_password')" class="error-message">
            {{ getError("new_password") }}
            <div class="mb-3">
              <label for="new_password_confirmation"
                >Confirm your new password</label
              >
              <input
                @keydown="clearError('new_password_confirmation')"
                :class="
                  (hasError('new_password_confirmation') ? 'has-error' : '') +
                    ' focus:outline-none focus:border-indigo-300 transition mt-1 block w-1/3 p-2 rounded border border-indigo-200'
                "
                type="password"
                v-model="new_password_confirmation"
              />
              <div
                v-if="hasError('new_password_confirmation')"
                class="error-message"
              >
                {{ getError("new_password_confirmation") }}
              </div>
            </div>
            <div v-if="new_password" class="mb-3">
              <label for="username">Enter your current password</label>
              <input
                @keydown="clearError('current_password')"
                :class="
                  (hasError('current_password') ? 'has-error' : '') +
                    ' focus:outline-none mt-1 block w-1/3 p-2 rounded border border-indigo-200'
                "
                type="password"
                v-model="current_password"
              />
              <div v-if="hasError('current_password')" class="error-message">
                {{ getError("current_password") }}
              </div>
            </div>

            <button
              @click="saveChanges()"
              class="focus:outline-none hover:bg-indigo-600 mt-2 bg-indigo-500 rounded py-2 px-4 font-semibold text-white"
              type="button"
            >
              Save changes
            </button>

            <button
              @click="deleteModalOpen = !deleteModalOpen"
              class="focus:outline-none hover:bg-red-600 mt-2 bg-red-500 rounded py-2 px-4 font-semibold text-white"
              type="button"
            >
              Delete my account
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import AuthService from '../services/AuthService'

import Clipper from 'image-clipper'
import axios from 'axios'

export default {
  data () {
    return {
      user: {
        username: null,
        email: null,
        avatar: null
      },
      errors: [],
      status: null,
      statusError: null,

      new_password: null,
      new_password_confirmation: null,
      current_password: null,

      deleteModalOpen: false,
      deleteCurrentPassword: null,

      required: {
        avatarHeight: 300,
        avatarWidth: 300
      }
    }
  },

  async mounted () {
    let user = await AuthService.getUser()
    this.user = user.payload.user
  },

  methods: {
    async deleteAccount () {
      if (!this.deleteCurrentPassword) {
        this.errors.push({
          field: 'deleteCurrentPassword',
          error: 'Please enter your current password.'
        })
      }

      if (this.errors.length === 0) {
        try {
          let request = await axios.post(
            `${location.protocol}//${location.hostname}` +
              (!process.env.DEV ? '' : ':' + process.env.SERVER_PORT) +
              '/api/auth/deleteAccount',
            {
              deleteCurrentPassword: this.deleteCurrentPassword
            },
            {
              withCredentials: true
            }
          )

          if (request.status === 200) {
            AuthService.logout()
            this.$router.push('/login')
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

    async handleAvatarChange () {
      this.clearError('avatar')
      this.statusError = null
      this.status = null

      const file = document.querySelector('[type=file]').files[0]

      let image = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })

      let img = new Image()
      img.src = image

      img.onload = () => {
        Clipper(img)
          .resize(this.required.avatarWidth, this.required.avatarHeight)
          .toDataURL(async dataUrl => {
            this.status = `Your avatar has been uploaded successfully.`
            this.$parent.$refs.navbar.user.avatar = dataUrl

            await axios.post(
              `${location.protocol}//${location.hostname}` +
                (!process.env.DEV ? '' : ':' + process.env.SERVER_PORT) +
                '/api/auth/avatar',
              {
                avatar: dataUrl
              },
              {
                withCredentials: true
              }
            )
          })
      }
      // if ((img.naturalWidth > this.required.avatarWidth) || (img.naturalHeight > this.required.avatarHeight)) {
      //   this.statusError = `The maximum dimensions of an avatar are: ${this.required.avatarWidth} x ${this.required.avatarHeight}, please try again.`
      // } else {
      //   this.status = `Your avatar has been uploaded successfully.`
      //   this.$parent.$refs.navbar.user.avatar = image

      //   await axios.post(`${location.protocol}//${location.hostname}` + (!process.env.DEV ? '' : (':' + process.env.SERVER_PORT)) + '/api/auth/avatar', {
      //     avatar: image
      //   }, {
      //     withCredentials: true
      //   })
      // }
    },

    async saveChanges () {
      if (this.new_password && !this.new_password_confirmation) {
        this.errors.push({
          field: 'new_password_confirmation',
          error: 'Please confirm your new password.'
        })
      }

      if (
        this.new_password &&
        this.new_password !== this.new_password_confirmation
      ) {
        this.errors.push({
          field: 'new_password_confirmation',
          error: 'Your new password does not match.'
        })
      }

      if (this.errors.length === 0) {
        try {
          let request = await axios.post(
            `${location.protocol}//${location.hostname}` +
              (!process.env.DEV ? '' : ':' + process.env.SERVER_PORT) +
              '/api/auth/profile',
            {
              email: this.user.email,
              new_password: this.new_password,
              new_password_confirmation: this.new_password_confirmation,
              current_password: this.current_password
            },
            {
              withCredentials: true
            }
          )

          if (request.status === 200) {
            this.status = 'Your changes has been saved'
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
      return (
        this.errors.find(e => {
          return e.field === field
        }) !== undefined
      )
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
  &:disabled {
    @apply .text-indigo-300 .cursor-not-allowed;
  }

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

.close {
  fill: theme("colors.indigo.800");
}
</style>
