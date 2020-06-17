import http2 from  '../../../store/http2'

const state = {
  voice: [],
  voices: {}
}
const getters = {
  Voice: (state) => {
    return state.voice
  },
  Voices: (state) => {
    return state.voices
  }
}
const mutations = {
  SET_VOICES: (state, payload) => {
    state.voices = payload
  }
}
const actions = {
  fetchList: ({commit}, payload) => {
    http2.exec(payload).then((data) => {
      console.log(data)
      commit('SET_VOICES', data)
    })
  },
}
export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
}
