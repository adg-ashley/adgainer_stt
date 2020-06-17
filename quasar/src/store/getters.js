export const Errors = (state) => {
}

export const Error = (state) => { 

}

export const HaveMessages = (state) => {
  console.log(Object.keys(state.messages).length)
  return (Object.keys(state.messages).length !== 0 && state.messages.constructor === Object) ? true : false
}

export const HaveMessage = (state) => {
  console.log(Object.keys(state.message).length)
  return (Object.keys(state.message).length !== 0 && state.message.constructor === Object) ? true : false
}

export const Message = (state) => {
  return state.message
}

export const MessageSetting = (state) => {
  if (state.message.type === 'error') {
    return { icon: 'error', color: 'negative'}
  }
}

export const Messages = (state) => {
  return state.messages
}

export const IdleLogout = (state) => {
  return state.idleLogout
}

export const HasErrorOn = (state) => {
  return state.messages
}

export const GetLanguage = (state) => {
  return state.language
}

export const RightSidebarToogle = (state) => {
  return JSON.parse(state.rightSidebar)
}

export const Http2 = (state) => {
  return state.http2
}
