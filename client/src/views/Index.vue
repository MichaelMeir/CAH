<template>
  <div>
    <Navbar />
    <div class="max-w-4xl mx-auto mt-5 flex">
      <div class="w-3/4">
        <div>
          <transition-group
            name="list"
            tag="div"
            class="flex flex-wrap -ml-2 -mt-2"
          >
            <div
              v-for="(room, index) in rooms"
              :key="room.id"
              class="w-1/3 p-2"
            >
              <div
                :class="'bg-' + getColor(index) + '-500 text-white text-sm rounded p-4 cursor-pointer'"
                @click="rooms = rooms.filter(r => {
        return r.id !== room.id
      })"
              >
                <div class="font-semibold mb-4 text-base flex">
                  <div>{{ room.name }} {{ index + 1 }}</div>
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
                <div class="text-xs mt-4">Jantje, Pietje, Kees and 7 more..</div>

                <button
                  style="background: rgba(0, 0, 0, 0.2)"
                  class="rounded mt-6 mb-1 py-2 block w-full text-xs focus:outline-none font-semibold text-white"
                >Spectate</button>
                <button
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
          <button class="text-sm w-full text-indigo-600 border border-indigo-300 focus:outline-none font-semibold bg-indigo-100 rounded px-5 py-3">Create a room</button>
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
import AuthService from '../services/AuthService'

export default {
  components: {
    Navbar
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
    }
  },

  data () {
    return {
      previous: '',
      colors: [],
      rooms: [
        {
          id: 1,
          name: 'Test room',
          currentPlayers: 20,
          maxPlayers: 20,
          spectators: 3,
          currentRound: 3,
          maxRounds: 10,
          previewPlayers: 'Jantje, Pietje, Kees and 5 more..',
          type: 'public'
        },

        {
          id: 2,
          name: 'Test room',
          currentPlayers: 20,
          maxPlayers: 20,
          spectators: 3,
          currentRound: 3,
          maxRounds: 10,
          previewPlayers: 'Jantje, Pietje, Kees and 5 more..',
          type: 'password'
        },

        {
          id: 3,
          name: 'Test room',
          currentPlayers: 20,
          maxPlayers: 20,
          spectators: 3,
          currentRound: 3,
          maxRounds: 10,
          previewPlayers: 'Jantje, Pietje, Kees and 5 more..',
          type: 'public'
        },

        {
          id: 4,
          name: 'Test room',
          currentPlayers: 20,
          maxPlayers: 20,
          spectators: 3,
          currentRound: 3,
          maxRounds: 10,
          previewPlayers: 'Jantje, Pietje, Kees and 5 more..',
          type: 'public'
        },

        {
          id: 5,
          name: 'Test room',
          currentPlayers: 20,
          maxPlayers: 20,
          spectators: 3,
          currentRound: 3,
          maxRounds: 10,
          previewPlayers: 'Jantje, Pietje, Kees and 5 more..',
          type: 'password'
        },
        {
          id: 6,
          name: 'Test room',
          currentPlayers: 20,
          maxPlayers: 20,
          spectators: 3,
          currentRound: 3,
          maxRounds: 10,
          previewPlayers: 'Jantje, Pietje, Kees and 5 more..',
          type: 'password'
        }
      ]
    }
  },

  created () {
    this.getRandomColors(this.rooms.length)
  },
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
</style>
