import user from './modules/user'
import model from './modules/model'
import word from './modules/word'
import speech from './modules/speech'
import record from './modules/record'
import customization from './modules/customization'

export default {
  namespaced: true,
  modules: {
    USER: user,
    MODEL: model,
    WORD: word,
    SPEECH: speech,
    RECORD: record,
    CUSTOMIZATION: customization
  }
}
