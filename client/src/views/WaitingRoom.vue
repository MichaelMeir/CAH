<template>
  <div>
    <transition name="fade">
      <div v-if="leaveModal">
        <div class="fixed z-20 left-0 top-0 bg-black opacity-75 h-full w-full"></div>
        <div class="fixed left-0 right-0 top-0 z-50">
          <div class="p-5 mt-20">
            <div class="h-full flex justify-center items-center relative">
              <div class="w-1/3 bg-white p-10 pb-4 rounded shadow">
                <div
                  @click="leaveModal = false"
                  class="flex flex-1 justify-end -m-5"
                >
                  <svg
                    data-v-a1fbe5b4=""
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 cursor-pointer"
                  >
                    <path
                      data-v-a1fbe5b4=""
                      d="M10 8.586L2.929 1.515 1.515 2.929 8.585 10l-7.07 7.071 1.414 1.414L10 11.415l7.071 7.07 1.414-1.414L11.415 10l7.07-7.071-1.414-1.414L10 8.585z"
                      fill-rule="evenodd"
                      class="close"
                    ></path>
                  </svg>
                </div>
                <h1 class="mt-6 font-bold text-lg uppercase">Are you sure you want to leave?</h1>
                <p class="text-sm">
                  You are about to leave your room. If you leave you will lose
                  all your points
                </p>
                <div class="flex border-t mt-4">
                  <div class="flex mt-4">
                    <button
                      :class="`text-sm bg-${getTheme}-700 hover:bg-${getTheme}-800 text-white font-bold py-2 px-10 rounded focus:outline-none transition mr-4`"
                      @click="leaveRoom"
                    >
                      Yes
                    </button>
                    <button
                      class="text-sm bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none transition"
                      @click="leaveModal = false"
                    >
                      No take me back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div class="max-w-4xl mx-auto mt-1 flex flex-1">
      <div :class="`bg-${getTheme}-800 text-black my-5 rounded-b rounded w-2/3 overflow-y-auto mr-3`">
        <div :class="`text-white bg-${getTheme}-700 text-sm font-bold px-4 py-4 flex rounded-t`">
          <div>Chat</div>
          <div class="flex flex-1 justify-end">
            <i class="text-xs mt-1 fas fa-comments"></i>
          </div>
        </div>
        <div
          ref="chat"
          :class="`bg-${getTheme}-700 text-white h-56 break-words overflow-y-auto m-3 p-3 text-sm leading-loose rounded`"
        >
          <div
            class="flex items-center"
            v-bind:key="index"
            v-for="(message, index) in messages"
          >
            <div v-html="message.message"></div>
            <div class="opacity-25 text-xs flex flex-1 justify-end">
              {{ message.timestamp.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit'
              }) }}
            </div>
          </div>
        </div>

        <div class="flex mb-1">
          <input
            v-on:keyup.enter="sendMessage"
            v-model="message"
            :class="`ml-3 placeholder-white mb-3 px-3 py-2 text-white bg-${getTheme}-700 text-sm focus:outline-none w-4/5 rounded`"
            type="text"
            autofocus
            placeholder="Send message..."
          />
          <button
            v-on:click="sendMessage"
            :class="`bg-${getTheme}-700 hover:bg-${getTheme}-500 font-semibold text-sm focus:outline-none mr-3 ml-3 mb-3 text-white w-1/5 px-6 py-1 rounded transition`"
          >
            Send
          </button>
        </div>
      </div>
      <div :class="`bg-${getTheme}-800 text-white my-5 rounded w-1/3 pb-1 overflow-y-auto`">
        <ul
          class=""
          style="height: 14rem"
        >
          <div :class="`text-white bg-${getTheme}-700 text-sm font-bold px-4 py-4 flex rounded-t`">
            <div>Playerlist</div>
            <div class="flex flex-1 justify-end">
              <i class="text-xs mt-1 fas fa-users"></i>
            </div>
          </div>
          <div class="text-white text-sm">
            <li
              v-bind:key="index"
              v-for="(user, index) in usernames"
              :class="`bg-${getTheme}-700 m-3 rounded cursor-pointer font-semibold`"
            >
              <div>
                <Interface :user="user" />
              </div>
            </li>
          </div>
        </ul>
      </div>
    </div>
    <div class="max-w-4xl mx-auto mt-1 flex flex-1">
      <div class="flex-1">
        <button
          @click="leaveModal = true"
          class="focus:outline-none bg-red-700 hover:bg-red-800 text-sm text-white font-bold py-2 px-4 mr-2 rounded transition"
        >
          <i class="fas fa-sign-out-alt mr-2 opacity-50"></i> Leave game
        </button>
        <button
          @click="cardpacksPopupShown = !cardpacksPopupShown"
          :class="`focus:outline-none bg-${getTheme}-700 hover:bg-${getTheme}-800 text-sm text-white font-bold py-2 px-4 rounded transition`"
        >
          <i class="fas fa-layer-group mr-2 opacity-50"></i> Cardpacks

          <i :class="'fas ml-4 ' + (cardpacksPopupShown ? 'fa-caret-up' : 'fa-caret-down')"></i>
        </button>

        <transition name="fade">
          <div
            v-show="cardpacksPopupShown"
            :class="`bg-${getTheme}-800 shadow-inner text-white rounded mt-6 mr-2 pb-1 mb-8`"
          >
            <div :class="`text-white shadow bg-${getTheme}-700 text-sm font-bold px-4 py-4 rounded-t z-20`">
              <div class="flex items-center">
                <div>Cardpacks</div>
                <div class="flex flex-1 justify-end text-xs font-normal">
                  {{ selectedCardpacks.length }} cardpacks selected
                </div>
              </div>
              <div class="mt-1 font-normal opacity-50">
                Select cardpacks that should be used during the game
              </div>
              <input
                type="text"
                :class="`search w-full rounded mt-4 py-2 px-3 bg-transparent bg-${getTheme}-600 placeholder-${getTheme}-200 focus:outline-none cursor-pointer appearance-none text-white font-semibold text-xs`"
                placeholder="Search cardpacks..."
                v-model="search"
              />
            </div>
            <div
              style="height: 20em"
              class="overflow-y-auto z-10"
            >
              <!-- Cardpack -->
              <div
                v-for="cardpack in filteredCardpacks"
                :key="cardpack.id"
                :class="`bg-${getTheme}-700 cursor-pointer hover:bg-${getTheme}-600 font-semibold rounded text-sm my-4 mx-4`"
              >
                <label class="cursor-pointer py-3 px-4 w-full flex flex-row-reverse items-center">
                  <input
                    :class="`form-checkbox focus:shadow-none text-green-500 text-lg bg-${getTheme}-500 border-none`"
                    type="checkbox"
                    @change="toggleCardpackSelected(cardpack)"
                  >
                  <div :class="`mr-4 bg-${getTheme}-800 text-xs px-2 py-1 rounded text-${getTheme}-100`">
                    {{ cardpack.cardAmount }} cards
                  </div>

                  <div class="flex flex-1 justify-start">
                    <a
                      class="hover:underline"
                      :href="`/cardpacks/${cardpack.uuid}`"
                    >{{ cardpack.name }}</a>
                  </div>
                </label>
              </div>
              <!-- Cardpack -->
            </div>
          </div>
        </transition>
      </div>
      <div class="w-1/3 pl-1">
        <ul :class="`bg-${getTheme}-800 text-white rounded mb-5 overflow-y-auto`">
          <div :class="`text-white bg-${getTheme}-700 text-sm font-bold px-4 py-4 flex rounded-t`">
            <div>Room settings</div>
            <div class="flex flex-1 justify-end">
              <i class="text-xs mt-1 fas fa-cog"></i>
            </div>
          </div>
          <div class="m-3">
            <span class="text-white font-bold text-xs">Maximum players</span>
            <select
              v-model="settings.maximumPlayers"
              :class="`mt-1 text-black form-select w-full bg-${getTheme}-700 text-sm font-semibold cursor-pointer focus:shadow-none border-none text-white`"
            >
              <option
                class="text-black"
                :key="index"
                v-for="index in 9"
              >{{ index + 1 }}</option>
            </select>
          </div>
          <div class="text-black m-3">
            <span class="text-white font-bold text-xs">Time per round (in minutes)</span>
            <input
              type="number"
              min="0"
              :class="`focus:outline-none mt-1 text-black form-text bg-${getTheme}-700 text-sm font-semibold cursor-pointer focus:shadow-none border-none text-white rounded w-full py-2 px-2`"
              v-model="settings.roundtimer"
            />
          </div>
          <div class="text-black m-3">
            <span class="text-white font-bold text-xs">Points to win</span>
            <input
              type="number"
              min="0"
              :class="`focus:outline-none mt-1 text-black form-text bg-${getTheme}-700 text-sm font-semibold cursor-pointer focus:shadow-none border-none text-white rounded w-full py-2 px-2`"
              v-model="settings.points"
            />
          </div>
          <div class="text-black m-3">
            <span class="text-white font-bold text-xs">Amount of blank cards</span>
            <input
              type="number"
              min="0"
              :class="`focus:outline-none mt-1 text-black form-text bg-${getTheme}-700 text-sm font-semibold cursor-pointer focus:shadow-none border-none text-white rounded w-full py-2 px-2`"
              v-model="settings.blankcards"
            />
          </div>
          <div class="text-black m-3">
            <div class="flex mt-5">
              <div class="text-white font-bold text-xs">Room password</div>
              <div class="flex flex-1 justify-end">
                <input
                  type="checkbox"
                  :class="`cursor-pointer form-checkbox text-${getTheme}-600 focus:shadow-none`"
                  v-model="settings.passwordenabled"
                />
              </div>
            </div>
            <input
              v-if="settings.passwordenabled"
              type="password"
              :class="`focus:outline-none mt-1 text-black form-text bg-${getTheme}-700 text-sm font-semibold cursor-pointer focus:shadow-none border-none text-white rounded w-full py-2 px-2 placeholder-${getTheme}-200`"
              v-model="settings.password"
              placeholder="Please enter a password"
            />
          </div>
          <div class="flex mt-5 m-3 mb-6">
            <div class="text-white font-bold text-xs">Votekick enabled</div>
            <div class="flex flex-1 justify-end">
              <input
                type="checkbox"
                :class="`cursor-pointer form-checkbox text-${getTheme}-600 focus:shadow-none`"
                v-model="settings.votekick"
              />
            </div>
          </div>
        </ul>
        <button class="cursor-pointer bg-green-600 text-center hover:bg-green-700 text-white font-bold py-3 text-sm mr-2 rounded ml-auto mr-20 w-full transition focus:outline-none">
          <i class="fas fa-flag-checkered mr-2 opacity-50"></i> Start game
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import Interface from '../components/Interface'
import axios from 'axios'

import ThemeStore from '../store/ThemeStore'

export default {
  components: {
    Interface
  },

  computed: {
    getTheme () {
      return ThemeStore.state.theme
    },

    filteredCardpacks () {
      if (!this.availableCardpacks) return []

      return this.availableCardpacks
        .filter(cardpack => {
          return cardpack.name.toLowerCase().match(this.search.toLowerCase())
        })
        .slice(0, this.limit)
    }
  },

  data () {
    return {
      usernames: [],
      leaveModal: false,
      message: '',
      messages: [],
      methods: {},
      redirected: false,
      visible: false,
      settings: {
        maximumPlayers: 2,
        roundtimer: 30,
        points: 10,
        blankcards: 10,
        passwordenabled: false,
        password: null,
        votekick: false
      },
      search: '',

      cardpacksPopupShown: false,

      availableCardpacks: [],
      selectedCardpacks: []
    }
  },

  methods: {
    openInterface () {
      this.visible = true
    },

    closeInterface () {
      this.visible = false
    },

    onredirect () {
      this.redirected = true
    },

    toggleCardpackSelected (cardpack) {
      if (this.selectedCardpacks.includes(cardpack.id)) {
        this.selectedCardpacks = this.selectedCardpacks.filter(c => {
          return c !== cardpack.id
        })
      } else {
        this.selectedCardpacks.push(cardpack.id)
      }
    },

    changeSettings () {
      const methods = window.socket.import(['roomSettings'])
      methods.roomSettings(this.settings)
    },

    sendMessage () {
      if (this.message) {
        this.message = this.stripHtml(this.message)

        this.message = this.message.replace('gif', '<img style="width: 50%" src="https://media.discordapp.net/attachments/508739822932721664/545264636283453501/image0.gif">')
        this.message = this.message.replace('erdogan', '<img style="width: 50%" src="https://images-ext-2.discordapp.net/external/U4xv8JzMdkYhQg3czRPHbaNzdkaHZhoveVhUNCE2-ZM/https/media.discordapp.net/attachments/547704472646844417/595552405660237844/quality.PNG">')

        const methods = window.socket.import(['sendMessage'])
        methods.sendMessage(this.$cookies.get('jwt'), this.message)
        this.message = ''

        // hacky
        setTimeout(() => {
          let chat = this.$refs.chat
          chat.scrollTop = chat.scrollHeight
        }, 110)
      }
    },

    updateUserList (socket, list) {
      this.usernames = list
      return true
    },

    stripHtml (html) {
      let tmp = document.createElement('DIV')
      tmp.innerHTML = html
      return tmp.textContent || tmp.innerText || ''
    },

    addMessage (socket, message) {
      this.messages.push({
        message: message,
        timestamp: new Date()
      })
    },

    async leaveRoom (socket, reason) {
      console.log(reason)
      if (!this.redirected) {
        this.$router.push('/')
      }
    }
  },

  async mounted () {
    this.methods = window.socket.import(['checkRoom', 'sendMessage'])

    window.socket.export({
      addMessage: this.addMessage,
      updateUserList: this.updateUserList,
      leaveRoom: this.leaveRoomClient
    })

    const response = await this.methods.checkRoom(this.$route.params.token)
    if (!response.room) {
      this.$router.push('/')
    } else {
      this.usernames = response.usernames
    }

    let route = await axios.post(
      `${location.protocol}//${location.hostname}` +
      (!process.env.DEV ? '' : ':' + process.env.SERVER_PORT) +
      '/api/cardpacks',
      [],
      {
        withCredentials: true
      }
    )
    this.availableCardpacks = route.data.payload
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter, .fade-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
