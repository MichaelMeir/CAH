<template>
  <div>
    <div @click="openInterface" class="">{{ user }}</div>
      <div class="w-full h-20" v-if="visible">
        <div class="flex inline p-1 mx-2 bg-gray-600">
          <div class="flex flex-1 justify-start">
            <h1 class="">{{ user }}</h1>
          </div>
        <div class="flex flex-1 justify-end">
          <button class="" @click="closeInterface()">X</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        visible: false
    }
  },

    props: [
      "user"
    ],

    methods: {
      openInterface() {
        this.visible = true
      },

      closeInterface() {
        this.visible = false
      },
    }
  }
</script>