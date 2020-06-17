export const addErrors = ({commit}, payload) => {

}

export const setError = ({commit}, payload) => {
  
}

export const addMessage = ({commit}, payload) => {

}

export const haveErrorOn = ({commit, state}, payload) => {
  if (state.messages.hasOwnProperty(payload)) {
    return true
  }else {
    return false
  }
}