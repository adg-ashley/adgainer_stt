<template>
    <div  class="window-height window-width row justify-center items-center" >
      <div style="width: 600px;">
        <q-card>
        <q-card-title >
          <span class="q-title"  v-lang.categories.signUp />
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
          <div class="row">
            <div class="col-md-12">
              <q-alert :color="MessageSetting.color" :icon="MessageSetting.icon" v-if="HaveMessage">
                {{Message.text}}
              </q-alert>
              <form>
                  <div class="q-my-md">
                    <q-input v-model="user.firstname" :float-label="selectedLanguage.firstname" @blur="$v.user.firstname.$touch" :error="$v.user.firstname.$error" />
                  </div>
                  <div class="q-my-md">
                    <q-input v-model="user.lastname" :float-label="selectedLanguage.lastname" @blur="$v.user.lastname.$touch" :error="$v.user.lastname.$error" />
                  </div>
                  <div class="q-my-md">
                    <q-input v-model="user.username" :float-label="selectedLanguage.username" @blur="$v.user.username.$touch" :error="$v.user.username.$error" />
                    <span class="a" v-if="!$v.user.username.minLength" v-lang.categories.must />
                  </div>
                  <div class="q-my-md">
                    <q-input type="password" v-model="user.password"  :float-label="selectedLanguage.password" @blur="$v.user.password.$touch" :error="$v.user.password.$error" />
                    <span class="b" v-if="!$v.user.password.minLength" v-lang.categories.must />
                  </div>
                  <div class="q-my-md">
                    <q-input v-model="user.email"  :float-label="selectedLanguage.email" @blur="$v.user.email.$touch" :error="$v.user.email.$error" />
                    <span class="b" v-if="!$v.user.email.email" v-lang.categories.emailError />
                  </div>
                  <div class="q-my-md">
                    <q-select
                      :options="options"
                      v-model="user.lang"
                      :float-label="selectedLanguage.selectLanguage"
                    />
                  </div>
                  <q-btn
                    outline
                    color="primary"
                    class="full-width"
                    v-on:click.prevent="signUp({url: '/stt/auth/send', data: user, method: 'POST'})" v-lang.categories.signUp
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
                  <router-link :to="{path: 'login'}" v-lang.categories.signIn />
                </div>
              </div>
            </div>
        </q-card-main>
      </q-card>
    </div>
  </div>
</template>
<script>
import {mapGetters,mapActions} from 'vuex'
import { required, minLength, email } from 'vuelidate/lib/validators'
import en from '../../lang/en/categories'
import ja from '../../lang/ja/categories'

export default {
  name: 'Login',
  data () {
    return {
      user: {
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        email: '',
        lang: localStorage.getItem('selectedLanguage') || 'en-us'
      },
      options: [
        { label: 'English (US)', value: 'en-us' },
        { label: '日本語 (JP)', value: 'ja' },
      ],
      lang: ''
    }
  },
  computed: {
    ...mapGetters(['Messages', 'HaveMessages', 
        'Message', 
        'HaveMessage',
        'MessageSetting'
      ]),
    selectedLanguage: function () {
      return this.language === 'en-us' ? en : ja
    }
  },
  validations: {
		user: {
      firstname: {
				required
      },
      lastname: {
				required
			},
			username: {
				required,
				minLength: minLength(5)
			},
			password: {
				required,
				minLength: minLength(5)
      },
      email: {
        required,
				email
      },
			lang: {
				required
			}
		}
  },
  methods: {
    signUp (payload) {
      this.$v.user.$touch()
			if (this.$v.user.$error) {
				this.$q.notify({
					message: this.selectedLanguage.reviewFields,
					position: 'bottom-left'
				})
        return
			}
			else {
        this.$store.dispatch('STT/USER/send', payload).then((data) => {
          console.log(data)
          this.$q.notify({message: data.message.text, type: 'positive', position: 'bottom-left'})
          localStorage.setItem('regKey', data.key)
          this.$router.push({path: '/login'})
        }).catch((err) => {
          console.log(err)
          this.$q.notify({
            message: 'Username or Email address already used!',
            position: 'bottom-left'
          })
        })
      }
    },
    changeLanguage (lang) {
      this.lang = lang
      this.language = lang
    }
  },
  created () {
    this.language = localStorage.getItem('selectedLanguage') || 'en-us'
    this.lang = this.language
  }
}
</script>

<style scoped>
 span.a, span.b, span.c {
	 color:red;
	 font-style: oblique;
 }
</style>
