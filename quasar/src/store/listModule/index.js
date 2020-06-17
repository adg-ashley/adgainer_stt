import Customizations from './modules/customizations'
import Campaigns from './modules/campaigns'
import Corpora from './modules/corpora'
import Words from './modules/words'
import Voices from './modules/voices'
import User from './modules/user'
import SttUsers from './modules/sttusers'
import Stt from './modules/stt'
import Records from './modules/records'

export default {
  namespaced: true,
  modules: {
    CUSTOMIZATIONS: Customizations,
    CAMPAIGNS: Campaigns,
    CORPORA: Corpora,
    WORDS: Words,
    VOICES: Voices,
    STTUSERS: SttUsers,
    USER: User,
    STT: Stt,
    RECORDS: Records
  }
}
