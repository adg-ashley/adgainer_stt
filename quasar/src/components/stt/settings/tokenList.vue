<template>
	<q-list no-margin>
		<q-item>
			<q-item-main>
				<q-item-tile label> ADGainer </q-item-tile>
				<q-input v-model="accessToken"/>  
			</q-item-main>
		</q-item>

		<q-item>
			<q-item-main>
				<q-btn outline color="secondary" class="float-right" @click="saveChanges()" v-lang.categories.saveToken />
			</q-item-main>
		</q-item>
	</q-list>
</template>

<script>
import { mapGetters } from 'vuex'
import en from '../../../lang/en/categories'
import ja from '../../../lang/ja/categories'

export default {
	data () {
		return {
			accessToken: this.$store.getters['STT/USER/User'].adToken
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
		saveChanges () {
			this.$q.dialog({
        title: this.selectedLanguage.confirm,
        message: this.selectedLanguage.saveAccessToken,
        ok: this.selectedLanguage.saveToken,
        cancel: this.selectedLanguage.cancel
      }).then(() => {
				if (this.accessToken === '' || this.accessToken === null) {
					this.accessToken = null
				}
				this.$store.commit('STT/USER/UPDATE_ATTRIBUTE', { adToken: this.accessToken })
				let params = {
					url: `/stt/users/${this.user.id}/update`,
					method: 'put',
					data: {
						id: this.user.id,
						adToken: this.accessToken
					}
				}
				this.$q.notify({
					type: 'positive',
					message: this.selectedLanguage.tokenSaved,
					position: 'bottom-left'
				})
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
</script>
