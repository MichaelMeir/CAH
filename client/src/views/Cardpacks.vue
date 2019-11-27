<template>
  <div>
    <CreateCardModal ref="createCardModal" :cardpacks="ownCardpacks" />
    <CreateCardpackModal ref="createCardpackModal"/>
    <div class="max-w-4xl mx-auto mt-5">
      <div class="flex mb-2">
        <div class="flex w-full">
          <div class="w-2/4">
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
              @click="$refs.createCardpackModal.toggleModal()"
            >
              <i class="fas fa-plus-circle mr-2"></i> Create cardpack
            </button>
          </div>
          <div class="w-1/4 ml-4">
            <button
              class="text-sm w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none font-semibold bg-indigo-100 rounded px-5 py-3"
              @click="$refs.createCardModal.toggleModal()"
            >
              <i class="fas fa-plus-circle mr-2"></i> Create card
            </button>
          </div>
        </div>
      </div>
      <div
        v-if="ownCardpacks.length > 0"
        class="mb-4 font-semibold text-indigo-700"
      >
        Your own cardpacks
      </div>
      <transition-group
        v-if="ownCardpacks.length > 0"
        name="list"
        tag="div"
        class="flex flex-no-wrap overflow-x-auto -ml-2 -mr-2 -mt-2"
      >
        <div
          v-for="(cardpack, index) in ownCardpacks"
          :key="index + 1"
          class="w-1/3 p-2 flex-none stacked-parent"
        >
          <div class="border-t-10 border-indigo-600 rounded-t"></div>

          <div
            class="bg-indigo-500 text-white text-sm rounded-b p-4 cursor-pointer"
          >
            <div class="relative">
              <div class="font-semibold mb-4 text-base">
                {{ cardpack.name }}
              </div>
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
                Created by someone else
              </div>
              <div
                class="py-1 px-3 font-semibold text-xs bg-indigo-400 right-0 absolute top-0 rounded"
              >
                {{ cardpack.cardAmount ? cardpack.cardAmount : 0 }} cards
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

              <div
                @click="addLikes(cardpack.id)"
                :class="
                  (liked_packs !== null && liked_packs.includes(cardpack.id)
                    ? 'bg-pink-600 text-pink-200 opacity-100'
                    : '') +
                    ' select-none absolute right-0 hover:shadow flex flex-1 justify-end text-xs font-semibold text-white px-3 inline-block py-2 bg-indigo-600 hover:bg-pink-600 transition rounded opacity-50 hover:opacity-100 transition hover:text-pink-200 items-center'
                "
              >
                <span class="font-semibold">{{ cardpack.likes }}</span>
                <i class="ml-2 fa fa-heart text-xs"></i>
              </div>
            </div>

            <!-- List cards TODO -->
            <button
              @click="$set(cardpack, 'open', !cardpack.open)"
              :class="!cardpack.open ? 'rounded-lg' : 'rounded-t-lg'"
              class="focus:outline-none hover:bg-indigo-700 mt-4 relative bg-indigo-600 p-3 text-xs flex justify-between w-full items-center font-semibold relative z-20"
            >
              <div>Show all cards</div>
              <div class="opacity-50">
                {{ !cardpack.open ? "&#9660;" : "&#9650;" }}
              </div>
            </button>
            <transition name="list-secondary">
              <div
                class="z-10 relative bg-indigo-700 text-xs rounded-b-lg p-3"
                v-if="cardpack.open"
              >
                <ul>
                  <li class="list-disc ml-4">
                    <a class="no-underline hover:underline" href=""
                      >Test card 1</a
                    >
                  </li>
                </ul>
              </div>
            </transition>
            <!-- List cards -->
          </div>
        </div>
      </transition-group>
      <div
        v-if="ownCardpacks.length > 3"
        class="font-semibold text-sm text-gray-600 mt-1 flex flex-1 justify-end items-center"
      >
        Scroll for more <i class="fas fa-long-arrow-alt-right ml-4"></i>
      </div>
      <div
        v-if="ownCardpacks.length > 0"
        class="border-b border-indigo-100 pt-3"
      ></div>
      <transition-group
        name="list"
        tag="div"
        class="flex flex-wrap -ml-2 -mr-2 mt-4"
      >
        <div
          v-for="(cardpack, index) in filteredCardpacks"
          :key="index + 1"
          class="w-1/3 p-2 stacked-parent"
        >
          <div class="border-t-10 border-indigo-600 rounded-t"></div>

          <div
            class="bg-indigo-500 text-white text-sm rounded-b p-4 cursor-pointer"
          >
            <div class="relative">
              <div class="font-semibold mb-4 text-base">
                {{ cardpack.name }}
              </div>
              <div
                class="-mt-3 mb-4 font-bold text-xxs uppercase tracking-wider opacity-25"
                v-if="cardpack.user_id === user_id"
              >
                Created by you
              </div>

              <div
                class="-mt-3 mb-4 font-bold text-xxs uppercase tracking-wider opacity-25"
                v-if="cardpack.user_id !== user_id && cardpack.user_id !== null"
              >
                Created by {{ cardpack.username }}
              </div>
              <div
                class="py-1 px-3 font-semibold text-xs bg-indigo-400 right-0 absolute top-0 rounded"
              >
                {{ cardpack.cardAmount ? cardpack.cardAmount : 0 }} cards
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

              <div
                @click="addLikes(cardpack.id)"
                :class="
                  (liked_packs !== null && liked_packs.includes(cardpack.id)
                    ? 'bg-pink-600 text-pink-200 opacity-100'
                    : '') +
                    ' select-none absolute right-0 hover:shadow flex flex-1 justify-end text-xs font-semibold text-white px-3 inline-block py-2 bg-indigo-600 hover:bg-pink-600 transition rounded opacity-50 hover:opacity-100 transition hover:text-pink-200 items-center'
                "
              >
                <span class="font-semibold">{{ cardpack.likes }}</span>
                <i class="ml-2 fa fa-heart text-xs"></i>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
      <div v-if="cardpacks && cardpacks.length - limit > 0 && !search">
        <div
          @click="loadMoreCardpacks()"
          class="select-none fixed bottom-0 z-10 mb-8 cursor-pointer bg-indigo-200 text-indigo-800 shadow-lg font-semibold text-xs py-2 rounded-full px-5 border border-indigo-300"
        >
          Load
          {{ cardpacks.length - limit > 9 ? "9" : cardpacks.length - limit }}
          of {{ cardpacks.length - limit }} more..
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CreateCardModal from '../components/modals/CreateCardModal'
import CreateCardpackModal from '../components/modals/CreateCardpackModal'
import AuthService from '../services/AuthService'

import axios from 'axios'

export default {
  components: {
    CreateCardModal,
    CreateCardpackModal
  },

  async mounted () {
    let user = await AuthService.getUser()

    this.user_id = user.payload.user.id
    this.liked_packs = JSON.parse(user.payload.user.liked_packs) || []

    let response = await axios.post(
      `${location.protocol}//${location.hostname}` +
        (!process.env.DEV ? '' : ':' + process.env.SERVER_PORT) +
        '/api/cardpacks',
      [],
      {
        withCredentials: true
      }
    )
    this.cardpacks = response.data.payload
  },

  computed: {
    filteredCardpacks () {
      if (!this.cardpacks) return []

      return this.cardpacks
        .filter(cardpack => {
          return cardpack.name.toLowerCase().match(this.search.toLowerCase())
        })
        .slice(0, this.limit)
    },

    ownCardpacks () {
      if (!this.cardpacks) return []

      return this.cardpacks.filter(cardpack => {
        return cardpack.user_id === this.user_id
      })
    }
  },

  methods: {
    loadMoreCardpacks () {
      this.limit = this.limit + 9

      window.scrollTo(0, document.body.scrollHeight)
    },

    async addLikes (id) {
      var curPack = this.cardpacks.find(cardpack => {
        return cardpack.id === id
      })

      let request = await axios.post(
        `${location.protocol}//${location.hostname}` +
          (!process.env.DEV ? '' : ':' + process.env.SERVER_PORT) +
          '/api/cardpacks/addlike',
        {
          currentPack: curPack.id
        },
        {
          withCredentials: true
        }
      )

      if (request.status === 200) {
        if (this.liked_packs.includes(id)) {
          curPack.likes -= 1

          this.liked_packs = this.liked_packs.filter(item => {
            return item !== id
          })
        } else {
          curPack.likes += 1

          this.liked_packs.push(id)
        }
      }
    }
  },

  data () {
    return {
      createModalOpen: false,
      limit: 9,
      search: '',
      cardpacks: null,
      user_id: null,
      liked_packs: []
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

.list-secondary-enter-active,
.list-secondary-leave-active {
  transition: all 0.5s;
}
.list-secondary-enter, .list-secondary-leave-to /* .list-secondary-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(-20px);
}

.search {
  &::placeholder {
    @apply .text-white;
  }
}

input,
textarea,
select {
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
