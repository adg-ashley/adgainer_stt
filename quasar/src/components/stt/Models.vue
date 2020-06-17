<template>
    <div>
      <q-select
            v-model="model"
            float-label="Default Language"
            :options="models"
            @change="changeModel"/>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
import SpeechToText from 'watson-speech/speech-to-text'
export default {
  name: 'SttModels',
  data () {
    return {
      models: [],
      model: ''
    }
  },
  computed: {
    ...mapGetters(['SttToken']),
    ...mapGetters('STT', ['Settings'])
  },
  methods: {
    getModels () {
      SpeechToText.getModels({token: this.SttToken})
        .then((models) => {
          console.log(models)
          this.models = this.mapModels(models)
        }).catch(err => console.log('error loading models', err))
    },
    isBroadband (m) {
      return m.name.match(/BroadbandModel/)
    },
    isCustomizationAndSpeaker (m) {
      return (m.supported_features.custom_language_model && m.supported_features.speaker_labels)
    },
    mapModels (models) {
      return models.filter(this.isBroadband)
        .filter(this.isCustomizationAndSpeaker)
        .map(m => {
          return { label: m.description, value: m.name }
        })
    },
    changeModel (model) {
      this.$store.dispatch('STT/updateSetting', {model: model})
    }
  },
  created () {
    this.getModels()
    this.model = this.Settings.model
  }
}
</script>
