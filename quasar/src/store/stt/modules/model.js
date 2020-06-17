
import http2 from  '../../../store/http2'

const state = {
  models: [],
  model: {}
}

const getters = {

  Models: (state) => {
    return state.models
  },
  ModelOptions:  (state) => {
    return state.models.map((m) => {
      return { label: `${m.name} (${m.language})`, value: m.id }
    })
  },
  UserModel: (state, getters, rootState) => {
    const user = rootState.STT.USER.user
    return state.models.find((e) => {
      if (user.CustomizationId === e.id) {
        state.model = e
        return state.model
      }
    })
  }
 
}

const mutations = {

  SET_MODELS: (state, payload) => {
    state.models = payload 
  }
  
}

const actions = {

  fetchModels: ({ commit, state }, payload) => {
    http2.exec(payload)
      .then((data) => {
        if (data) {
          commit('SET_MODELS', data)
          // console.log(state.model)
          // commit('STT/SPEECH/UPDATE_ATTRIBUTE_SETTINGS', { model: state.model.base_model_name, customization_id: state.model.customization_id}, {root: true})
        }
      }).catch((err) => {
        // reject(err)
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