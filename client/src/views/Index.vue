<template>
  <div>
    <Navbar />
    <Snackbar ref="snackbar" />
    <div class="max-w-4xl mx-auto mt-5 flex">
      <div class="w-3/4">
        <div>
          <div
            class="font-semibold text-indigo-700"
            v-if="!filteredRooms.length > 0"
          >
            There are no rooms available.
          </div>
          <transition-group
            name="list"
            tag="div"
            class="flex flex-wrap -ml-2 -mt-2"
          >
            <div
              v-for="(room, index) in filteredRooms"
              :key="index + 1"
              class="w-1/3 p-2"
            >
              <div :class="'bg-' + getColor(room.id) + '-500 text-white text-sm rounded p-4 cursor-pointer'">
                <div class="font-semibold mb-4 text-base flex">
                  <div>{{ room.name }}</div>
                  <div class="flex flex-1 justify-end">
                    <i
                      v-if="room.type === 'public'"
                      class="text-xs mt-1 fas fa-lock-open"
                    ></i>
                    <i
                      v-if="room.type === 'password'"
                      class="text-xs mt-1 fas fa-lock"
                    ></i>
                  </div>
                </div>
                <div>Players: <span class="float-right">{{ room.currentPlayers }}/{{ room.maxPlayers }}</span></div>
                <div>Spectators: <span class="float-right">{{ room.spectators }}</span></div>
                <div>Round: <span class="float-right">{{ room.currentRound }}/{{ room.maxRounds }}</span></div>
                <div class="text-xs mt-4">{{ room.previewPlayers }}</div>

                <button
                  style="background: rgba(0, 0, 0, 0.2)"
                  class="rounded mt-6 mb-1 py-2 block w-full text-xs focus:outline-none font-semibold text-white"
                >Spectate</button>
                <button
                  @click="joinRoom(room.id)"
                  style="background: rgba(0, 0, 0, 0.3)"
                  class="rounded py-2 block w-full text-xs focus:outline-none font-semibold text-white"
                >Join</button>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
      <div class="ml-5 w-1/4">
        <div class="mb-5">
          <button
            @click="createRoom()"
            class="text-sm w-full text-indigo-600 border border-indigo-300 focus:outline-none font-semibold bg-indigo-100 rounded px-5 py-3"
          >Create a room</button>
        </div>
        <div class="flex mb-2">
          <i
            style="margin-top: 17px"
            class="opacity-75 ml-4 align-bottom text-white absolute text-xs mt-1 fas fa-search"
          ></i>
          <input
            type="text"
            class="search w-full rounded pl-10 pr-3 py-3 focus:outline-none cursor-pointer appearance-none text-white bg-indigo-700 font-semibold text-sm mb-3"
            placeholder="Search rooms"
            v-model="search"
          />
        </div>
        <div class="mb-5">
          <div class="text-white bg-indigo-700 text-sm font-bold px-4 py-4 flex rounded-t">
            <div>Statistics</div>
            <div class="flex flex-1 justify-end">
              <i class="text-xs mt-1 fas fa-chart-pie"></i>
            </div>
          </div>
          <div class="bg-indigo-800 text-indigo-100 py-3 px-4 rounded-b text-sm leading-loose">
            <div><span class="text-white font-bold">0</span> active games</div>
            <div><span class="text-white font-bold">0</span> online users</div>
          </div>
        </div>

        <div>
          <div class="text-white bg-indigo-700 text-sm font-bold px-4 py-4 rounded-t flex">
            <div>Filter by</div>
            <div class="flex flex-1 justify-end">
              <i class="text-xs mt-1 fas fa-filter"></i>
            </div>
          </div>
          <div class="bg-indigo-800 text-indigo-100 py-4 px-3 rounded-b text-sm leading-loose">
            <select class="w-full rounded px-3 py-1 focus:outline-none shadow-inner cursor-pointer appearance-none text-indigo-100 bg-indigo-900 font-semibold text-xs mb-3">
              <option>All players</option>
              <option>Most players</option>
              <option>Least players</option>
            </select>
            <select class="w-full rounded px-3 py-1 focus:outline-none shadow-inner cursor-pointer appearance-none text-indigo-100 bg-indigo-900 font-semibold text-xs mb-3">
              <option>All spectators</option>
              <option>Most spectators</option>
              <option>Least spectators</option>
            </select>
            <select class="w-full rounded px-3 py-1 focus:outline-none shadow-inner cursor-pointer appearance-none text-indigo-100 bg-indigo-900 font-semibold text-xs mb-3">
              <option>All rooms</option>
              <option>Public rooms</option>
              <option>Private rooms</option>
            </select>

            <select class="w-full rounded px-3 py-1 focus:outline-none shadow-inner cursor-pointer appearance-none text-indigo-100 bg-indigo-900 font-semibold text-xs">
              <option>Created anytime</option>
              <option>Recently created</option>
              <option>Longest created</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Navbar from '../components/Navbar'
import Snackbar from '../components/Snackbar'

export default {
  components: {
    Navbar,
    Snackbar
  },

  computed: {
    filteredRooms () {
      return this.rooms.filter(room => {
        return (room.name.toLowerCase().match(this.search.toLowerCase())) || (room.previewPlayers.toLowerCase().match(this.search.toLowerCase()))
      })
    }
  },

  mounted () {
    this.$refs.snackbar.openSnackbar('error', 5, 'This is a test snackbar message')
  },

  methods: {
    getColor (index) {
      let color = this.colors[index]
      if (color) {
        return color
      }
      return 'indigo'
    },

    getRandomColors (amount, inrow = 3, tries = 3) {
      let availableColors = [
        'red',
        'orange',
        'yellow',
        'green',
        'teal',
        'blue',
        'purple',
        'indigo',
        'pink'
      ]

      let get = (x, y) => {
        let index = x + (x * y)
        if (index < 0 || index > this.colors.length) {
          return null
        }
        return this.colors[index]
      }

      for (let i = 0; i < amount; i++) {
        const x = i % inrow
        const y = Math.floor(i / inrow)
        const sides = [get(x, y - 1), get(x, y + 1), get(x - 1, y), get(x + 1, y)]
        for (let j = 0; j < tries; j++) {
          let accepted = true
          const color = availableColors[Math.floor(Math.random() * availableColors.length)]
          for (let k = 0; k < sides.length; k++) {
            if (color === sides[k]) {
              accepted = false
            }
          }
          if (accepted) {
            this.colors[i] = color
            continue
          }
        }
      }
    },

    async createRoom () {
      const jwt = this.$cookies.get('jwt')
      if (!jwt) {
        console.error('could not get jwt token')
        return
      }
      const methods = window.socket.import([
        'createRoom'
      ])
      const response = await methods.createRoom(jwt)
      if (response.room) {
        this.$router.push('/waitingroom/' + response.room)
      } else {
        console.error('Server failed to supply game room code')
      }
    },

    async joinRoom (roomId) {
      const jwt = this.$cookies.get('jwt')
      if (!jwt) {
        console.error('could not get jwt token')
        return
      }
      const methods = window.socket.import([
        'joinRoom'
      ])
      const response = await methods.joinRoom(jwt, roomId)
      if (response.room) {
        this.$router.push('/waitingroom/' + response.room)
      } else {
        console.error(response.message)
        this.updateRooms()
      }
    },

    async updateRooms () {
      const methods = window.socket.import([
        'getRooms'
      ])
      this.rooms = await methods.getRooms()
      this.getRandomColors(this.rooms.length)
    }
  },

  data () {
    return {
      search: '',
      previous: '',
      colors: [],
      rooms: []
    }
  },

  async created () {
    this.updateRooms()
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
