<template>
  <div>
    <speaker v-if="Settings.speaker_labels" :messages="finalAndCurrentIntermiResult()"/>
    <transcript v-else :messages="finalAndCurrentIntermiResult()"/>
    <q-modal 
      ref="openUploadFile" 
      :content-css="{minWidth: '80vw', minHeight: '80vh'}"
      @hide="handleStopFileUpload">
        <q-modal-layout>
          <div class="q-ma-md">
          <q-uploader url="" @add="setFiles" 
            :multiple="true" 
            :readonly="true"
            hide-upload-button
            hide-upload-progress
            stack-label
            auto-expand
            clearable
            />
          </div>
          <div class="absolute-bottom-right q-ma-md" >
          <q-btn outline color="default" label="cancel" @click="handleStopFileUpload()"/>
          <q-btn outline color="primary" label="Play All" @click="handleFileUpload(files)"/></div>
        </q-modal-layout>
    </q-modal>
    <q-modal
      ref="f$"
      :content-css="{minWidth: '60vw', minHeight: '60vh'}"
      >
      <q-modal-layout>
        <div class="q-ma-md">
          <q-field
            icon="insert_link"
            helper="url file must be downloable"
            label="Secure Url"
            :label-width="3"
            :error="$v.url.$error"
            :error-label="getError('url')"
          >
            <q-input 
              v-model="url" 
              @input="$v.url.$touch()" 
              float-label="https://sample.com/audio.mp3"/>
            <audio controls v-if="url" id="audioSrc">
              <source src="" type="audio/ogg">
            </audio>
        </q-field>
        </div>
        <div class="absolute-bottom-right q-ma-md" >
            <q-btn outline color="default" label="cancel" @click="$refs.UrlInput.hide()"/>
            <q-btn outline color="primary" label="Play" />
        </div>
      </q-modal-layout>
    </q-modal>
    <q-page-sticky  v-if="(SourceType === 'mic')" position="bottom-right"  :offset="[100, 100]">
       <vue-draggable-resizable :w="70" :h="70" >
        <div class="full-height row justify-center items-center">
          <!-- <q-spinner-puff color="primary" :size="70" > -->
          <q-btn
              size="xl"
              :color="(stream === undefined ? 'primary' : 'negative')"
              round
              outline
              icon="mic"
              class="bg-grey-1"
              @click="(stream === undefined ? handleRecognition() : stopRecognition() )"
          />
        </div>
        </vue-draggable-resizable>
      </q-page-sticky>
  </div>
</template>

<script>
import recognizeMicrophone from 'watson-speech/speech-to-text/recognize-microphone'
import recognizeFile from 'watson-speech/speech-to-text/recognize-file'
import Transcript from './transcript'
import Keywords from './keywords'
import Speaker from './speaker'
import VueDraggableResizable from 'vue-draggable-resizable'
import {mapGetters, mapActions} from 'vuex'
import { required, url } from 'vuelidate/lib/validators'
export default {
  name: 'Speech',
  props: {
    p: {
      type: Object, 
      default: { url: '' }
    }
  },
  data () {
    return { 
      stream: undefined,
      isStreaming:  false,
      messages: [],
      formatedMessages: [],
      url: '',
      files: undefined
    }
  },
  validations: {
    url: {
      required
    }
  },
  computed: {
    ...mapGetters('STT/USER', ['User']),
    ...mapGetters('STT/RECORDS', ['Record']),
    ...mapGetters('STT/SPEECH', ['Source', 'SourceType', 'Settings', 'Messages']),
    ...mapGetters('STT/MODEL', ['Models', 'UserModel'])
  },
  watch: {
    SourceType: function () {
      this.stopRecognition ()
      if (this.SourceType !== 'mic') { this.handleRecognition() }
    }
  },
  methods: {
    ...mapActions('STT/SPEECH', ['updateAttribute', 'updateSource']),
    extraSettings (extra) {
      return Object.assign({ 
        customization_id: this.UserModel.customization_id
      }, extra)
    },
    handleSettings (extra) {
      return Object.assign(this.Settings, extra)
    },
    handleRecognition () {
      if (this.SourceType === 'mic') {
        this.handleStream(this.handleMic())
      }
      if (this.SourceType === 'file_upload') {
        this.$refs.openUploadFile.show()
      }
      if (this.SourceType === 'https') {
        this.$refs.UrlInput.show()
      }
      
    },
    handleMic () {
      //const settings = Object.assign(this.Settings, this.extraSettings)
      console.log(this.handleSettings())
      return recognizeMicrophone(this.handleSettings())
    },
    getError (key) {
      let v = this.$v,
      msg = '',
      errors = {
        url: function () {
          if (!v.url.required) {
            msg = 'require field'
          }
          if (!v.url.url) {
            msg = 'invalid url'
          }
          return msg
        }
      }
      if (!errors.hasOwnProperty(key)) {
        return msg
      }
      return errors[`${key}`].call()
    },
    handleStopUrlInput () {
      //this.updateSource({type: undefined})
    },
    handleUrlInput () {      
      this.handleStream(this.playFile(this.url))
    },
    setFiles (files) {
      this.files = files
    },
    handleFileUpload (files) {
      var i = 0,
        stream = '',
        vm = this
      stream = this.playFile(files[i]) // first file 
      this.handleStream(stream)
      stream.on('end', () => {
        if (i < vm.files.length) {
          i++
          vm.handleStream(this.playFile(vm.files[i]))
        }  
      });
      //this.$refs.openUploadFile.hide()
    },
    // close/hide modal and update SourceType to undefined
    handleStopFileUpload () {
      //if (!this.files) {
        //this.updateSource({type: undefined})
      //}
      this.$refs.openUploadFile.hide()
    },
    handleStream (stream) {
      // make sure no active streaming
      if (this.stream) {
        this.stopRecognition()
      }
      this.stream = stream
      this.stream.on('data', this.handleMessages)
    },
    handleMessages (msg) {
      this.messages.push(msg) // same as this.messages.concat(msg) 
      console.log(this.messages)
    },
    playFile (file) {
      return recognizeFile(this.handleSettings({ 
        file,
        play: true, // play the audio out loud
        // use a helper stream to slow down the transcript output to match the audio speed
        realtime: true,
      }))
    },
    currentInterim () {
      const r = this.messages[this.messages.length - 1]
      if (!r || !r.results || !r.results.length || r.results[0].final) {
        return null
      }
      return r
    },
    finalInterim () {
      return this.messages.filter(r => r.results &&
      r.results.length && r.results[0].final)
    },
    finalAndCurrentIntermiResult () {
      let final = this.finalInterim()
      let interim = this.currentInterim()
      if (interim) {
        final.push(interim)
      }
      this.message = final
      this.updateAttribute({messages: this.messages})
      return this.message
    },
    stopRecognition () {
      if (this.stream) {
        this.stream.stop()
        this.stream.removeAllListeners()
        this.stream.recognizeStream.removeAllListeners()
        this.stream = undefined
      }
    }
  },
  components: {
    Transcript,
    Speaker,
    Keywords,
    VueDraggableResizable
  },
  created() {
    this.url = this.p.url  
  }
}
</script>

<style>

</style>
