export const SET_ERRORS = (state, payload) => { 
}
export const SET_ERROR = (state, payload) => { 
}
export const SET_MESSAGES = (state, payload) => {
  state.messages = payload
}
export const SET_MESSAGE = (state, payload) => {
  state.message = payload
}
export const SET_LANGUAGE = (state, payload) => {
  localStorage.setItem('vue-lang', payload)
  state.language = localStorage.getItem('vue-lang')
}
export const IDLE_LOGOUT = (state, payload) => {
  state.idleLogout = payload
}
export const SET_RIGHTSIDEBAR = (state, payload) => {
  state.rightSidebar = payload
}

export const UPDATE_ATTRIBUTE_HTTP2 = (state, payload) => {
  for (var key in payload) {
    if (payload.hasOwnProperty(key) && state.http2.hasOwnProperty(key)) {
      state.http2[key] = payload[key]
    }
  }
}