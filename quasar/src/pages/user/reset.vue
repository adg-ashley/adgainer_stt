<template>
    <div  class="window-height window-width row justify-center items-center" >
      <div style="width: 600px;">
        <q-card>
        <q-card-title >
          <span class="q-title">Reset Password</span>
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
            <form>
              <div class="q-my-md">
                <q-input v-model="user.password" type="password" :float-label="selectedLanguage.newPassword" @blur="$v.user.password.$touch" :error="$v.user.password.$error" />
              </div>
              <div class="q-my-md">
                <q-input v-model="user.confirm" type="password" :float-label="selectedLanguage.confirmPassword" @blur="$v.user.confirm.$touch" :error="$v.user.confirm.$error" />
              </div>
            </form>
            <q-btn @click.prevent="updatePassword()" color="primary" v-lang.categories.updatePassword />
        </q-card-main>
      </q-card>
    </div>
  </div>
</template>
<script>
import { required, minLength, sameAs } from 'vuelidate/lib/validators'
import en from '../../lang/en/categories'
import ja from '../../lang/ja/categories'

export default {
  name: 'Verify',
  data () {
    return {
      user: {
        password: null,
        confirm: null,
        resetToken: null
      },
      lang: ''
    }
  },
  computed: {
    selectedLanguage: function () {
      return this.language === 'en-us' ? en : ja
    }
  },
  validations: {
		user: {
			password: {
				required,
				minLength: minLength(5)
      },
      confirm: {
        required,
        sameAsPassword: sameAs('password'),
				minLength: minLength(5)
      }
    }
  },
  methods: {
    updatePassword () {
      if (this.user.password === this.user.confirm) {
        this.user.resetToken = localStorage.getItem('resetKey')
        var payload = {
            url: `/stt/auth/reset`, data: this.user, method: 'POST'
        }
        this.$store.dispatch('STT/USER/reset', payload)
        this.$q.notify({message: this.selectedLanguage.newPasswordSaved, type: 'positive', position: 'bottom-left'})
        this.$router.push({path: '/login'})
      }
      else {
        this.$q.notify({message: this.selectedLanguage.passwordIdentical, type: 'negative', position: 'bottom-left'})
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
