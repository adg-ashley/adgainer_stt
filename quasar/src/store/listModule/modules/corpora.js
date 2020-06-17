import http2 from './http2'
const state = {
  corpora: [],
  corpus: {}
}
const getters = {
  Corpus: (state) => {
    return state.corpus
  },
  Corpora: (state) => {
    return state.corpora
  }
}
const mutations = {
  FETCH_LIST: (state, payload) => {
    state.corpora = payload
  },
  FETCH_ITEM: (state, payload) => {
    state.corpus = payload
  }
}
const actions = {
  list: ({commit}, payload) => {
    http2.exec(payload).then((data) => {
      commit('FETCH_LIST', data)
    })
  },
  show: ({commit}, payload) => {
    http2.exec(payload).then((data) => {
      commit('FETCH_ITEM', data)
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
