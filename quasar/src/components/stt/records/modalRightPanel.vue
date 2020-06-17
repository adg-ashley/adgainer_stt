<template>
  <div class="full-height">
        <q-tabs class="no-border bg-grey-1" no-pane-border color="grey" text-color="black" >
        <!-- Tabs - notice slot="title" -->
          <q-tab class="" default  slot="title" name="tab-1" label="Records" />
          <q-tab slot="title" name="tab-2" label="Settings" />
          <q-tab slot="title" name="tab-3" label="Vocabulary" />

          <!-- Targets -->
          <q-tab-pane class="no-border" name="tab-1">
            <records-list-on-modal/>
          </q-tab-pane>
          <q-tab-pane  default class="no-border" name="tab-2">
            <q-list class="no-border">
            <q-item>
              <q-item-main>
              <p class="caption">Speaker Label</p>
              <q-toggle v-model="speakerLabel" label="On/Off" />
              </q-item-main>
            </q-item>
            <!-- <q-item>
              <q-item-main>
                <p class="caption">Alternatives</p>
                <q-toggle v-model="wordAlternatives" label="On/Off" />
              </q-item-main>
            </q-item>
            <q-item> -->
              <q-item-main>
                <!-- <p class="caption">Keywords</p> -->
                <stt-keywords :messages="Messages"/>
              </q-item-main>
            </q-item>
            </q-list>
          </q-tab-pane>
          <q-tab-pane  class="no-border" name="tab-3">
            <word-list/>
          </q-tab-pane>
        </q-tabs>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
import RecordsListOnModal from './listOnModal'
import WordList from '../customizations/words/List'
import SttKeywords from '../keywords'
export default {
  computed: {
    ...mapGetters('STT/SPEECH', [ 'Messages', 'IsSpeakerLabel', 'IsWordAlternatives' ]),
    ...mapGetters('STT/RECORD', 'Records'),
    speakerLabel: {
      get () { return this.IsSpeakerLabel },
      set (val) { this.$store.commit('STT/SPEECH/SET_SPEAKERLABEL', val) }
    },
    wordAlternatives: {
      get () { return this.IsWordAlternatives },
      set (val) { this.$store.commit('STT/SPEECH/SET_WORDALTERNATIVES', val) }
    }
  },
  components: {
    RecordsListOnModal,
    WordList,
    SttKeywords
  }
}
</script>
