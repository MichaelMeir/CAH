<template>
  <div>
    <Navbar />
    <div class="max-w-4xl mx-auto mt-5">
      <div class="flex mb-2">
        <div class="flex w-full">
          <div class="w-3/4">
            <i
              style="margin-top: 17px"
              class="opacity-75 ml-4 align-bottom text-white absolute text-xs mt-1 fas fa-search"
            ></i>
            <input
              type="text"
              class="search w-full rounded pl-10 pr-3 py-3 focus:bg-indigo-700 focus:outline-none cursor-pointer appearance-none text-white bg-indigo-600 font-semibold text-sm mb-3"
              placeholder="Search cardpacks"
              v-model="search"
            />
          </div>
          <div class="w-1/4 ml-4">
            <button
              class="text-sm w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none font-semibold bg-indigo-100 rounded px-5 py-3"
              @click="createModalOpen = !createModalOpen"
            >
              <i class="fas fa-plus-circle mr-2"></i> Create cardpack
            </button>
          </div>
          <div
            @click="createModalOpen = false"
            v-if="createModalOpen"
            class="absolute z-10 left-0 top-0 bg-white opacity-50 h-full w-full"
          ></div>
          <div
            class="absolute left-0 right-0 top-0 z-20"
            v-if="createModalOpen"
          >
            <div class="shadow bg-indigo-100 text-indigo-800 border border-indigo-200 rounded max-w-2xl mx-auto flex flex-col mt-32 p-4">
              <div class="text-base font-semibold flex items-center">
                <div>Creating a cardpack</div>
                <div class="flex flex-1 justify-end">
                  <svg
                    @click="createModalOpen = false"
                    class="h-4 w-4 cursor-pointer"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      class="close"
                      d="M10 8.586L2.929 1.515 1.515 2.929 8.585 10l-7.07 7.071 1.414 1.414L10 11.415l7.071 7.07 1.414-1.414L11.415 10l7.07-7.071-1.414-1.414L10 8.585z"
                      fill-rule="evenodd"
                    /></svg>
                </div>
              </div>
              <div class="mt-3 text-sm">
                Please fill in all the fields to create your cardpack

                <div class="mt-4 border-t border-indigo-200 pt-4">
                  <div>
                    <label>Name</label>
                    <input
                      v-model="cardpack.title"
                      @keydown="clearError('cardpack.title')"
                      :class="(hasError('cardpack.title') ? 'has-error' : '') + ' focus:outline-none mt-1 block w-full py-1 px-2 text-sm rounded border border-indigo-200'"
                    >
                    <div
                      v-if="hasError('cardpack.title')"
                      class="error-message"
                    >
                      {{ getError('cardpack.title') }}
                    </div>
                  </div>
                  <div class="my-4">
                    <label class="mt-4">Description</label>
                    <textarea
                      v-model="cardpack.description"
                      :class="(hasError('cardpack.description') ? 'has-error' : '') + ' focus:outline-none mt-1 block w-full py-1 px-2 text-sm rounded border border-indigo-200'"
                    />
                    <div
                      v-if="hasError('cardpack.description')"
                      class="error-message"
                    >
                      {{ getError('cardpack.description') }}
                    </div>
                    </div>
                  <div>
                    <label class="mt-4">Tags</label>
                    <select v-model="cardpack.tags" multiple class="focus:outline-none mt-1 block w-full py-1 px-2 text-sm rounded border border-indigo-200 text-gray-700">
                        <option disabled selected>Select tags</option>
                        <option v-bind:key="category.id" :value="category" v-for="category in categories">{{ category }}</option>
                    </select>
                  </div>
                  <button
                    class="mt-8 focus:outline-none hover:bg-indigo-600 mt-2 bg-indigo-500 rounded py-2 px-4 font-semibold text-white"
                    type="button"
                    @click="saveChanges"
                  >Create pack</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <transition-group
        name="list"
        tag="div"
        class="flex flex-wrap -ml-2 -mr-2 -mt-2"
      >
        <div
          v-for="(cardpack, index) in filteredCardpacks"
          :key="index + 1"
          class="w-1/3 p-2 stacked-parent"
        >
          <div class="bg-indigo-500 text-white text-sm rounded border-t-8 border-indigo-600 p-4 cursor-pointer">
            <div class="relative">
              <div class="font-semibold mb-4 text-base">{{ cardpack.name }}</div>
              <div
                class="-mt-3 mb-4 font-bold text-xxs uppercase tracking-wider opacity-25"
                v-if="cardpack.user_id === user_id"
              >
                Created by you
              </div>

              <div
                class="-mt-3 mb-4 font-bold text-xxs uppercase tracking-wider opacity-25"
                v-else
              >
                Created by Kees
              </div>
              <div class="py-1 px-3 font-semibold text-xs bg-indigo-400 right-0 absolute top-0 rounded">
                0 cards
              </div>
            </div>
            <div class="mb-4">
              {{ cardpack.description }}
            </div>

            <div class="flex relative items-center">
              <div>
                <div
                  class="text-xs font-semibold text-white px-3 inline-block py-1 bg-indigo-600 hover:bg-indigo-700 shadow-inner transition rounded-full mr-2 mt-1"
                  v-for="(tag, index) in JSON.parse(cardpack.tags)"
                  :key="index"
                >
                  {{ tag }}
                </div>
              </div>

              <div @click="cardpack.likes++" class="select-none absolute right-0 hover:shadow flex flex-1 justify-end text-xs font-semibold text-white px-3 inline-block py-2 bg-indigo-600 hover:bg-pink-600 transition rounded opacity-50 hover:opacity-100 transition hover:text-pink-200 items-center">
                <span class="font-semibold">{{ cardpack.likes }}</span>
                <i class="ml-2 fa fa-heart text-xs"></i>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>
<script>
import Navbar from '../components/Navbar'
import AuthService from '../services/AuthService'

import axios from 'axios'

export default {
  components: {
    Navbar
  },

  async mounted () {
    let user = await AuthService.getUser()

    this.user_id = user.payload.user.id

    let response = await axios.post(`${location.protocol}//${location.hostname}` + (!process.env.DEV ? '' : (':' + process.env.SERVER_PORT)) + '/api/cardpacks', [], {
      withCredentials: true
    })

    this.cardpacks = response.data.payload
  },

  computed: {
    filteredCardpacks () {
      if (!this.cardpacks) return []

      return this.cardpacks.filter(cardpack => {
        return ((cardpack.name.toLowerCase()).match(this.search.toLowerCase()))
      })
    }
  },

  methods: {
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

      if (this.errors.length === 0) {
        try {
          let request = await axios.post(`${location.protocol}//${location.hostname}` + (!process.env.DEV ? '' : (':' + process.env.SERVER_PORT)) + '/api/cardpacks/create', {
            name: this.cardpack.title,
            description: this.cardpack.description,
            tags: this.cardpack.tags
          }, {
            withCredentials: true
          })

          this.createModalOpen = false

          this.cardpacks.push(request.data.payload)
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
  },

  data () {
    return {
      createModalOpen: false,
      search: '',
      cardpacks: null,
      user_id: null,
      errors: [],
      categories: ['Fantasy', 'TV', 'Technical', 'Comedy', 'Games', 'Food'],
      cardpack: {
        title: '',
        description: '',
        tags: []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(20px);
}

.search {
  &::placeholder {
    @apply .text-white;
  }
}

input,
textarea {
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
