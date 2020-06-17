<template>
    <div  class="window-height window-width row justify-center items-center" >
      <div style="width: 600px;">
        <q-card>
        <q-card-title >
          <span class="q-title">Account Verification</span>
          <div slot="right" class="row items-center">
            <q-btn-dropdown :label="lang" icon="language" flat dense rounded>
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
          </div>
        </q-card-title>
        <q-card-separator />
        <q-card-main class="doc-container">
            <h4 v-lang.categories.accountVerified />
            <q-btn @click.prevent="login()" color="primary" v-lang.categories.clickToLogin />
        </q-card-main>
      </q-card>
    </div>
  </div>
</template>
<script>
import en from '../../lang/en/categories'
import ja from '../../lang/ja/categories'

export default {
  name: 'Verify',
  data () {
      return {
          user: {
              key: null
          },
          lang: ''
      }
  },
  computed: {
    selectedLanguage: function () {
      return this.language === 'en-us' ? en : ja
    }
  },
  methods: {
      login () {
          this.$router.push({path: '/login'})
      },
      changeLanguage (lang) {
        this.lang = lang
        this.language = lang
      }
  },
  mounted () {
    this.language = 'en-us'
    this.user.key = localStorage.getItem('regKey')
    var payload = {
        url: '/stt/auth/verify', data: this.user, method: 'POST'
    }
    this.$store.dispatch('STT/USER/verify', payload)
  },
  created () {
    this.language = localStorage.getItem('selectedLanguage') || 'en-us'
    this.lang = this.language
  }
}
</script>
