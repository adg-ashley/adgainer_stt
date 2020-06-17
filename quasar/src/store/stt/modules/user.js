import http2 from  '../../../store/http2'
import { VueRouter } from 'vue-router';

const state = {
  user: {},
  googleUser: null,
  accountType: null
}

const getters = {
  User: (state) => {
    return state.user
  },
  GoogleUser: (state) => {
    return state.googleUser
  },
  AccountType: (state) => {
    return state.accountType
  },
  Token: (state) => {
    return JSON.stringify(state.user).token
  },
  IsLogin: (state) => {
    if (state.user !== null) {
      return state.user.hasOwnProperty('token') ? true : false 
    } else {
      return false
    }
  },
  HasAdToken: (state) => {
    if (state.user !== null) {
      return (state.user.adToken !== null 
          && state.user.adToken !== '' 
          && state.user.adToken !== undefined) ? true : false 
    }
    else {
      return false
    }
  }
}

const mutations = {

  SET_USER: (state, payload) => {
    state.user = payload
  },
  SET_GOOGLE_USER: (state, payload) => {
    localStorage.setItem('googleToken', payload)
    state.googleUser = payload
  },
  UPDATE_ATTRIBUTE: (state, payload) => {
    for (var key in payload) {
      if (payload.hasOwnProperty(key) && state.user.hasOwnProperty(key)) {
        state.user[key] = payload[key]
      }
    } 
  },
  RESET_USER: (state) => {
    localStorage.clear()
    state.user = null
    state.googleUser = null
    state.accountType = null
  }
}

const actions = {
  login: ({commit}, payload) => {
    return http2.exec(payload) // return promises
  },
  logout: ({commit}) =>{
    commit('RESET_USER')
  },
  send: ({commit}, payload) => {
    return http2.exec(payload)
  },
  reset: ({commit}, payload) => {
    return http2.exec(payload)
  },
  verify: ({commit}, payload) => {
    return http2.exec(payload)
  },
  recover: ({commit}, payload) => {
    return http2.exec(payload)
  },
  list: ({commit}, payload) => {
    http2.exec(payload).then((data) => {
      commit('FETCH_LIST', data)
    }) /* add catch if ever may then */
  },
  update: ({commit, getters, rootGetters}, payload) => {
    http2.exec(payload).then((result) => {
      if (result) {
        commit('UPDATE_ATTRIBUTE', payload.data)
        if (payload.data.hasOwnProperty('CustomizationId')) {
          const userModel = rootGetters['STT/MODEL/UserModel']
          commit('STT/SPEECH/UPDATE_ATTRIBUTE_SETTINGS', { model: userModel.base_model_name, customization_id: userModel.customization_id}, {root: true})
        }
      }
    }).catch((err) => {
      console.log(err)
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
