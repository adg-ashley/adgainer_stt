<template>
	<q-list no-margin>
		<q-list-header v-lang.categories.customization />
		<q-item link tag="label" multiline>
			<q-item-side left> 
				<q-toggle v-model="enable" :value="enableVocabulary" color="secondary" />
			</q-item-side>
			<q-item-main>
				<q-item-tile label v-lang.categories.vocabulary />
				<q-item-tile sublabel v-lang.categories.enableVocabulary />
			</q-item-main>
			<q-item-side right>
				<q-btn outline small dense color="secondary" class="float-right" @click="setVocabulary()" v-lang.categories.saveCustomization />
			</q-item-side>
		</q-item>

		<!-- <q-item>
			<q-item-side icon="language" />
			<q-item-main>
					<customization-language
					:property="customLang"
					v-model="customizationId"/>
			</q-item-main>
		</q-item> 

		<q-item>
			<q-item-main>
				<q-btn outline small color="secondary" class="float-right" @click="setVocabulary()" v-lang.categories.saveCustomization />
			</q-item-main>
		</q-item> -->
	</q-list>
</template>

<script>
import { mapGetters } from 'vuex'
import CustomizationLanguage from '../customizations/Language'
import en from '../../../lang/en/categories'
import ja from '../../../lang/ja/categories'

export default {
	data () {
		return {
			enable: this.$store.getters['STT/USER/User'].enableVocabulary === 1 ? true : false,
			// customizationId: this.$store.getters['STT/USER/User'].customizationId,
			customLang: {
        inverted: false
      }
		}
	},
	computed: {
		...mapGetters({
			user: 'STT/USER/User'
		}),
		customizationId: {
			get () {
        return this.$store.getters['STT/USER/User'].CustomizationId
      },
      set (val) {
        this.$store.commit('STT/USER/UPDATE_ATTRIBUTE', { CustomizationId: val })
      }
		},
		enableVocabulary: {
			get () {
        return this.$store.getters['STT/USER/User'].enableVocabulary
      },
      set (val) {
        this.$store.commit('STT/USER/UPDATE_ATTRIBUTE', { enableVocabulary: val })
      }
		},
		selectedLanguage: function () {
      return this.language === 'en-us' ? en : ja
    }
	},
	methods: {
		setVocabulary () {
			console.log(this.customizationId)
      this.$q.dialog({
        title: this.selectedLanguage.confirm,
        message: this.selectedLanguage.saveCustomization,
        ok: this.selectedLanguage.confirm,
        cancel: this.selectedLanguage.cancel
      }).then(() => {
				if (this.enable === false) {
					this.customizationId = 0
					this.enable = 0
				} else { 
					this.enable = 1
				}
				console.log(this.enable)
				this.$store.commit('STT/USER/UPDATE_ATTRIBUTE', { customizationId: this.customizationId, enableVocabulary: parseInt(this.enable) })
        let params = {
          url: `/stt/users/${this.user.id}/update`,
					method: 'put',
          data: {
            id: this.user.id,
            CustomizationId: parseInt(this.customizationId),
						enableVocabulary: parseInt(this.enable)
          }
        }
        this.$q.notify({
          type: 'positive',
					message: this.selectedLanguage.customizationSaved,
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
	},
	components: {
		CustomizationLanguage
	}
}
</script>

