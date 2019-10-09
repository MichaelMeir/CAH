<template>
  <transition name="list">
    <div
      v-if="open"
      :class="
        'flex items-center fixed mr-6 mb-6 rounded shadow px-4 py-3 font-semibold text-white text-sm bottom-0 right-0 ' +
          (error.color)
      "
    >
      <div>
        {{ message }}
      </div>

      <div
        @click="open = false"
        class="cursor-pointer flex flex-1 justify-end ml-4"
      >
        <svg
          class="h-3 w-3 cursor-pointer"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            class="opacity-75"
            d="M10 8.586L2.929 1.515 1.515 2.929 8.585 10l-7.07 7.071 1.414 1.414L10 11.415l7.071 7.07 1.414-1.414L11.415 10l7.07-7.071-1.414-1.414L10 8.585z"
            fill="#fff"
            fill-rule="evenodd"
          />
        </svg>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  data () {
    return {
      open: false,
      message: null,
      error: {
        color: ''
      },
      interval: 5
    }
  },

  methods: {
    openSnackbar (type, interval, message) {
      this.open = true
      this.type = type
      this.interval = interval
      this.message = message
      this.setColor(type)
      setInterval(() => {
        this.open = false
      }, this.interval * 1000)
    },
    setColor (type) {
      const colors = {
        'error': 'bg-red-500',
        'success': 'bg-green-500',
        'warning': 'bg-orange-500'
      }
      this.error.color = colors[type]
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
</style>
