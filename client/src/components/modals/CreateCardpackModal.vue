<template>
  <transition name="fade">
    <div v-if="open">
      <div
        @click="open = false"
        class="fixed z-40 left-0 top-0 bg-black opacity-50 h-full w-full"
      ></div>
      <div class="fixed left-0 right-0 top-0 z-50">
        <div :class="`shadow bg-${getTheme}-100 text-${getTheme}-800 border border-${getTheme}-200 rounded max-w-2xl mx-auto flex flex-col mt-32 p-4`">
          <div class="text-base font-semibold flex items-center">
            <div>Creating a cardpack</div>
            <div class="flex flex-1 justify-end">
              <svg
                @click="open = false"
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
            Please fill in all the fields to create your cardpack

            <div :class="`mt-4 border-t border-${getTheme}-200 pt-4`">
              <div>
                <label>Name</label>
                <input
                  v-model="cardpack.title"
                  @keydown="clearError('cardpack.title')"
                  :class="
                    (hasError('cardpack.title') ? 'has-error' : '') +
                      ` focus:outline-none focus:border-${getTheme}-300 transition mt-1 block w-full py-1 px-2 text-sm rounded border border-${getTheme}-200`
                  "
                />
                <div
                  v-if="hasError('cardpack.title')"
                  class="error-message"
                >
                  {{ getError("cardpack.title") }}
                </div>
              </div>
              <div class="my-4">
                <label class="mt-4">Description</label>
                <textarea
                  v-model="cardpack.description"
                  :class="
                    (hasError('cardpack.description') ? 'has-error' : '') +
                      ` focus:outline-none focus:border-${getTheme}-300 transition mt-1 block w-full py-1 px-2 text-sm rounded border border-${getTheme}-200`
                  "
                />
                <div
                  v-if="hasError('cardpack.description')"
                  class="error-message"
                >
                  {{ getError("cardpack.description") }}
                </div>
              </div>
              <div>
                <label class="mt-4">Tags</label>
                <select
                  @change="clearError('cardpack.tags')"
                  v-model="cardpack.tags"
                  multiple
                  :class="
                    (hasError('cardpack.tags') ? 'has-error' : '') +
                      ` focus:outline-none focus:border-${getTheme}-300 transition mt-1 block w-full py-1 px-2 text-sm rounded border border-${getTheme}-200 text-gray-700`
                  "
                >
                  <option disabled selected>Select tags</option>
                  <option
                    v-bind:key="category.id"
                    :value="category"
                    v-for="category in categories"
                    >{{ category }}</option
                  >
                </select>
                <div v-if="hasError('cardpack.tags')" class="error-message">
                  {{ getError("cardpack.tags") }}
                </div>
              </div>
              <button
                :class="`mt-8 focus:outline-none hover:bg-${getTheme}-600 mt-2 bg-${getTheme}-500 rounded py-2 px-4 font-semibold text-white`"
                type="button"
                @click="saveChanges"
              >
                Create pack
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from 'axios'
import ThemeStore from '../../store/ThemeStore'

export default {
  computed: {
    getTheme () {
      return ThemeStore.state.theme
    }
  },

  data () {
    return {
      open: false,
      errors: [],
      categories: ['Fantasy', 'TV', 'Technical', 'Comedy', 'Games', 'Food'],
      cardpack: {
        title: '',
        description: '',
        tags: []
      }
    }
  },

  methods: {
    toggleModal () {
      this.open = !this.open
    },
    async saveChanges () {
      if (!this.cardpack.title) {
        this.errors.push({
          field: 'cardpack.title',
          error: 'Please enter a title'
        })
      }

      if (!this.cardpack.description) {
        this.errors.push({
          field: 'cardpack.description',
          error: 'Please enter a description'
        })
      }

      if (!this.cardpack.tags.length > 0) {
        this.errors.push({
          field: 'cardpack.tags',
          error: 'Please select atleast one tag'
        })
      }

      if (this.cardpack.tags.length > 3) {
        this.errors.push({
          field: 'cardpack.tags',
          error: 'Please limit your selection to three tags'
        })
      }

      if (this.errors.length === 0) {
        try {
          let request = await axios.post(
            `${location.protocol}//${location.hostname}` +
            (!process.env.DEV ? '' : ':' + process.env.SERVER_PORT) +
            '/api/cardpacks/create',
            {
              name: this.cardpack.title,
              description: this.cardpack.description,
              tags: this.cardpack.tags
            },
            {
              withCredentials: true
            }
          )

          if (request.status === 200) {
            this.open = false
            this.$parent.cardpacks.push(request.data.payload)
            this.$parent.$parent.$refs.toast.openToast(
              'success',
              5,
              'Your cardpack has been created successfully'
            )
            this.cardpack = {
              title: '',
              description: '',
              tags: []
            }
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
