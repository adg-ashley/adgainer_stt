import http2 from './http2'
const state = {
  campaigns: [],
  campaign: {}
}
const getters = {
  Campaign: (state) => {
    return state.campaign
  },
  Campaigns: (state) => {
    return state.campaigns
  }
}
const mutations = {
  FETCH_LIST: (state, payload) => {
    state.campaigns = payload
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
