<template>
  <div class="relative select-none">
    <div @click="openInterface">{{ user }}</div>
    <div
      class="h-20 z-20 w-full absolute"
      v-if="visible"
    >
      <div class="flex inline p-2 mx-2 bg-black rounded-b-none rounded">
        <div class="flex flex-1 justify-start">
          <div
            :style="`background-image: url(${avatar})`"
            class="p-6 m-1 rounded-t-full rounded-b-full bg-white bg-cover"
          ></div>
        </div>
        <div class="flex flex-1 justify-center text-white ml-3 mt-1">
          <h1 class="mr-16">{{ user }}</h1>
        </div>
        <div class="flex flex-1 justify-end text-white mr-1">
          <button
            class="absolute text-xs font-semibold focus:outline-none"
            @click="closeInterface()"
          >x</button>
        </div>
      </div>
      <div class="flex flex-1 bg-white h-12 rounded mx-2 rounded-t-none flex inline">
        <div class="flex flex-1 justify-start">
          <button class="bg-indigo-600 font-semibold mb-2 px-4 ml-2 mt-3 rounded text-xs">Add friend</button>
        </div>
        <div class="flex flex-1 justify-end">
          <a><i class="fas fa-ellipsis-v text-black mt-5 mr-3"></i></a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      visible: false
    }
  },

  props: [
    'user',
    'avatar'
  ],

  methods: {
    openInterface () {
      this.visible = true
    },

    closeInterface () {
      this.visible = false
    }
  }
}
</script>
