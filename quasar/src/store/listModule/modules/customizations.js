import http2 from './http2'
const state = {
  customizations: [],
  customization: {},
  models: []
}
const getters = {
  Customization: (state) => {
    return state.customization
  },
  Customizations: (state) => {
    return state.customizations
  },
  Models: (state) => {
    return state.models.map(m => {
      const value = m.language + ' (' + m.description + ')'
      return {
        label: value,
        value: m.name
      }
    })
  },
  CustomizationsOptions: (state) => {
    if (state.customizations.data) {
      state.customizations.data.unshift({id: 0, name: 'Language'})
      return state.customizations.data.map(m => {
        const value = m.name
        return {
          label: value,
          value: m.id
        }
      })
    }
  }
}
const mutations = {
  FETCH_ITEM: (state, payload) => {
    state.customization = payload
    return state.customization
  },
  FETCH_LIST: (state, payload) => {
    state.customizations = payload
  },
  FETCH_LIST_MODELS: (state, payload) => {
    // {
    // get this only " { models: [] }"
    // }
    state.models = payload.models
  },
  UPDATE_LIST: (state, payload) => {
    state.customizations[payload.index].inUse = payload.data.inUse
  },
  REMOVE_CUSTOMIZATION: (state, payload) => {
    state.customizations.splice(payload, 1)
  },
  UPDATE_ITEM: (state, payload) => {
    console.log(payload)
    for (var key in payload) {
      if (payload.hasOwnProperty(key)) {
        console.log(key + ' -> ' + payload[key])
        state.customization[key] = payload[key]
      }
    }
  }
}
const actions = {
  list: ({ commit }, payload) => {
    http2.exec(payload).then((data) => {
      commit('FETCH_LIST', data)
    })
  },
  get: ({ commit }, payload) => {
    return http2.exec(payload)
  },
  show: ({ commit }, payload) => {
    http2.exec(payload).then((data) => {
      commit('FETCH_ITEM', data)
    })
  },
  create: ({ commit }, payload) => {
    return http2.exec(payload)
  },
  model: ({ commit }, payload) => {
    http2.exec(payload).then((data) => {
      commit('FETCH_LIST_MODELS', data)
    })
  },
  delete: ({ commit }, payload) => {
    return http2.exec(payload)
  },
  update: ({ commit }, payload) => {
    http2.exec(payload).then((data) => {
      if (payload.data) {
        commit('UPDATE_ITEM', payload.data)
      }
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
