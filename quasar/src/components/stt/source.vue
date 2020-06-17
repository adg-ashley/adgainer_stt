<template>
  <div>
      <q-page-sticky v-if="(source === 'mic')" position="bottom-right"  :offset="[140, 180]" class="z-top">
        <vue-draggable-resizable
            class="bg-white"
            :resizable="true" :w="130" :h="150" style="border: 1px dashed #bdbdbd;">
            <div class="row justify-end">
               <q-btn dense flat  @click="source = ''" size="sm" icon="close"/>
            </div>
            <div class="bg-grey-1 row justify-center items-center q-my-sm">
                <custom-model class="q-mx-sm"/>
            </div>
            <div class="bg-grey-1 row justify-center items-center q-my-sm">
              <q-btn v-if="!Stream"
                  color="primary"
                  size="xl"
                  round
                  outline
                  icon="mic"
                  class="bg-grey-1"
                  @click="handleStream({type: source})"
                >
              </q-btn>
              <q-btn v-else
                  color="red"
                  size="xl"
                  round
                  outline
                  icon="mic"
                  class="bg-grey-1"
                  @click="stop()"
                >
              </q-btn>
            </div>
        </vue-draggable-resizable>
      </q-page-sticky> 
      <q-modal
          id="test"
          v-model="showModal"
          @hide="closeModal" ref="openModal" :content-css="{minWidth: '65vw', minHeight: '65vh'}">
          <q-modal-layout  v-if="(source === 'file upload')" >
            <div class="full-width row justify-end"><q-btn dense color="red" flat @click="closeModal" size="md" icon="close"/> </div>
            <div class="q-ma-md">
              <q-alert v-if="error" type="negative" dense class="q-mx-md" :actions="[{ icon: 'close', handler: () => { error = false } }]">{{errorMessage}}</q-alert>
             <q-list class="no-border">
                <q-list-header>Source as File</q-list-header>
                <q-item>
                  <q-item-side>Language Model</q-item-side>
                  <q-item-main><custom-model class="q-mx-sm"/></q-item-main>
                </q-item>
               <q-item>
                  <!-- <q-item-side>Files </q-item-side> -->
                  <q-item-main> 
                    <!--
                      https://console.bluemix.net/docs/services/speech-to-text/audio-formats.html#audio-formats
                    -->
                    <!-- {{files}} -->
                    <q-uploader
                      float-label="uploaded files with less than 100mb, file type of (.mp3, .wav, .flac, .ogg)"
                      @add="addFiles"
                      @remove:cancel="removeCancel"
                      url=""
                      files=""
                      :multiple="true" 
                      :readonly="true"
                      hide-upload-button
                      hide-upload-progress
                      stack-label
                      auto-expand
                      clearable
                      extensions=".mp3, .wav, .flac, .ogg"
                    />
                    <!-- <audio class="full-width" controls v-for="(file,i) in SourceFiles" :key="i">
                      <source :src="createUrl(file)" type="audio/ogg" >
                    </audio> -->
                  </q-item-main>
              </q-item>
             </q-list>
             </div>
            <div class="absolute-bottom-right q-ma-md" >
              <q-btn outline color="default" label="cancel"  @click="closeModal"/>
              <q-btn outline color="secondary" :disable="disablePlayAllBtn" @click="playAll()" label="Transcribe"/>
            </div>
          </q-modal-layout>
      </q-modal>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import VueDraggableResizable from 'vue-draggable-resizable'
import CustomModel from './customModel'
export default {
  props: {
    isDisplay: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return { disablePlayAllBtn: true, error: false, errorMessage: '', modalDisplay: false, displaModal: 'none' }
  },
  computed: {
    ...mapGetters('STT/SPEECH', [ 'SourceFiles', 'SourceType', 'Stream']),
    source: {
      get () { return this.SourceType  },
      set (val) { return this.$store.commit('STT/SPEECH/UPDATE_ATTRIBUTE_SOURCE', { type: val })}
    },
    files: {
      get () { return this.SourceFiles  },
      set (val) { return this.$store.commit('STT/SPEECH/UPDATE_ATTRIBUTE_SOURCE', { files: val })}
    },
    showModal: {
      get () {
        if (this.source === 'file upload') {
          return this.isDisplay 
        } else {
          return false
        }
      },
      set (val) { this.isDisplay }
    }
  },
  watch: {
    files () {
      if (this.files.length > 0 && !this.error) {
        this.disablePlayAllBtn = false
      } else {
        this.disablePlayAllBtn = true
      }
    }
  },
  methods: {
    ...mapActions('STT/SPEECH', ['handleStream', 'stopStream']),
    closeModal () {
      this.source = ''
      // this.$refs.openModal.hide()
      this.modalDisplay=false
      this.$emit('hide', false)
    },
    validateFiles (files) {
      // console.log(files)
      // console.log(files.size +' > 13107200')
      // if (files.size > 13107200) {
      //   this.error = true
      //   return false
      // } else {
      //   return true
      // }
      console.log(files)
      let f = []
      // 15632856
      f = files.filter(file => file.size > 104857600)
      console.log(f)
      if(f.length > 0) {
        this.errorMessage = 'each file must not exceed 100mb'
        this.error = true
        this.disablePlayAllBtn = true
        return false
      } else {
        this.error = false
        this.disablePlayAllBtn = false
        return true
        
      }

    },
    addFiles (files) {
      // let f = Object.assign({index: this.files.length}, file)
      //console.log(f)
      this.error = false
      this.files = files
      this.validateFiles(this.files)

     // console.log(this.files)
      //this.playAble = false
    },
    removeCancel (file) {
      
      this.files.map((f, index) => {
        if (file.name === f.name) {
          this.files.splice(index, 1)
        }
      })

      this.validateFiles(this.files)

    },
    createUrl (file) {
      return URL.createObjectURL(file)
    },
    playAll () {
      var i = 0,
        stream = '',
        vm = this
      this.handleStream({type: this.source, file: this.SourceFiles[i]})// first file 
      // this.handleStream(stream)
      this.Stream.on('end', () => {
        if (i < vm.files.length) {
          i++
          this.handleStream({type: this.source, file: this.SourceFiles[i]})// first file 
        } 
      });
      this.disablePlayAllBtn = true
      // handleStream({type: this.source, file: })
    },
    stop () {
      this.stopStream()
      this.$store.commit('STT/SPEECH/UPDATE_ATTRIBUTE', {messages: []})
    }
  },
  components: {
    VueDraggableResizable,
    CustomModel
  }
}
</script>

<style>

</style>

