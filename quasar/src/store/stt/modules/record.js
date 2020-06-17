import http2 from  '../../../store/http2'
import ab2str from 'arraybuffer-to-string'

const state = {
  record: {
    rid: undefined,
    name: 'Untitled Record'
  },
  records: {},
  toggleTr1Modal: false
}
const getters = {
  Record: (state) => {
    return state.record
  },
  Records: (state) => {
    return state.records
  },
  ToggleTr1Modal: (state) => {
    return state.toggleTr1Modal
  },
  // TranscriptDataAsBuffer: (state) => {
  //   var buffer = new Uint16Array(state.record.transcriptData.length)
  //   for(var idx = 0, len = state.record.transcriptData; idx < len; ++idx){
  //     buffer[idx] = state.record.transcriptData.charCodeAt(idx)
  //   }
  //   return buffer
  // }
}
const mutations = {
  SET_RECORDS: (state, payload) => {
    state.records = payload
    // record mutation if all record is deleted on the records list
    // if (state.records.hasOwnProperty('data')) {
    //   if (!state.records.data.indexOf(state.record)) {
    //     state.record = {}
    //   }
    // } else {
    //   state.record = {}
    // }
  },
  SET_RECORD: (state, payload) => {
    state.record = payload
  },
  SET_TOGGLETR1MODAL: (state, payload) => {
    state.toggleTr1Modal = payload
  }
}
const actions = {
  fetch: ({commit}, payload) => {
    return http2.exec(payload)
  },
  delete: ({commit}, payload) => {
    return http2.exec(payload)
  },
  bulkDelete: ({commit}, payload) => {
    return http2.exec(payload)
  },
  createOrFind: ({ commit }, payload) => {
    return http2.exec(payload)
  },
  update: ({ commit }, payload) => {
    return http2.exec(payload)
  },
  download: ({ commit }, payload) => {
    return http2.exec(payload)
  }
}
export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
}
