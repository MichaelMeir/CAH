<template>
  <div>
    <CreateCardModal
      ref="createCardModal"
      :cardpacks="ownCardpacks"
    />
    <CreateCardpackModal ref="createCardpackModal" />
    <div class="max-w-4xl mx-auto mt-5">
      <div class="flex mb-2">
        <div class="flex w-full">
          <div :class="`flex w-2/4 bg-${getTheme}-700 rounded`">
            <i :class="`ml-4 text-${getTheme}-400 text-white text-base fas fa-search my-auto`"></i>
            <input
              type="text"
              :class="`search w-full rounded pl-5 pr-3 bg-transparent bg-${getTheme}-700 focus:outline-none cursor-pointer appearance-none text-white font-semibold text-sm`"
              placeholder="Search cardpacks"
              v-model="search"
            />
          </div>
          <div class="w-1/4 ml-4">
            <button
              :class="`text-sm w-full text-white bg-${getTheme}-600 hover:bg-${getTheme}-700 focus:outline-none font-semibold bg-${getTheme}-100 rounded px-5 py-3`"
              @click="toggleCreateCardpackModal"
            >
              <i class="fas fa-plus-circle mr-2"></i> Create cardpack
            </button>
          </div>
          <div class="w-1/4 ml-4">
            <button
              :class="`text-sm w-full text-white bg-${getTheme}-600 hover:bg-${getTheme}-700 focus:outline-none font-semibold bg-${getTheme}-100 rounded px-5 py-3`"
              @click="toggleCreateCardModal"
            >
              <i class="fas fa-plus-circle mr-2"></i> Create card
            </button>
          </div>
        </div>
      </div>
      <div
        v-if="ownCardpacks.length > 0"
        :class="`my-4 font-semibold text-${getTheme}-700`"
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
          <div :class="`border-t-10 border-${getTheme}-600 rounded-t`"></div>

          <div :class="`bg-${getTheme}-500 text-white text-sm rounded-b p-4 cursor-pointer`">
            <div class="flex mb-4">
              <div class="font-semibold text-base">
                {{ cardpack.name }}
              </div>
              <div class="flex flex-1 justify-end">
                <div :class="`py-1 px-3 font-semibold text-xs bg-${getTheme}-400 rounded`">
                  {{ cardpack.cardAmount ? cardpack.cardAmount : 0 }} cards
                </div>
              </div>
            </div>
            <div
              :class="`-mt-3 mb-4 font-bold text-xxs uppercase tracking-wider text-${getTheme}-lightest`"
              v-if="cardpack.user_id === user_id"
            >
              Created by you
            </div>

            <div
              :class="`-mt-3 mb-4 font-bold text-xs uppercase tracking-wider text-${getTheme}-lightest`"
              v-else
            >
              Created by someone else
            </div>
            <div class="mb-4">
              {{ cardpack.description }}
            </div>

            <div class="flex items-center">
              <div>
                <div
                  :class="`text-xs font-semibold text-white px-3 inline-block py-1 bg-${getTheme}-600 hover:bg-${getTheme}-700 shadow-inner transition rounded-full mr-2 mt-1`"
                  v-for="(tag, index) in JSON.parse(cardpack.tags)"
                  :key="index"
                >
                  {{ tag }}
                </div>
              </div>
              <div class="flex flex-1 justify-end">
                <div
                  @click="addLikes(cardpack.id)"
                  :class="
                    (liked_packs !== null && liked_packs.includes(cardpack.id)
                      ? 'bg-pink-600 text-pink-200'
                      : '') +
                      ` hover:shadow text-xs font-semibold text-white px-3 inline-block py-2 bg-${getTheme}-600 hover:bg-pink-600 rounded transition hover:text-pink-200 items-center`
                  "
                >
                  <span class="font-semibold">{{ cardpack.likes }}</span>
                  <i class="ml-2 fa fa-heart text-xs"></i>
                </div>
              </div>
            </div>

            <!-- List cards TODO -->
            <button
              @click="$set(cardpack, 'open', !cardpack.open)"
              :class="`focus:outline-none hover:bg-${getTheme}-700 mt-4 bg-${getTheme}-600 p-3 text-xs flex justify-between w-full items-center font-semibold z-20 ` + (!cardpack.open ? 'rounded-lg' : 'rounded-t-lg')"
            >
              <div>Show all cards</div>
              <div :class="`text-${getTheme}-lightest`">
                {{ !cardpack.open ? "&#9660;" : "&#9650;" }}
              </div>
            </button>
            <transition name="list-secondary">
              <div
                :class="`z-10 relative bg-${getTheme}-700 text-xs rounded-b-lg p-3`"
                v-if="cardpack.open"
              >
                <ul>
                  <li class="list-disc ml-4">
                    <a
                      class="no-underline hover:underline"
                      href=""
                    >Test card 1</a>
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
        :class="`border-b border-${getTheme}-100 pt-3`"
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
          <div :class="`border-t-10 border-${getTheme}-600 rounded-t`"></div>

          <div :class="`bg-${getTheme}-500 text-white text-sm rounded-b p-4 cursor-pointer`">
            <div class="flex mb-4">
              <div class="font-semibold text-base w-2/3">
                {{ cardpack.name }}
              </div>

              <div
                class="-mt-3 mb-4 font-bold text-xxs uppercase tracking-wider opacity-25"
                v-if="cardpack.user_id !== user_id && cardpack.user_id !== null"
              >
                Created by {{ cardpack.username }}
              </div>
              <div class="flex flex-1 justify-end h-6">
                <div :class="`py-1 px-3 font-semibold text-xs bg-${getTheme}-400 rounded`">
                  {{ cardpack.cardAmount ? cardpack.cardAmount : 0 }} cards
                </div>
              </div>
            </div>
            <div
              :class="`-mt-3 mb-4 font-bold text-xxs uppercase tracking-wider text-${getTheme}-lightest`"
              v-if="cardpack.user_id === user_id"
            >
              Created by you
            </div>
            <div class="mb-4">
              {{ cardpack.description }}
            </div>

            <div class="flex items-center">
              <div>
                <div
                  :class="`text-xs font-semibold text-white px-3 inline-block py-1 bg-${getTheme}-600 hover:bg-${getTheme}-700 shadow-inner transition rounded-full mr-2 mt-1`"
                  v-for="(tag, index) in JSON.parse(cardpack.tags)"
                  :key="index"
                >
                  {{ tag }}
                </div>
              </div>
              <div class="flex flex-1 justify-end">
                <div
                  @click="addLikes(cardpack.id)"
                  :class="
                    (liked_packs !== null && liked_packs.includes(cardpack.id)
                      ? 'bg-pink-600 text-pink-200'
                      : '') +
                      ` select-none hover:shadow text-xs font-semibold text-white px-3 inline-block py-2 bg-${getTheme}-600 hover:bg-pink-600 transition rounded transition hover:text-pink-200 items-center`
                  "
                >
                  <span class="font-semibold">{{ cardpack.likes }}</span>
                  <i class="ml-2 fa fa-heart text-xs"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
      <div v-if="cardpacks && cardpacks.length - limit > 0 && !search">
        <div
          @click="loadMoreCardpacks()"
          :class="`select-none fixed bottom-0 z-10 mb-8 cursor-pointer bg-${getTheme}-200 text-${getTheme}-800 shadow-lg font-semibold text-xs py-2 rounded-full px-5 border border-${getTheme}-300`"
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
import ThemeStore from '../store/ThemeStore'

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
    getTheme () {
      return ThemeStore.state.theme
    },

    isVerified () {
      return !this.$parent.$refs.navbar.user.verification
    },

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
    toggleCreateCardpackModal () {
      if (!this.isVerified) {
        this.$parent.$refs.toast.openToast('danger', 5, 'You must verify your account to perform this action.')
        return
      }

      this.$refs.createCardpackModal.toggleModal()
    },

    toggleCreateCardModal () {
      if (!this.isVerified) {
        this.$parent.$refs.toast.openToast('danger', 5, 'You must verify your account to perform this action.')
        return
      }

      this.$refs.createCardModal.toggleModal()
    },

    loadMoreCardpacks () {
      this.limit = this.limit + 9

      window.scrollTo(0, document.body.scrollHeight)
    },

    async addLikes (id) {
      if (!this.isVerified) {
        this.$parent.$refs.toast.openToast('danger', 5, 'You must verify your account to perform this action.')
        return
      }

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
  max-height: 200px;
}
.list-secondary-enter, .list-secondary-leave-to /* .list-secondary-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(-20px);
  max-height: 0px;
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
