import http2 from  '../../../store/http2'
import recognizeMicrophone from 'watson-speech/speech-to-text/recognize-microphone'
import recognizeFile from 'watson-speech/speech-to-text/recognize-file'

const state = {
  stream: undefined,
  transcript: '', // final transcript without label,
  //transcriptWithLabel: '', // final transcript label
  messages: [], // formatted messages
  rawMessages: [], // not formatted,
  finalMessages: [], // not formated from final and current interim
  speaker: [],
  source: {
    type: undefined,
    files: [],
    url: ''
  },
  editor: '',
  isEditor: true, // additional settings,
  speakerLabel: false,
  wordAlternatives: false,
  settings: {
    token: '',
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
    resultsBySpeaker: false,
    customization_id: 'd7972452-737e-48e7-aa51-58054c4485b5' // english customization
  }
}

const getters = {

  Source: (state) => {
    return state.source
  },
  SourceType: (state) => {
    return state.source.type
  },
  SourceFiles: (state) => {
    return state.source.files
  },
  SourceUrl: (state) => {
    return state.source.url
  },
  Settings: (state) => {
    return state.settings
  },
  Stream: (state) => {
    return state.stream
  },
  IsEditor: (state) => {
    return state.isEditor
  },
  Editor: (state) => {
    return state.editor + state.transcript
  },
  Messages: (state) => {
    return state.messages
  },
  FinalMessages: (state) => {
    return state.finalMessages
  },
  Speaker: (state) => {
    return state.speaker
  },
  FinalInterim: (state) => {

    return state.messages.filter(r => r.results &&
      r.results.length && r.results[0].final)

  },
  CurrentInterim: (state) => {

    const r = state.messages[state.messages.length - 1]
    if (!r || !r.results || !r.results.length || r.results[0].final) {
      return null
    }
    return r

  },
  FinalAndCurrentInterimResult: (state, getters) => {

    let final = getters.FinalInterim
    let interim = getters.CurrentInterim
    
    if (interim) {
      final.push(interim)
    }
    //state.message = final
     //this.updateAttribute({messages: this.messages})
    return final
  },
  Transcript: (state, getters) => {
    
    const messages = getters.FinalAndCurrentInterimResult
    var speakerLabel = getters.IsSpeakerLabel
    // console.log(messages)
    let results = messages.map(msg =>
      msg.results.map((result, i) => {
        
        let obj = {transcript: result.alternatives[0].transcript, result_index: msg.result_index, final: result.final}
        if (speakerLabel) {
          obj.speaker = (typeof result.speaker === 'number' ? result.speaker : -1)
          console.log(`obj.speaker == ${obj.speaker}`)
        }
        return obj
      })
    ).reduce((a, b) => a.concat(b), [])
    // console.log(results)
    // return results
    return results.map((msg) => {
      if (speakerLabel) {
        let speakerHtml = '<span class="col-md-1 col-sm-1 items-end ellipsis">Detecting...</span>'
        if (msg.speaker !== -1) {
          speakerHtml = `<span class="col-md-1 col-sm-1 items-end ellipsis">Speaker ${msg.speaker}</span>`
        }
        return `<p class="row" result-index="${msg.result_index}">${speakerHtml}<span class="col-md-10 col-sm-8">${msg.transcript}</span></p>`
      } else {
        let str = `<span status="1" result-index="${msg.result_index}" result-final="${msg.final}">${msg.transcript}</span>`
        return str
      } //`<span status="1" result-index="${msg.result_index}" result-final="${msg.final}">${msg.transcript}</span>`
    }).reduce((a, b) => a.concat(b), [])
  },
  IsSpeakerLabel: (state) => {
    return state.settings.speaker_labels
  },
  IsWordAlternatives: (state) => {
    return state.wordAlternatives
  }
}

const mutations = {

  SET_WORDS: (state, payload) => {
    state.words = payload
  },
  UPDATE_ATTRIBUTE: (state, payload) => {
    for (var key in payload) {
      if (payload.hasOwnProperty(key) && state.hasOwnProperty(key)) {
        state[key] = payload[key]
      }
    }
  },
  UPDATE_ATTRIBUTE_SOURCE: (state, payload) => {
    for (var key in payload) {
      if (payload.hasOwnProperty(key) && state.source.hasOwnProperty(key)) {
        state.source[key] = payload[key]
      }
    }
  },
  UPDATE_ATTRIBUTE_SETTINGS: (state, payload) => {
    for (var key in payload) {
      if (payload.hasOwnProperty(key) && state.settings.hasOwnProperty(key)) {
        state.settings[key] = payload[key]
      }
    }
  },
  PUSH_MESSAGES: (state, payload) => {
    state.messages.push(payload)
  },
  SAVE_TRANSCRIPT: (state, payload) => {
    state.finalTranscript = payload.map(msg => (msg.transcript))
  },
  SAVE_SPEAKER: (state, payload) => {
    state.speaker = payload.map(msg => (msg.speaker))
  },
  SET_STREAM: (state, payload) => {
    //state.messages = []
    state.stream = payload
  },
  SET_MESSAGES: (state, payload) => {
    state.messages = payload
  },
  SET_SPEAKERLABEL: (state, payload) => {
    state.settings.speaker_labels = payload
    state.settings.resultsBySpeaker = payload
    state.settings.speakerlessInterim = payload
  },
  SET_WORDALTERNATIVES: (state, payload) => {
    state.wordAlternatives = payload
  }
}

const actions = {

  updateSource: ({commit}, payload) => {
    commit('UPDATE_ATTRIBUTE_SOURCE', payload)
  },
  updateAttribute: ({commit}, payload) => {
    commit('UPDATE_ATTRIBUTE', payload)
  },
  updateSettings: ({commit}, payload) => {
    commit('UPDATE_ATTRIBUTE_SETTINGS', payload)
  },
  authenticate: ({commit}, payload) => {
    http2.exec(payload).then((data) => {
      commit('UPDATE_ATTRIBUTE_SETTINGS', data)
    }) /* add catch if ever may then */
  },
  saveTranscript: ({commit}, payload) => {
    commit('SAVE_TRANSCRIPT', payload)
  },
  saveSpeaker: ({commit}, payload) => {
    commit('SAVE_SPEAKER', payload)
  },

  // handle stream 
  handleStream: ({commit, getters, rootGetters}, payload) => { // { type: 'record'}
    const userModel = rootGetters['STT/MODEL/UserModel']
    commit('UPDATE_ATTRIBUTE_SETTINGS', { model: userModel.base_model_name, customization_id: userModel.customization_id})
    
    if(payload.type === 'mic') {
      // console.log(state.settings)
      commit('SET_STREAM', recognizeMicrophone(getters.Settings))
    }

    if(payload.type === 'file upload') {
      console.log(getters.Settings)
      const files = getters.SourceFiles
      commit('SET_STREAM', recognizeFile(Object.assign({
        file: payload.file,
        play: true, // play the audio out loud
        // use a helper stream to slow down the transcript output to match the audio speed
        realtime: true,
      }, getters.Settings)))
    }
  },
  stopStream: ({commit, getters}, payload) => {
    const stream = getters.Stream
    stream.stop()
    stream.removeAllListeners()
    stream.recognizeStream.removeAllListeners()
 
    //commit('SET_MESSAGES', [])
    commit('SET_STREAM', undefined)
    commit('UPDATE_ATTRIBUTE', { messages: [] })
    //commit('UPDATE_ATTRIBUTE_SOURCE', { files: [], type: undefined, url: '' })
  }
}

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
}