<!--
  record is [ editor content +  transcript ]
  emit from the editor 
-->
<template>
  <div>
    <q-toolbar color="grey-1" text-color="secondary">
      <q-toolbar-title shrink>
        <q-input
            shrink
            color="secondary"
            text-color="secondary"
            v-model="record.name"
            @click="recordNameEditable=!recordNameEditable" 
            :hide-underline="!recordNameEditable"
            class="no-border no-margin col-auto text-secondary"
            :loading="recordNameLoading"
            @input="recordNameLoading = !recordNameLoading"
            @keyup.enter="saveRecord({name: record.name})"> 
        </q-input>
      </q-toolbar-title>
      <div class="float-right full-width justify-end">
          <RecordDownload :record="this.Record"/>
      </div>
    </q-toolbar>
    
    <editor-with-transcript v-if="Stream"
      @updateTranscriptData="saveRecord({transcriptData: record.transcriptData})"
      @saveTranscriptData="saveTranscriptData"
      @pickedSource="showSourceModal"
    />
    <Editor
      v-else
      @updateTranscriptData="saveRecord({transcriptData: record.transcriptData})"
      @saveTranscriptData="saveTranscriptData"
      @pickedSource="showSourceModal"/>
    <stt-source :isDisplay="isDisplay" @hide="isDisplay=false"/>
  </div>
</template>
<script>
import Editor from './editor'
import EditorWithTranscript from './editorWithTranscript'
import RecordDownload from './download'
import SttSource from '.././source'
import {mapActions, mapGetters} from 'vuex'
export default {
  data () {
    return {
      recordNameEditable: false,
      recordNameLoading: false,
      isDisplay: false // transcripting
    }
  },
  computed: {
    ...mapGetters('STT/USER', ['User']),
    ...mapGetters('STT/RECORD', ['Record']),
    ...mapGetters('STT/SPEECH', ['Stream']),
    record: {
      get () { return this.Record },
      set (val) { this.$store.commit('STT/RECORD/SET_RECORD', val) }
    }
  },
  methods: {
    ...mapActions('STT/RECORD', ['createOrFind', 'update']),
    // createOrFindRecord () {
    //   let rid = this.$route.query.rid ? this.$route.query.rid : undefined
    //   return this.createOrFind({ url: '/stt/records', method: 'post', data: { UserId: this.User.id, rid: rid }})
    // },
    saveRecord (record) {
      this.update({ url: `/stt/records/${this.record.rid}`, 
        method: 'put', 
        data: record
      }).then((data) => {
        //this.recordNameEditable=false
        this.recordNameLoading=false
        console.log(data)
      })
    },
    saveTranscriptData (transcript) {
      // var vm = this
      //this.recordNameEditable=true
      this.recordNameLoading=true
      this.record.transcriptData = transcript
      this.saveRecord({ transcriptData: this.record.transcriptData })
    },
    showSourceModal (isDisplay) {
            console.log('test')
      this.isDisplay = isDisplay
    }
  },
  components: {
    Editor,
    EditorWithTranscript,
    SttSource,
    RecordDownload
  },
}
</script>