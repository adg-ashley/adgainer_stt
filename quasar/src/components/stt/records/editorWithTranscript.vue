<template>
    <div class="full-width bg-grey-1">
        <div class="row justify-left items-start">
        <div class="col-md-12">
          <q-editor
            class="no-border"
            v-model="editor"
            max-height="88vh"
            min-height="78vh"
            content-class="col-md-12 justify-center bg-grey-1  full-width q-mx-md full-height window-height"
            toolbar-flat
            toolbar-bg="grey-1"
            toolbar-outline
            :toolbar="[
            ['stt-sources'],
            ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
            ['token', 'hr', 'link', 'custom_btn'],
            ['print', 'share'],
            [
              {
                label: $q.i18n.editor.formatting,
                icon: $q.icon.editor.formatting,
                list: 'no-icons',
                options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
              },
              {
                label: $q.i18n.editor.fontSize,
                icon: $q.icon.editor.fontSize,
                fixedLabel: true,
                fixedIcon: true,
                list: 'no-icons',
                options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7']
              },
              {
                label: $q.i18n.editor.defaultFont,
                icon: $q.icon.editor.font,
                fixedIcon: true,
                list: 'no-icons',
                options: ['default_font', 'arial', 'arial_black', 'comic_sans', 'courier_new', 'impact', 'lucida_grande', 'times_new_roman', 'verdana']
              },
              'removeFormat'
            ],
            ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
            [
              {
                label: $q.i18n.editor.align,
                icon: $q.icon.editor.align,
                fixedLabel: true,
                list: 'only-icons',
                options: ['left', 'center', 'right', 'justify']
              }
            ],
            ['undo', 'redo'],
            ['newButton']
          ]"
          :fonts="{
            arial: 'Arial',
            arial_black: 'Arial Black',
            comic_sans: 'Comic Sans MS',
            courier_new: 'Courier New',
            impact: 'Impact',
            lucida_grande: 'Lucida Grande',
            times_new_roman: 'Times New Roman',
            verdana: 'Verdana'
          }"
        >

          <q-btn-group 
              slot="stt-sources" 
               color="black">
         
            <template v-if="!Stream">
              <q-btn dense flat outline icon="mic" @click="pickSource('mic')" />
              <q-btn dense flat outline icon="file_upload" @click="pickSource('file upload')"/>
            </template>
            <template v-else>
                <q-btn dense flat outline color="red" icon="stop" @click="stop()"/>
            </template>

          </q-btn-group>
        </q-editor>
        </div>
      </div>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import Vue from 'vue'
import ab2str from 'arraybuffer-to-string'

Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})

export default {
  data () {
    return { contentBuffer: '', stream: '' }
  },
  computed: {
    ...mapGetters('STT/SPEECH', [ 'SourceType', 
          'Stream', 'Messages', 'FinalAndCurrentInterimResult', 
          'FinalMessages', 'Transcript'
        ]),
    ...mapGetters('STT/RECORD', ['TranscriptDataStr', 'Record']),
    editor () {
        var vm = this
        let results = this.Transcript.filter(function(item, pos) {
          return vm.Transcript.indexOf(item) === pos
        })
        return ` <button-counter></button-counter> ${this.contentBuffer} ${results.reduce((a, b) => a.concat(b), '')}`
    },
    source: {
      get () { return this.SourceType  },
      set (val) { return this.$store.commit('STT/SPEECH/UPDATE_ATTRIBUTE_SOURCE', { type: val })}
    },
    messages: {
      get () { return this.Messages  },
      set (val) { return this.$store.commit('STT/SPEECH/PUSH_MESSAGES', val) },
    }
  },
  watch: {
    stream () {
      // console.log(this.Stream)
      if (this.Stream) {
        this.Stream.on('data', (res) => {
          this.messages = res 
          // this.$emit('saveTranscriptData', this.editor)
        }).on('end', (res) => {
           //this.$store.commit('STT/SPEECH/SET_MESSAGES', [])
          console.log('end of transcribing . . ')
          this.$emit('saveTranscriptData', this.editor)
        })
      }
    }
  },
  methods: {
    ...mapActions('STT/SPEECH', [ 'stopStream' ] ),
    wrapSpan () {
      return this.Transcript.map((msg) => {
        let str = `<span status="1" result-index="${msg.result_index}" result-final="${msg.final}">${msg.transcript}</span>`
        console.log(str)
        return str //`<span status="1" result-index="${msg.result_index}" result-final="${msg.final}">${msg.transcript}</span>`
      }).reduce((a, b) => a.concat(b), [])
    },
    pickSource (src) {
      this.source = src
      this.$emit('pickedSource', true)
    },
    stop () {
      this.$emit('saveTranscriptData', this.editor)
      //this.$store.commit('STT/SPEECH/UPDATE_ATTRIBUTE', {messages: []})
      this.stopStream()
    }
  },
  mounted () {
    this.contentBuffer = this.Record.transcriptData
    this.stream = this.Stream
    
  }
}
</script>
<style>
pre {
    height: auto;
    max-height: 200px;
    overflow: auto;
    background-color: #eeeeee;
}
</style>