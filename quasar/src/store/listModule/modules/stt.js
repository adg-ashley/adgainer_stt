// import http2 from './http2'
const state = {
  recognition: {
    stream: null,
    audioSource: null,
    settings: {
      model: 'en-US_BroadbandModel',
      smart_formatting: true,
      format: true, // adds capitals, periods, and a few other things (client-side)
      objectMode: true,
      interim_results: true,
      word_alternatives_threshold: 0.01,
      timestamp: true,
      keywords: [],
      keywords_threshold: undefined,
      speaker_labels: false,
      speakerlessInterim: false,
      resultsBySpeaker: false
    },
    extra: {}
  },
  finalTranscript: [],
  speaker: []
}

const getters = {
  Settings: (state) => {
    return Object.assign({}, state.recognition.settings, state.recognition.extra)
  },
  Stream: (state) => {
    return state.recognition.stream
  },
  Source: (state) => {
    return state.recognition.audioSource
  },
  FinalTranscript: (state) => {
    return state.finalTranscript
  },
  Speaker: (state) => {
    return state.speaker
  }
}
const mutations = {
  RECOGNIZE: (state, payload) => {
    if (payload.audioSource) {
      state.recognition.audioSource = payload.audioSource
    }
    if (payload.stream) {
      state.recognition.stream = payload.stream
    }
    if (payload.settings) {
      state.recognition.extra = payload.settings // Object.assign(state.recognition.settings, payload.settings)
      console.log(state.recognition.settings)
    }
  },
  UPDATE_SETTING: (state, payload) => {
    for (var key in payload) {
      if (payload.hasOwnProperty(key) && state.recognition.settings.hasOwnProperty(key)) {
        state.recognition.settings[key] = payload[key]
      }
    }
  },
  REMOVE_SETTING: (state, payload) => {
  },
  SAVE_TRANSCRIPT: (state, payload) => {
    state.finalTranscript = payload.map(msg => (msg.transcript))
  },
  SAVE_SPEAKER: (state, payload) => {
    state.speaker = payload.map(msg => (msg.speaker))
  },
  NULL_STREAM: (state) => {
    state.stream = undefined
  }
}
const actions = {
  recognize: ({commit}, payload) => {
    commit('RECOGNIZE', payload)
  },
  updateSetting: ({commit}, payload) => {
    commit('UPDATE_SETTING', payload)
  },
  saveTranscript: ({commit}, payload) => {
    commit('SAVE_TRANSCRIPT', payload)
  },
  saveSpeaker: ({commit}, payload) => {
    commit('SAVE_SPEAKER', payload)
  },
  nullStream: ({commit}) => {
    commit('NULL_STREAM')
  }
}
export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
}
