<template>
  <div>
    <Navbar />
    <div class="max-w-4xl mx-auto mt-5">
      <div class="flex flex-wrap -ml-2 -mr-2 -mt-2">
        <div
          v-for="(cardpack, index) in cardpacks"
          :key="index"
          class="w-1/4 p-2 stacked-parent"
        >
          <div class="flex flex-col-reverse">
            <div
              v-for="(stacked, index) in cardpack.cards"
              :key="index"
              v-if="index < 3"
              :class="`stacked-bar bg-purple-${index + 6}00`"
            >
            </div>
          </div>
          <div class="bg-purple-500 text-white text-sm rounded-b p-4 cursor-pointer">
            <div class="font-semibold mb-4 text-base">{{ cardpack.name }}</div>
            <div>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed consequatur cupiditate minima ipsam amet ad, ut id! Sint expedita atque veritatis quisquam esse quae optio perspiciatis nihil ea tenetur, ipsa odio illum.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Navbar from '../components/Navbar'

export default {
  components: {
    Navbar
  },

  data () {
    return {
      cardpacks: [
        {
          id: 1,
          name: 'Cardpack 1',
          cards: 4
        },
        {
          id: 2,
          name: 'Cardpack 2',
          cards: 2
        },
        {
          id: 3,
          name: 'Cardpack 3',
          cards: 1
        },
        {
          id: 4,
          name: 'Cardpack 4',
          cards: 1
        },
        {
          id: 4,
          name: 'Cardpack 5',
          cards: 1
        },
        {
          id: 4,
          name: 'Cardpack 6',
          cards: 2
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.stacked-parent {
  .stacked-bar {
    &:last-child {
      @apply .rounded-t;
    }
    height: 10px;
  }
}

.height-inherit {
  height: inherit;
}
</style>
