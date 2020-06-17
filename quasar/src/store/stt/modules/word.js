import http2 from  '../../../store/http2'

const state = {
  words: {
    data: []
  },
  word: {}
}

const getters = {

  Words: (state) => {
    return state.words
  },
  HasWordsData: (state) => {
    if( state.words.data.length > 0) {
      return true
    } else {
      return false
    } 
  } 
}

const mutations = {

  SET_WORDS: (state, payload) => {
    state.words = payload
  },
  CONCAT_WORDS: (state, payload) => {
    for (let k in payload) {
      if (k === 'data') {
        state.words.data = state.words.data.concat(payload.data)
      } else {
        state.words[k] = payload[k]
      }
    }
  },
  REMOVE_ITEM: (state, payload) => {
    console.log(`remove ${payload}`)
    console.log(state.words)
    if (payload > -1) {
      state.words.data.splice(payload, 1)
    }
  },
  PUSH_WORD: (state, payload) => {
    state.words.data.push(payload)
    state.words.data.sort(function(a, b){
      /// sort by name https://stackoverflow.com/questions/6712034/sort-array-by-firstname-alphabetically-in-javascript?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
      var wordNameA =a.word_name.toLowerCase(), wordNameB=b.word_name.toLowerCase()
      if (wordNameA < wordNameB) return -1 //sort string ascending return -1
      if (wordNameA > wordNameB) return 1
      return 0 //default return value (no sorting)
     });
  }

}

const actions = {

  // get list array of words
  fetchList: ({commit}, payload) => {
    http2.exec(payload).then((data) => {
      commit('SET_WORDS', data)
    })
  },
  destroyItem: ({commit}, payload) => {
    // console.log(payload)
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