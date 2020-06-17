import Vue from 'vue'
import Vuex from 'vuex'

// Root Store state, getters, actions, mutations
import state from './state'
import * as actions from './actions'
import * as mutations from './mutations'
import * as getters from './getters'

import ad from './ad'
import stt from './stt'

import createPersistedState from 'vuex-persistedstate'
import VuexPersist from 'vuex-persist';

// const vuexPersisted = new createPersistedState({
//   storage: window.localStorage
// })

Vue.use(Vuex)

// const vuexLocalStorage = new VuexPersist({
//   storage: window.localStorage, // or window.sessionStorage or localForage
//   // Function that passes the state and returns the state with only the objects you want to store.
//   reducer: state => ({
//     user: () => {
//       return state.STT.USER.user
//     }
//   }),
//   //modules: ['STT/USER']
//   // Function that passes a mutation and lets you decide if it should update the state in localStorage.
//   // filter: mutation => (true)
// })

//console.log(vuexLocalStorage.plugin)

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    AD: ad,
    STT: stt
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage,
      reducer: state => ({
          STT: {
            USER: { user: state.STT.USER.user },
            //SPEECH: { 
            //  source: state.STT.SPEECH.source,
            //  settings: state.STT.SPEECH.settings,
            //  editor: state.STT.SPEECH.editor,
            //  transcript: state.STT.SPEECH.transcript,
            //  rawMessages: state.STT.SPEECH.rawMessages
            // },
          },
          language: state.language
        })
    })
  ]
})

if (process.env.DEV && module.hot) {
  module.hot.accept(['./ad', './stt'], () => {
    const newAdModule = require('./ad').default
    const newSttModule = require('./stt').default
    store.hotUpdate({ modules: { ad: newAdModule, stt: newSttModule } })
  })
}

export default store