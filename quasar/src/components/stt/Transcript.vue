<template>
  <div>
    <stt-editor :transcript="transcript" />
    <q-scroll-area v-if="!IsEditor" class="window-height full-height q-pa-lg"> 
      <div v-html="transcript"></div>
    </q-scroll-area>
  </div>
</template>
<script>
import SttEditor from './editor'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      transcript: '',
    }
  },
  props: {
    messages: {
      type: [Object, Array],
      default: []
    }
  },
  watch: {
    messages: function () {
      const results = this.messages.map(msg =>
        msg.results.map((result, i) => {
          return {transcript: result.alternatives[0].transcript, result_index: msg.result_index}
        })
      ).reduce((a, b) => a.concat(b), [])
      this.transcript = results.map((msg) => {
        return `<span result-index="${msg.result_index}">${msg.transcript}</span>`
      }).reduce((a, b) => a.concat(b), '')
      if (this.transcript !== '') {
        this.$store.dispatch('STT/SPEECH/updateAttribute', {transcript: this.transcript})
      }
    }
  },
  computed: {
    ...mapGetters('STT/SPEECH', ['IsEditor'])
  },
  components: {
    SttEditor
  }
}
</script>
