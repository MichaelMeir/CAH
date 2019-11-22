<template>
  <div>
    <div
      @click="open = false"
      class="absolute z-20 left-0 top-0 bg-white opacity-50 h-full w-full"
      v-if="open"
    ></div>
    <div class="absolute left-0 right-0 top-0 z-50" v-if="open">
      <div
        class="shadow bg-indigo-100 text-indigo-800 border border-indigo-200 rounded max-w-2xl mx-auto flex flex-col mt-32 p-4"
      >
        <div class="text-base font-semibold">
          <div
            class="text-base font-semibold flex items-center text-indigo-800"
          >
            <div>Creating a card</div>
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
          <div>
            <div class="mt-3 text-sm font-normal">
              Please fill in all the fields to create your card

              <div class="mt-4 border-t border-indigo-200 pt-4">
                <div class="mb-4">
                  <label>Card text</label>
                  <textarea
                    v-model="card.text"
                    @keydown="clearError('card.text')"
                    :class="
                      (hasError('card.text') ? 'has-error' : '') +
                        ' focus:outline-none mt-1 block w-full py-1 px-2 text-sm rounded h-24 border border-indigo-200'
                    "
                  ></textarea>
                  <div v-if="hasError('card.text')" class="error-message">
                    {{ getError("card.text") }}
                  </div>
                </div>

                <div class="mb-4">
                  <label class="mt-4">Attach to your cardpack(s)</label>
                  <select
                    @change="clearError('card.cardpacks')"
                    v-model="card.cardpacks"
                    multiple
                    :class="
                      (hasError('card.cardpacks') ? 'has-error' : '') +
                        ' focus:outline-none mt-1 block w-full py-1 px-2 text-sm rounded border border-indigo-200 text-gray-700'
                    "
                  >
                    <option disabled selected>Select cardpack(s)</option>
                    <option
                      v-bind:key="cardpack.id"
                      :value="cardpack.id"
                      v-for="cardpack in cardpacks"
                      >{{ cardpack.name }} ({{
                        JSON.parse(cardpack.tags).join(", ")
                      }}) - {{ cardpack.likes }} likes</option
                    >
                  </select>
                  <div v-if="hasError('card.cardpacks')" class="error-message">
                    {{ getError("card.cardpacks") }}
                  </div>
                </div>

                <div class="mb-4">
                  <label class="align-middle cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      v-model="card.isWhite"
                      class="mr-2 form-checkbox text-indigo-500 align-middle"
                    />
                    This card is a white card
                  </label>
                </div>
              </div>
              <button
                class="mt-8 focus:outline-none hover:bg-indigo-600 mt-2 bg-indigo-500 rounded py-2 px-4 font-semibold text-white"
                type="button"
                @click="saveChanges"
              >
                Create card
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  props: ['cardpacks'],

  data () {
    return {
      open: false,
      errors: [],
      card: {
        text: '',
        isWhite: false,
        cardpacks: []
      }
    }
  },

  methods: {
    async saveChanges () {
      if (!this.card.text) {
        this.errors.push({
          field: 'card.text',
          error: 'Please enter some text'
        })
      }

      if (this.card.cardpacks.length === 0) {
        this.errors.push({
          field: 'card.cardpacks',
          error: 'Please select a cardpack'
        })
      }
      if (this.errors.length === 0) {
        let request = await axios.post(`${location.protocol}//${location.hostname}` + (!process.env.DEV ? '' : (':' + process.env.SERVER_PORT)) + '/api/cards/create', {
          text: this.card.text,
          isWhite: this.card.isWhite,
          cardpacks: this.card.cardpacks
        }, {
          withCredentials: true
        })

        if (request.status === 200) {
          this.open = false

          this.card.cardpacks.forEach(index => {
            this.$parent.ownCardpacks.find(cardpack => {
              return cardpack.id === index
            }).cardAmount += 1
          })

          this.card = {
            cardpacks: []
          }

          this.$parent.$parent.$refs.toast.openToast('success', 5, 'Your card has been created successfully')
        }
      }
    },

    toggleModal () {
      this.open = !this.open
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
<style scoped>
.error-message {
  @apply text-red-500;
}
.has-error {
  @apply border-red-500;
}
</style>
