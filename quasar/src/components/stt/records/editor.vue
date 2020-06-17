<template>
    <div class="full-width bg-grey-1">
        <div class="row justify-left items-start">
        <div class="col-md-12">
          <q-editor
            class="no-border"
            v-model="editor"
            max-height="78vh"
            min-height="78vh"
            content-class="col-md-12 justify-center bg-grey-1  full-width q-mx-md full-height window-height"
            toolbar-flat
            toolbar-bg="grey-1"
            toolbar-outline
            @input.native="$emit('saveTranscriptData', editor)"
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
              <q-btn dense flat outline icon="mic" @click.native="pickSource('mic')" />
              <q-btn dense flat outline icon="file_upload" @click.native="pickSource('file upload')"/>
            </template>
            <template v-else>
                <q-btn dense flat outline color="red" icon="stop" @click.native="stopStream()"/>
            </template>

          </q-btn-group>
        </q-editor>
        </div>
      </div>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import ab2str from 'arraybuffer-to-string'
export default {
  computed: {
    ...mapGetters('STT/RECORD', ['Record']),
    ...mapGetters('STT/SPEECH', ['Stream', 'SourceType']),
    source: {
      get () { return this.SourceType  },
      set (val) { return this.$store.commit('STT/SPEECH/UPDATE_ATTRIBUTE_SOURCE', { type: val })}
    },
    editor: {
      get () { 
        return this.Record.transcriptData ? this.Record.transcriptData : ''},
      set (val) { 
        return this.Record.transcriptData = val 
      }
    }
  },
  methods: {
    ...mapActions('STT/SPEECH', [ 'stopStream' ] ),
    pickSource (src) {
      this.source = src
      this.$emit('pickedSource', true)
    }
  }
}
</script>

