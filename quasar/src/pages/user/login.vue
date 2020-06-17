<template>
  <div>
    <div class="window-height window-width row justify-center items-center" >
      <div style="width: 500px;">
        <q-card>
          <!-- <q-card-title v-lang.categories.login /> -->
          <q-card-title> 
            <span class="q-title">Speech To Text</span> 
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
          <q-card-main class="doc-container">
            <div class="row">
              <div class="col-md-12">
                <q-alert :color="MessageSetting.color" :icon="MessageSetting.icon" v-if="HaveMessage">
                  {{Message.text}}
                </q-alert>
                <form>
                  <div class="q-my-md">
                    <q-field  :error-label="getErrorText('username / email')" :error="checkErrorOn('username / email')">
                      <q-input outline v-model="user.credential" :float-label="lang === 'en-us' ? 'Username / Email' : 'ユーザーネーム / Eメール'"/>
                    </q-field>
                  </div>
                  <div class="q-my-md">
                    <q-field :error-label="getErrorText('password')" :error="checkErrorOn('password')">
                      <q-input type="password" v-model="user.password"  :float-label="lang === 'en-us' ? 'Password' : 'パスワード'" />
                    </q-field>
                  </div>
                  <!-- <q-btn 
                    color="primary"
                    class="full-width"
                    outline
                    v-on:click.prevent="login({url: '/stt/auth/login', data: user, method: 'POST'})" v-lang.categories.login
                  /> -->
                    <q-btn
                    color="primary"
                    class="full-width"
                    outline
                    :label="selectedLanguage.signIn"
                    v-on:click.prevent="login({url: '/stt/auth/login', data: user, method: 'POST'})"
                  />
                </form>
              </div>
            </div>
            <div class="row q-mt-lg">
              <div class="col-md-6">
                <!-- <q-btn 
                  class="full-width"
                  @click="loginTranscript()"
                  v-lang.categories.loginVia /> -->
                  <router-link to="recover" v-lang.categories.forgotPassword />
              </div>
              <div class="col-md-6">
                <div style="float: right;">
                  <router-link to="signup" v-lang.categories.signUp />
                </div>
              </div>
            </div>
          </q-card-main>
          <q-card-separator />
          <q-card-actions vertical> 
            <div class="full-width q-mb-xs">
              <g-signin-button
                :params="googleSignInParams"
                @success="onSignInSuccess"
                @error="onSignInError"
                v-lang.categories.signGoogle />
            </div>
          </q-card-actions>
        </q-card>
        <ad-login ref="adloginModal" />
      </div>
    </div>
  </div>
</template>
<script>
import {mapGetters,mapActions} from 'vuex'
import AdLogin from './adlogin'
import Vue from 'vue'
import en from '../../lang/en/categories'
import ja from '../../lang/ja/categories'
import GSignInButton from 'vue-google-signin-button'
Vue.use(GSignInButton)

export default {
  name: 'Login',
  data () {
    return {
      user: {
        credential: '',
        password: ''
      },
      lang: '',
      googleSignInParams: {
        //client_id: '799061406692-gse9uv08h7phdu46k0qmmcnq4m9fhtuh.apps.googleusercontent.com' //THIS IS FOR stt.adgainersolutions
        client_id: process.env.CLIENT_ID //THIS IS FOR localhost
      }
    }
  },
  components: {
    AdLogin,
    GSignInButton
  },
  computed: {
    ...mapGetters(['Messages', 'HaveMessages', 
      'Message', 
      'MessageSetting',
      'IdleLogout'
    ]),
    HaveMessage: {
			get () {
        return this.$store.getters['HaveMessage']
      },
      set (val) {
        this.$store.commit('SET_MESSAGE', val)
      }
		},
    selectedLanguage: function () {
      return this.language === 'en-us' ? en : ja
    }
  },
  methods: {
    checkErrorOn (field) {
      return this.Messages.hasOwnProperty(field) ? true : false
    },
    getErrorText (field) {
      if (this.checkErrorOn(field)) {
        return this.Messages[field].text
      }
    },
    login (payload) {
      this.$store.dispatch('STT/USER/login', payload).then((data) => {
        if (data) {
          if (data.user.verified) {
            this.$store.commit('STT/USER/SET_USER', data.user)
            this.$store.commit('SET_LANGUAGE', data.user.language)
            this.language = (data.user.language ? data.user.language : 'en-us')
            if (this.IdleLogout) {
              this.$router.go(-1)   
            }
            else {
              this.$router.push({path: '/'})  
            }
            this.$store.commit('IDLE_LOGOUT', false)  
            this.$q.notify({message: data.message.text, type: 'positive', position: 'bottom-left'})
          }
          else {
            this.$q.notify({message: "Email Not Verified", type: 'negative', position: 'bottom-left'})
          }
        }
      }).catch((err) => {
         console.log(err)
         if (err.hasOwnProperty('messages')) {
          this.$store.commit('SET_MESSAGES', err.messages)
         }
         if (err.hasOwnProperty('message')) {
          this.$store.commit('SET_MESSAGE', err.message)
         }
      })
    },
    onSignInSuccess (googleUser) {
      let userDetails = {
        gapi: this.googleSignInParams.client_id,
        profile: googleUser.getBasicProfile(),
        id_token: googleUser.getAuthResponse().id_token
      }
      let userPayload = {
        url: '/stt/auth/googleauth', data: userDetails, method: 'POST'
      }
      this.$store.dispatch('STT/USER/login', userPayload).then((data) => {
        if (data) {
          if (data.user.verified) {
            if (data.newAccount || data.user.password === null) {
              localStorage.setItem('email', data.user.email)
              this.$router.push({path: '/newpassword'})
            }
            else {
              this.$store.commit('STT/USER/SET_USER', data.user)
              this.$store.commit('STT/USER/SET_GOOGLE_USER', userDetails.id_token)
              this.$store.commit('SET_LANGUAGE', data.user.language)
              this.language = (data.user.language ? data.user.language : 'en-us')
              this.$router.push({path: '/records/all'})
            }
            this.$q.notify({message: data.message.text, type: 'positive', position: 'bottom-left'})
          }
        }
      }).catch((err) => {
         console.log(err)
         this.$q.notify({message: err.message.text, type: 'negative', position: 'bottom-left'})
      })
    },
    onSignInError (error) {
      // `error` contains any error occurred.
      console.log('Error authenticating with gmail', error)
    },
    loginTranscript () {
      this.$refs.adloginModal.open()
    },
    changeLanguage (lang) {
      this.lang = lang
      this.language = lang
      localStorage.setItem('selectedLanguage', this.language)
    }
  },
  mounted () {
    console.log(this.googleSignInParams.client_id)
  },
  created () {
    this.language = localStorage.getItem('selectedLanguage') || 'en-us'
    this.lang = this.language
    this.HaveMessage = false
  }
}
</script>

<style>
  .g-signin-button {
    width: 100%;
    text-align: center;
    margin: auto;
    padding: 6px 8px;
    background-color: #3c82f7;
    color: #fff;
    box-shadow: 0 3px 0 #3c82f7;
    cursor: pointer;
  }
  
</style>

