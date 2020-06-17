<template>
  <div>
    <stt-editor :transcript="transcript" />
    <q-scroll-area v-if="!IsEditor" class="window-height full-height q-px-lg"> 
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
          return {
              transcript: result.alternatives[0].transcript, 
              result_index: msg.result_index,
              speaker: (typeof result.speaker === 'number' ? result.speaker : -1)
            }
        })
      ).reduce((a, b) => a.concat(b), [])
      this.transcript = results.map((msg) => {
        let speakerHtml = '<div class="col-2 items-end">Detecting...</div>'
        if (msg.speaker !== -1) {
          speakerHtml = `<div class="col-2 items-end">Speaker ${msg.speaker}</div>`
        }
        return `<div class="row" result-index="${msg.result_index}">${speakerHtml}<div class="col-10 items-start">${msg.transcript}</div></div>`
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
