// import something here
import MultiLanguage from '../vue-multilanguage'
import language from '../lang/language'
// leave the export, even if you don't use it
export default ({ Vue }) => {
  Vue.use( MultiLanguage, language )
}
