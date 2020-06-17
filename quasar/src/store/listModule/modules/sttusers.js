import http2 from './http2'
const state = {
  sttuser: [],
  sttusers: {}
}
const getters = {
  sttUser: (state) => {
    return state.sttuser
  },
  sttUsers: (state) => {
    return state.sttusers
  }
}
const mutations = {
  FETCH_LIST: (state, payload) => {
    state.sttusers = payload
  }
}
const actions = {
  list: ({commit}, payload) => {
    http2.exec(payload).then((data) => {
      commit('FETCH_LIST', data)
    })
  }
}
export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
}
