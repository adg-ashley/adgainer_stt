import http2 from './http2'
const state = {
  record: [],
  records: {}
}
const getters = {
  Record: (state) => {
    return state.record
  },
  Records: (state) => {
    return state.records
  }
}
const mutations = {
  FETCH_LIST: (state, payload) => {
    state.records = payload
  }
}
const actions = {
  list: ({commit}, payload) => {
    http2.exec(payload).then((data) => {
      commit('FETCH_LIST', data)
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
