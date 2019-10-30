<template>
  <transition name="list">
    <div
      v-show="open"
      :class="`flex items-center fixed z-50 mr-6 mb-6 rounded shadow px-4 py-3 font-semibold text-white text-sm bottom-0 right-0 border-l-6 border-${getType()}-600 bg-${getType()}-500`"
    >
      <div>
        {{ message }}
      </div>

      <div
        @click="open = false"
        class="cursor-pointer flex flex-1 justify-end ml-8"
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
          /></svg>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  computed: {
    types () {
      return [
        {
          type: 'error',
          className: 'red'
        }
      ]
    }
  },

  data () {
    return {
      open: false,
      message: null,
      type: 'danger',
      interval: 5
    }
  },

  methods: {
    getType () {
      const types = [
        {
          type: 'primary',
          className: 'indigo'
        },
        {
          type: 'danger',
          className: 'red'
        },
        {
          type: 'success',
          className: 'green'
        },
        {
          type: 'warning',
          className: 'orange'
        }
      ]

      return types.find(type => {
        return type.type === this.type
      }).className
    },

    openToast (type, interval, message) {
      this.open = true
      this.type = type
      this.interval = interval
      this.message = message

      setInterval(() => {
        this.open = false
      }, (this.interval * 1000))
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
