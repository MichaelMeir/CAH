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
            <button class="text-sm w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none font-semibold bg-indigo-100 rounded px-5 py-3" @click="createModalOpen = !createModalOpen">
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
                Please fill in all the fields to create your cardpack!.

                <div class="mt-4 border-t border-indigo-200 pt-4">
                  <div>
                    <label>Cardpack Title</label>
                    <input 
                    v-model="cardpack.title"             
                    @keydown="clearError('cardpack.title')"
                    :class="(hasError('cardpack.title') ? 'has-error' : '') + 'focus:outline-none mt-1 block w-full py-1 px-2 text-base rounded border border-indigo-200'">
                      <div
                      v-if="hasError('cardpack.title')"
                      class="error-message"
                      >
                      {{ getError('cardpack.title') }}
                      </div>
                  </div>
                  <div class="my-4">
                    <label class="mt-4">Cardpack Description</label>
                    <textarea 
                    v-model="cardpack.description" 
                    :class="(hasError('cardpack.description') ? 'has-error' : '') + 'focus:outline-none mt-1 block w-full py-1 px-2 text-base rounded border border-indigo-200'"/>
                  </div>
                  <div>
                    <label class="mt-4">Cardpack Tags</label>
                    <select v-model="cardpack.tags" multiple class="mt-1 block w-full py-1 px-2 text-base rounded border border-indigo-200 text-gray-700">
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
              <div class="py-1 px-3 font-semibold text-xs bg-indigo-400 right-0 absolute top-0 rounded">
                {{ cardpack.cards }} <span>{{ ((cardpack.cards == 1) ? 'card' : 'cards') }}</span>
              </div>
            </div>
            <div class="mb-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, tempora voluptas! Magni, modi temporibus provident nostrum autem dolore voluptate accusamus corrupti tempore, omnis explicabo ex. Modi sit natus facilis, numquam veritatis placeat omnis debitis est, veniam eum atque, libero iste.
            </div>

            <div class="flex relative items-center">
              <div>
                <div
                  class="text-xs font-semibold text-white px-3 inline-block py-1 bg-indigo-600 hover:bg-indigo-700 shadow-inner transition rounded-full mr-2 mt-1"
                  v-for="(category, index) in cardpack.categories"
                  :key="index"
                >
                  {{ category.name }}
                </div>
              </div>

              <div class="absolute right-0 flex flex-1 justify-end text-xs font-semibold text-white px-3 inline-block py-2 bg-indigo-600 hover:bg-pink-600 transition rounded opacity-50 hover:opacity-100 transition hover:text-pink-200">
                <i class="fa fa-heart text-xs"></i>
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

export default {
  components: {
    Navbar
  },

  computed: {
    filteredCardpacks () {
      return this.cardpacks.filter(cardpack => {
        return ((cardpack.name.toLowerCase()).match(this.search.toLowerCase()))
      })
    }
  },

  methods: {
    async saveChanges(){
      if (this.cardpack.title) {
        this.errors.push({
          field: 'cardpack.title',
          error: 'Title field cant be empty'
        })
      }

      if (this.cardpack.description) {
        this.errors.push({
          field: 'cardpack.description',
          error: 'Description field cant be empty'
        })
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
      errors: [],
      categories: ['Fantasy', 'TV', 'Technical', 'Comedy', 'Games', 'Food'],
      cardpack: {
        title: '',
        description: '',
        tags: [],
      },
      cardpacks: [
        {
          id: 1,
          name: 'Cardpack 1',
          cards: 4,
          categories: [
            {
              name: 'Fantasy'
            },
            {
              name: 'TV'
            }
          ]
        },
        {
          id: 2,
          name: 'Cardpack 2',
          cards: 2,
          categories: [
            {
              name: 'Technical'
            }
          ]
        },
        {
          id: 3,
          name: 'Cardpack 3',
          cards: 1,
          categories: [
            {
              name: 'Comedy'
            }
          ]
        },
        {
          id: 4,
          name: 'Cardpack 4',
          cards: 1,
          categories: [
            {
              name: 'TV'
            }
          ]
        },
        {
          id: 4,
          name: 'Cardpack 5',
          cards: 1,
          categories: [
            {
              name: 'Games'
            }
          ]
        },
        {
          id: 4,
          name: 'Cardpack 6',
          cards: 2,
          categories: [
            {
              name: 'Food'
            }
          ]
        }
      ]
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
</style>
