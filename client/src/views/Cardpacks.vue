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
              class="search w-full rounded pl-10 pr-3 py-3 focus:outline-none cursor-pointer appearance-none text-white bg-indigo-600 font-semibold text-sm mb-3"
              placeholder="Search cardpacks"
              v-model="search"
            />
          </div>
          <div class="w-1/4 ml-4">
            <button class="text-sm w-full text-white bg-indigo-600 focus:outline-none font-semibold bg-indigo-100 rounded px-5 py-3">
              <i class="fas fa-plus-circle mr-2"></i> Create cardpack
            </button>
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
          :key="index"
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

  data () {
    return {
      search: '',
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
