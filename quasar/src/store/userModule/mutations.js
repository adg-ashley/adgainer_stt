/*
export const someMutation = (state) => {}
 */
export const setToken = (state, token) => {
  localStorage.setItem('token', token)
  state.token = localStorage.token
}
export const setUserType = (state, userType) => {
  localStorage.setItem('userType', userType)
  state.user.type = localStorage.userType
}
export const setUserId = (state, userId) => {
  localStorage.setItem('userId', userId)
  state.user.id = localStorage.userId
}
export const setUserUsername = (state, userUsername) => {
  localStorage.setItem('userUsername', userUsername)
  state.user.username = localStorage.userUsername
}
export const setUserEmail = (state, userEmail) => {
  localStorage.setItem('userEmail', userEmail)
  state.user.email = localStorage.userEmail
}
export const setUserPassword = (state, userPassword) => {
  localStorage.setItem('userPassword', userPassword)
  state.user.password = localStorage.userPassword
}
export const setUserNarrowCustomizationId = (state, userNarrowCustomizationId) => {
  localStorage.setItem('userNarrowCustomizationId', userNarrowCustomizationId)
  state.user.narrowCustomizationId = localStorage.userNarrowCustomizationId
}
export const setUserIsVocabularyEnabled = (state, userIsVocabularyEnabled) => {
  localStorage.setItem('userIsVocabularyEnabled', userIsVocabularyEnabled)
  state.user.isVocabularyEnabled = localStorage.userIsVocabularyEnabled
}
export const setUserSttToken = (state, userSttToken) => {
  localStorage.setItem('userSttToken', userSttToken)
  state.user.sttToken = localStorage.userSttToken
}
export const setUserAccessToken = (state, userAccessToken) => {
  localStorage.setItem('userAccessToken', userAccessToken)
  state.user.accessToken = localStorage.userAccessToken
}
export const resetState = (state, payload) => {
  localStorage.clear()
  state.token = payload
  state.user.type = payload
  state.user.id = payload
  state.user.username = payload
  state.user.email = payload
  state.user.password = payload
  state.user.narrowCustomizationId = payload
  state.user.isVocabularyEnabled = payload
  state.user.sttToken = payload
  state.user.accessToken = payload
}