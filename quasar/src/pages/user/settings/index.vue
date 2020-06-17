<template>
  <q-page class="padding">
    <q-list no-margin>

      <q-list-header v-lang.categories.userDetails />
      <q-item>
        <q-item-side icon="account_circle"/>
        <q-item-main>
          <q-item-tile label v-lang.categories.fullname />
          <q-item-tile sublabel>{{ user.firstname + ' ' + user.lastname }}</q-item-tile>
        </q-item-main>
      </q-item>

      <q-item>
        <q-item-side icon="account_box"/>
        <q-item-main>
          <q-item-tile label v-lang.categories.username />
          <q-item-tile sublabel>{{ user.username }}</q-item-tile>
        </q-item-main>
      </q-item>
      <q-item>
        <q-item-side icon="email"/>
        <q-item-main>
          <q-item-tile label v-lang.categories.email />
          <q-item-tile sublabel>{{ user.email }}</q-item-tile>
        </q-item-main>
      </q-item>

      <q-collapsible
        v-model="openPassword"
        icon="vpn key"
        :label="selectedLanguage.changePassword"
      >
        <passwordInput />
      </q-collapsible>

      <!-- <customizationList /> -->

      <!-- <q-list-header v-lang.categories.access />
      <q-collapsible
        v-model="openAccess"
        :label="selectedLanguage.tokenList"
      >
        <tokenList />
      </q-collapsible> -->

      <q-list-header v-lang.categories.language />
      <q-item>
        <q-item-side icon="language" />
        <q-btn-dropdown class="full-width " flat :label="selectedLanguage.languageSelected + '   ' + lang">
          <q-list link>
            <q-item v-close-overlay @click.native="changeLanguage('en-us')">
              <q-item-main>
                <q-item-tile label>English</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item v-close-overlay @click.native="changeLanguage('ja')">
              <q-item-main>
                <q-item-tile label>日本語</q-item-tile>
              </q-item-main>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
// import customizationsLanguage from '../customizations/Language'
import passwordInput from '../../../components/stt/settings/passwordInput'
import customizationList from '../../../components/stt/settings/customizationList'
import tokenList from '../../../components/stt/settings/tokenList'
import en from '../../../lang/en/categories'
import ja from '../../../lang/ja/categories'

export default {
  data () {
    return {
      lang: localStorage.getItem('vue-lang'),
      language: localStorage.getItem('vue-lang'),
      openPassword: false,
      openAccess: true,
      isGoogleUser: localStorage.getItem('googleToken')
    }
  },
  computed: {
    ...mapGetters({
      user: 'STT/USER/User'
    }),
    selectedLanguage: function () {
      return this.language === 'en-us' ? en : ja
    }
  },
  methods: {
    changeLanguage (lang) {
      this.lang = lang
      this.language = lang
      this.$store.commit('SET_LANGUAGE', this.language)
    }
  },
  components: {
    // customizationsLanguage,
    passwordInput,
    customizationList,
    tokenList
  },
  watch: {
    lang (lang) {
      // dynamic import, so loading on demand only
      import(`quasar-framework/i18n/${lang}`).then(lang => {
        this.$q.i18n.set(lang.default)
      })
    }
  }
}
</script>

<style>
 .padding {
   padding: 10px;
 }
</style>