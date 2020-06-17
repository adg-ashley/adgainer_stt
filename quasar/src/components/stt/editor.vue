<template>
    <div class="full-width bg-grey-1">
      <q-toolbar color="grey-1" text-color="black">
          <div class="row full-width">
            <div class="col-6 col-md-4 col-md-4 column items-start">
            <q-toolbar-title class="text-faded">
              <q-input v-model="fileName"
                @click="readonly=!readonly" 
                :hide-underline="readonly" 
                :readonly="readonly" 
                class="no-border no-margin" @keyup.enter="saveTranscript()"> 
                <!-- <q-btn outline rounded no-caps dense color="primary" @click="saveTranscript()">Save </q-btn> -->
              </q-input>
              <span slot="subtitle">{{status}}</span>
            </q-toolbar-title>
            </div>
            <div class="col-6 col-md-4 col-md-4 column items-center">
              <div v-if="this.transcript && this.SourceType">
              <q-btn-group flat class="text-primary">
                <span class="q-pr-sm" >transcribing . . . </span> 
                <q-btn color="red" outline label="STOP" size="sm" dense icon="stop" @click="updateSource({type: undefined})"/> 
              </q-btn-group>
              </div>
            </div>
            <div class="col-6 col-md-4 col-md-4 column items-end">
              <SttSources :fileName="fileName" :editor="editor"/>
            </div>
          </div>
      </q-toolbar>
        <div class="row justify-left items-start">
        <div class="col-md-12">
          <q-editor
          class="no-border"
          @input="saveEditorContent" v-if="IsEditor" v-model="editor"
          content-class="col-md-12 justify-center bg-grey-1  full-width q-mx-md full-height window-height"
          toolbar-flat
          toolbar-bg="grey-1"
          toolbar-outline
          :toolbar="[
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
          ['mic', 'file_upload'],
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
          <q-btn slot="mic" dense flat outline color="black" icon="mic"  @click="updateSource({type: 'mic'})">
            <q-tooltip  anchor="bottom middle" self="top middle" :offset="[10, 10]">
              Record Voice
            </q-tooltip>
          </q-btn>

          <q-btn slot="file_upload" flat dense outline color="black" icon="file_upload" @click="updateSource({type: 'file_upload'})">
            <q-tooltip  anchor="bottom middle" self="top middle" :offset="[10, 10]">
              Upload File
            </q-tooltip>
          </q-btn>
          <q-btn slot="file_upload" flat dense outline color="black" icon="file_upload" @click="updateSource({type: 'file_upload'})">
            <q-tooltip  anchor="bottom middle" self="top middle" :offset="[10, 10]">
              Upload File
            </q-tooltip>
          </q-btn>
          <!--
            TODO: SOURCE AS URL
          -->
          <!-- <q-btn slot="https" dense flat outline color="black" icon="https" @click="updateSource({type: 'https'})">
            <q-tooltip  anchor="bottom middle" self="top middle" :offset="[10, 10]">
              Use link
            </q-tooltip>
          </q-btn> -->
        </q-editor>
        </div>
      </div>
    </div>
</template>

<script>
import VueDraggableResizable from 'vue-draggable-resizable'
import SttSources from './sources'
import { mapGetters, mapActions } from 'vuex'
import en from '../../lang/en/categories'
import ja from '../../lang/ja/categories'

export default {
  props: ['transcript'],
  data () {
    return {
      fileName: 'Untitled',
      transcriptData: '',
      transcriptDataFinal: '',
      lang: '',
      readonly: true,
      status: ''
    }
  },
  computed: {
    ...mapGetters('STT/SPEECH', ['Editor', 'IsEditor', 'Source', 'SourceType', 'Speaker', 'Settings', 'FinalTranscript']),
    ...mapGetters({user: 'STT/USER/User'}),
    selectedLanguage: function () {
      return this.language === 'en-us' ? en : ja
    },
    editor: {
      get () { return this.$store.getters['STT/SPEECH/Editor'] },
      set (val) { return this.$store.state.STT.SPEECH.editor = val }
    }
  },
  methods: {
    ...mapActions('STT/SPEECH', ['updateSource']),
    saveEditorContent (val) {
      return this.$store.dispatch('STT/SPEECH/updateAttribute', { editor: val, transcript: '' })
    },
    saveTranscript () {
       this.$q.dialog({
        title: this.selectedLanguage.saveTranscript,
        message: this.selectedLanguage.messageTranscript,
        ok: this.selectedLanguage.ok,
        cancel: this.selectedLanguage.cancel
      }).then(() => {
        if (!this.IsEditor) { 
          if (this.Settings.speaker_labels) {
            for (var i = 0; i < this.Speaker.length; i++) {
              let transcriptData = 'Speaker ' + this.Speaker[i] + ': ' + this.FinalTranscript[i]
              this.transcriptData.push(transcriptData)
              this.transcriptDataFinal = this.transcriptData.join('\r\n\n')
            }
          }
          else {
            this.transcriptDataFinal = this.FinalTranscript.join('')
          }
          let params = {
            url: `/stt/records/save`,
            method: 'post',
            data: {
              id: this.user.id,
              transcriptData: this.transcriptDataFinal,
              fileName: this.fileName,
              source: this.Source.type,
              customizationId: this.user.CustomizationId
            }
          }
          this.$q.notify({message: 'Transcript Saved', type: 'positive', position: 'bottom-left'})
          return this.$store.dispatch('STT/RECORDS/fetchList', params)
        } else {
          let params = {
            url: `/stt/records/save`,
            method: 'post',
            data: {
              id: this.user.id,
              transcriptData: this.editor,
              fileName: this.fileName,
              source: this.Source.type,
              customizationId: this.user.CustomizationId
            }
          }
          this.$q.notify({message: 'Transcript Saved', type: 'positive', position: 'bottom-left'})
          return this.$store.dispatch('STT/RECORDS/fetchList', params)
        }
      }).catch(() => {
        console.log('Not Saved')
      })
    },
    createNew () {
      this.editor = ''
      this.fileName = 'Unnamed Transcript'
    }
  },
  components: {
    SttSources,
    VueDraggableResizable
  }
}
</script>

