<template>
  <div>
    <q-modal v-model="adloginModal" :content-css="{padding: '30px', minWidth: '40%'}">
      <img src="~assets/adgainer-logo.png">
      <form>
        <div class="QfieldClass">
          <q-field>
          	<q-input 
							v-model="form.username"
							@blur="$v.form.username.$touch"
							:error="$v.form.username.$error" 
							:float-label="language === 'en-us' ? 'Username' : 'ユーザーネーム'"
            />
						<span class="a" v-show="showError" v-if="!$v.form.username.required" v-lang.categories.required />
          </q-field>
        </div>
          
        <div class="QfieldClass">
          <q-field>
						<q-input 
							type="password"
							v-model="form.password"
							@blur="$v.form.password.$touch"
							:error="$v.form.password.$error"
							:float-label="language === 'en-us' ? 'Password' : 'パスワード'"
						/>
						<span class="a" v-show="showError" v-if="!$v.form.password.required" v-lang.categories.required />
          </q-field>
        </div>

				<q-btn 
					class="full-width"
					color="primary"
					v-on:click.prevent="validateAdUser()" v-lang.categories.login>
				</q-btn>
      </form>
    </q-modal>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import en from '../../lang/en/categories'
import ja from '../../lang/ja/categories'

export default {
	name: 'AdLogin',
  data () {
		return {
			form: {
				username: '',
				password: ''
			},
			adloginModal: false,
			showError: false
		}
	},
	validations: {
		form: {
			username: {
				required
			},
			password: {
				required
			}
		}
	},
	computed: {
		selectedLanguage: function () {
      return this.language === 'en-us' ? en : ja
    }
	},
  methods: {
    open () {
      this.adloginModal = true
		},
		validateAdUser () {
			this.$v.form.$touch()
			if (this.$v.form.$error) {
				this.showError = true
				this.$q.notify({
					message: this.selectedLanguage.reviewFields,
					position: 'bottom-left'
				})
        return
			}
			else {
				console.log('TEST')
			}
		}
  }
} 
</script>

<style>
  .QfieldClass {
    padding-bottom: 10px;
  }
	span.a, span.b {
		color:red;
		font-style: oblique;
	}
</style>