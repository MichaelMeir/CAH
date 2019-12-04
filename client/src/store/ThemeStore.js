import Vuex from 'vuex'
import Vue from 'vue'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
  plugins: [createPersistedState()],

  state: {
    theme: 'indigo'
  },

  mutations: {
    changeTheme (state, color) {
      state.theme = color
    },

    resetTheme (state) {
      state.theme = 'indigo'
    }
  }
})

export default store
