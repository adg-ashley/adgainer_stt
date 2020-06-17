export const Token = (state) => {
  if (localStorage.token) {
    state.token = localStorage.token
  }
  return state.token
}
export const UserType = (state) => {
  if (localStorage.userType) {
    state.user.type = localStorage.userType
  }
  return state.user.type
}
export const UserId = (state) => {
  if (localStorage.userId) {
    state.user.id = localStorage.userId
  }
  return state.user.id
}
export const UserUsername = (state) => {
  if (localStorage.userUsername) {
    state.user.username = localStorage.userUsername
  }
  return state.user.username
}
export const UserEmail = (state) => {
  if (localStorage.userEmail) {
    state.user.email = localStorage.userEmail
  }
  return state.user.email
}
export const UserPassword = (state) => {
  if (localStorage.userPassword) {
    state.user.password = localStorage.userPassword
  }
  return state.user.password
}
export const UserNarrowCustomizationId = (state) => {
  if (localStorage.userNarrowCustomizationId) {
    state.user.narrowCustomizationId = localStorage.userNarrowCustomizationId
  }
  return state.user.narrowCustomizationId
}
export const UserIsVocabularyEnabled = (state) => {
  if (localStorage.userIsVocabularyEnabled) {
    state.user.isVocabularyEnabled = localStorage.userIsVocabularyEnabled
  }
  return state.user.isVocabularyEnabled
}
export const UserSttToken = (state) => {
  if (localStorage.userSttToken) {
    state.user.sttToken = localStorage.userSttToken
  }
  return state.user.sttToken
}
export const UserAccessToken = (state) => {
  if (localStorage.userAccessToken) {
    state.user.accessToken = localStorage.userAccessToken
  }
  return state.user.accessToken
}
