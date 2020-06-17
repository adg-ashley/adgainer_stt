<template>
	<q-list no-margin>
		<q-item>
			<q-item-main>
				<q-input v-model="form.oldPassword" :float-label="pass(selectedLanguage.oldPassword)" @blur="$v.form.oldPassword.$touch" :error="$v.form.oldPassword.$error" type="password" />
				<span class="a" v-if="!$v.form.oldPassword.minLength" v-lang.categories.must />
			</q-item-main>
		</q-item>

		<q-item>
			<q-item-main>
				<q-input v-model="form.newPassword" :float-label="pass(selectedLanguage.newPassword)" @blur="$v.form.newPassword.$touch" :error="$v.form.newPassword.$error" type="password" />
				<span class="b" v-if="!$v.form.newPassword.minLength" v-lang.categories.must />
			</q-item-main>
		</q-item>

		<q-item> 
			<q-item-main>
				<q-input v-model="form.confirmPassword" :float-label="pass(selectedLanguage.confirmPassword)" @blur="$v.form.confirmPassword.$touch" :error="$v.form.confirmPassword.$error" type="password" />
				<span class="c" v-if="!$v.form.confirmPassword.sameAsPassword" v-lang.categories.identical />
			</q-item-main>
		</q-item>

		<q-item>
			<q-item-main>
				<q-btn outline color="secondary" class="float-right" @click="saveChanges()" v-lang.categories.savePassword />
			</q-item-main>
		</q-item>
	</q-list>
</template>

<script>
import { mapGetters } from 'vuex'
import { required, minLength, sameAs } from 'vuelidate/lib/validators'
import en from '../../../lang/en/categories'
import ja from '../../../lang/ja/categories'

export default {
	data () {
		return {
			form: {
				oldPassword: null,
				newPassword: null,
				confirmPassword: null
			}
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
	validations: {
		form: {
			oldPassword: {
				required,
				minLength: minLength(5)
			},
			newPassword: {
				required,
				minLength: minLength(5)
			},
			confirmPassword: {
				required,
				sameAsPassword: sameAs('newPassword')
			}
		}
  },
	methods: {
		pass (name) {
			return `<span>${name} <span style="color: red;">*</span></span>`
		},
		saveChanges () {
			this.$v.form.$touch()
			if (this.$v.form.$error) {
				this.$q.notify({
					message: this.selectedLanguage.reviewFields,
					position: 'bottom-left'
				})
        return
			}
			else {
				this.$q.dialog({
					title: this.selectedLanguage.confirm,
					message: this.selectedLanguage.saveNewPassword,
					ok: this.selectedLanguage.savePassword,
					cancel: this.selectedLanguage.cancel
				}).then(() => {
					this.$q.notify({
						type: 'positive',
						message: this.selectedLanguage.newPasswordSaved,
						position: 'bottom-left'
					})
					let params = {
						url: `/stt/users/${this.user.id}/update`,
						method: 'put',
						data: {
							id: this.user.id,
							oldPassword: this.form.oldPassword,
							newPassword: this.form.newPassword
						}
					}
					return this.$store.dispatch('STT/USER/list', params)
				}).catch(() => {
					this.$q.notify({
						type: 'info',
						message: this.selectedLanguage.nothingChanged,
						position: 'bottom-left'
					})
				})
			}
		}
	}
}
</script>

<style>
 span.a, span.b, span.c {
	 color:red;
	 font-style: oblique;
 }
</style>
