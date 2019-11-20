<template>
  <div>
    <link
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"
    >
    <div @click="openInterface">{{ user }}</div>
    <div
      class="h-20 mt-3"
      v-if="visible"
    >
      <div class="flex inline p-1 mx-2 bg-black rounded-b-none rounded">
        <div class="flex flex-1 justify-start">
          <div class="p-6 m-1 rounded-t-full rounded-b-full bg-white"></div>
        </div>
        <div class="flex flex-1 justify-center text-white m-1">
          <h1 class="mr-16">{{ user }}</h1>
        </div>
        <div class="flex flex-1 justify-end text-white mr-1">
          <button
            class="absolute text-xs"
            @click="closeInterface()"
          >X</button>
        </div>
      </div>
      <div class="flex flex-1 bg-white h-12 rounded mx-2 rounded-t-none flex inline">
        <div class="flex flex-1 justify-start">
          <button class="bg-indigo-600 py-1 mb-2 px-2 ml-2 mt-3 rounded text-xs">Add Friend</button>
        </div>
        <div class="flex flex-1 justify-end">
          <a><i class="material-icons text-black mt-3 mr-1"> more_vert </i></a>
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
    'user'
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
