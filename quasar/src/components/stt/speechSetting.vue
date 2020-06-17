<template>
  <div>
    <q-list no-border>
      <q-item>
        <q-item-main>
          <q-select
            float-label="Language"
            v-model="CustomizationId"
            :options="models"
            @input="updateModel"
          />
        </q-item-main>
      </q-item>
      <!-- <q-item>
        <q-item-main>
          <q-chips-input
            float-label="Keywords"
            v-model="settings.keywords"
            @input="updateSettings(Object.assign(settings, {
              keywords_threshold: (settings.keywords.length ? 0.01 : undefined )
            }))"
          />
        </q-item-main>
      </q-item> -->
      <q-item>
        <q-item-main>
          <q-toggle
            label="Enable speaker detection"
            v-model="settings.speaker_labels"
            @input="updateSettings(Object.assign(settings, {
              resultsBySpeaker: settings.speaker_labels,
              speakerlessInterim: settings.speaker_labels
            }))"
          />
        </q-item-main>
      </q-item>
      <q-item>
        <q-item-main>
          <q-toggle
            label="Enable rich editor"
            v-model="speech.editor"
            @input="updateAttribute(speech)"
          />
        </q-item-main>
      </q-item>
    </q-list>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  data () {
    return {
      CustomizationId: 1,
      model: {},
      speech: {
        editor: true
      },
      settings: {
        keywords: [],
        speaker_labels: false
      }
    }
  },
  computed: {
    ...mapGetters('STT/USER', ['User']),
    ...mapGetters('STT/SPEECH', ['IsEditor', 'IsSpeakerLabel', 'Settings']),
    ...mapGetters('STT/MODEL', ['UserModel']),
    models: {
      get () { return this.$store.getters['STT/MODEL/ModelOptions'] },
      set () { return this.getModels() }
    }
  },
  methods: {
    ...mapActions('STT/MODEL', [
      'fetchModels'
    ]),
    ...mapActions('STT/USER', {
      sttUserUpdate: 'update'
    }),
    ...mapActions('STT/SPEECH', [ 'updateAttribute', 'updateSettings' ]),
    getModels () {
      return this.fetchModels({ url: '/stt/customizations/models' })
    },
    updateModel () {
      this.sttUserUpdate({url: `/stt/users/${this.User.id}/update`, data: { CustomizationId: this.CustomizationId }, method: 'put'})
    }
  },
  created () {
    this.CustomizationId = this.User.CustomizationId
    this.model = this.UserModel
    this.speech.editor = this.IsEditor
    this.settings.speaker_labels = this.Settings.speaker_labels
    this.settings.keywords = this.Settings.keywords
    this.getModels()
  }
}
</script>

<style>

</style>
