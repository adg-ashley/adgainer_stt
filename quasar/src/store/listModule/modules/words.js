import http2 from './http2'
const state = {
  words: [],
  word: {},
  status: 100
}
const getters = {
  Word: (state) => {
    return state.word
  },
  Words: (state) => {
    return state.words
  },
  Status: (state) => {
    return state.status
  }
}
const mutations = {
  STATUS_INIT: (state) => {
    state.status = 100
  },
  FETCH_LIST: (state, payload) => {
    state.status = 200
    state.words = payload
  },
  FETCH_ITEM: (state, payload) => {
    state.status = 200
    state.word = payload
  },
  REMOVE_LIST_BY_INDEX: (state, payload) => {
    state.words.data.splice(parseInt(payload), 1)
  }
}
const actions = {
  list: ({commit, state}, payload) => {
    http2.exec(payload).then((data) => {
      commit('FETCH_LIST', data)
    })
  },
  show: ({commit}, payload) => {
    http2.exec(payload).then((data) => {
      commit('FETCH_ITEM', data)
    })
  },
  create: ({ commit }, payload) => {
    return new Promise((resolve, reject) => {
      http2.exec(payload)
        .then(() => {
          resolve(commit)
        }).catch((err) => {
          reject(err)
        })
    })
  },
  delete: ({ commit }, payload) => {
    return new Promise((resolve, reject) => {
      http2.exec(payload)
        .then(() => {
          resolve(commit)
        }).catch((err) => {
          reject(err)
        })
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
