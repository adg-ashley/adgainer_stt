<template>
    <div  class="window-height window-width row justify-center items-center" >
      <div style="width: 600px;">
        <q-card>
        <q-card-title >
          <span class="q-title"> Forgot Password </span>
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
          <div class="col-md-12">
            <form>
              <div class="q-my-md">
                <q-input v-model="user.email"  :float-label="selectedLanguage.email" @blur="$v.user.email.$touch" :error="$v.user.email.$error" />
                <span class="b" v-if="!$v.user.email" v-lang.categories.emailError />
              </div>
              <q-btn
                outline
                color="primary"
                class="full-width"
                v-on:click.prevent="recoverAccount({url: '/stt/auth/recover', data: user, method: 'POST'})" v-lang.categories.recoverPassword />
            </form>
          </div>
          <div class="row q-mt-lg">
            <div class="col-md-6">
              <router-link to="signup" v-lang.categories.signUp />
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
        email: ''
      },
      options: [
        { label: 'English (US)', value: 'en-us' },
        { label: 'Japanese', value: 'ja' },
      ],
      lang: ''
    }
  },
  validations: {
    user: {
      email: {
        required,
        email
      }
    }
  },
  computed: {
    selectedLanguage: function () {
      return this.language === 'en-us' ? en : ja
    }
  },
  methods: {
    recoverAccount (payload) {
      this.$v.user.email.$touch()
			if (this.$v.user.email.$error) {
				this.$q.notify({
					message: this.selectedLanguage.reviewFields,
					position: 'bottom-left'
				})
        return
			}
			else {
        this.$store.dispatch('STT/USER/recover', payload).then((data) => {
          this.$q.notify({message: data.message.text, type: 'positive', position: 'bottom-left'})
          localStorage.setItem('resetKey', data.key)
          this.$router.push({path: '/login'})
        }).catch((err) => {
          this.$q.notify({
            message: 'Error',
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
