<template>
  <div>
    <Navbar />
    <div class="max-w-4xl mx-auto mt-5 flex">
      <div class="w-3/4">
        <div class="flex flex-wrap -ml-2 -mt-2">

          <div
            v-for="(room, index) in rooms"
            :key="index"
            class="w-1/3 p-2"
          >
            <div :class="'bg-' + getRandomColor() + '-500 text-white text-sm rounded p-4'">
              <div class="font-semibold mb-4 text-base">{{ room.name }} {{ index + 1 }}</div>
              <div>Players: <span class="float-right">{{ room.currentPlayers }}/{{ room.maxPlayers }}</span></div>
              <div>Spectators: <span class="float-right">{{ room.spectators }}</span></div>
              <div>Round: <span class="float-right">{{ room.currentRound }}/{{ room.maxRounds }}</span></div>
              <div class="text-xs mt-4">Jantje, Pietje, Kees and 7 more..</div>

              <button
                style="background: rgba(0, 0, 0, 0.2)"
                class="shadow-inner rounded mt-6 mb-1 py-2 block w-full text-xs focus:outline-none font-semibold text-white"
              >Spectate</button>
              <button
                style="background: rgba(0, 0, 0, 0.3)"
                class="shadow-inner rounded py-2 block w-full text-xs focus:outline-none font-semibold text-white"
              >Join</button>
            </div>
          </div>

        </div>
      </div>
      <div class="ml-5 w-1/4">
        <div class="mb-5">
          <button class="text-sm w-full text-indigo-600 border border-indigo-300 focus:outline-none font-semibold bg-indigo-100 rounded px-5 py-3">Create a room</button>
        </div>
        <div class="mb-5">
          <div class="text-white bg-indigo-700 text-sm font-bold px-4 py-4 rounded-t">
            Statistics
          </div>
          <div class="bg-indigo-800 text-indigo-100 py-3 px-4 rounded-b text-sm leading-loose">
            <div><span class="text-white font-bold">0</span> active games</div>
            <div><span class="text-white font-bold">0</span> online users</div>
          </div>
        </div>

        <div>
          <div class="text-white bg-indigo-700 text-sm font-bold px-4 py-4 rounded-t">
            Filter by
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
    getRandomColor () {
      let colors = [
        'red',
        'orange',
        'yellow',
        'green',
        'teal',
        'blue',
        'purple',
        'pink'
      ]

      for (let i = 0; i < 5; i++) {
        let out = colors[Math.floor(Math.random() * colors.length)]
        if (out !== this.previous) {
          this.previous = out
          return out
        }
      }
    }
  },

  data () {
    return {
      previous: '',
      rooms: [
        {
          name: 'Test room',
          currentPlayers: 20,
          maxPlayers: 20,
          spectators: 3,
          currentRound: 3,
          maxRounds: 10,
          previewPlayers: 'Jantje, Pietje, Kees and 5 more..'
        },

        {
          name: 'Test room',
          currentPlayers: 20,
          maxPlayers: 20,
          spectators: 3,
          currentRound: 3,
          maxRounds: 10,
          previewPlayers: 'Jantje, Pietje, Kees and 5 more..'
        },

        {
          name: 'Test room',
          currentPlayers: 20,
          maxPlayers: 20,
          spectators: 3,
          currentRound: 3,
          maxRounds: 10,
          previewPlayers: 'Jantje, Pietje, Kees and 5 more..'
        },

        {
          name: 'Test room',
          currentPlayers: 20,
          maxPlayers: 20,
          spectators: 3,
          currentRound: 3,
          maxRounds: 10,
          previewPlayers: 'Jantje, Pietje, Kees and 5 more..'
        },

        {
          name: 'Test room',
          currentPlayers: 20,
          maxPlayers: 20,
          spectators: 3,
          currentRound: 3,
          maxRounds: 10,
          previewPlayers: 'Jantje, Pietje, Kees and 5 more..'
        }
      ]
    }
  },

  async mounted () {
    let isAuthenticated = await AuthService.isAuthenticated()

    if (!isAuthenticated) {
      this.$router.push('/login')
    }
  }
}
</script>
