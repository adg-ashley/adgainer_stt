// import http2 from './http2'
import VuexPersistence from 'vuex-persist'
const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})
const state = {
  user: {}
}
const getters = {
  User: (state) => {
    return state.user
  }
}
const mutations = {
  SET: (state, payload) => {
    state.user = payload
  }
}
const actions = {
  authenticate: ({commit}, payload) => {
  }
}
export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true,
  plugins: [vuexLocal.plugin]
}
