<template>
  <div class="q-table-container no-shadow column items-center justify-center q-pa-sm">
        <q-infinite-scroll inline :handler="loadMore" ref="infiniteScroll" class="full-width">
            <table class="q-table q-table-dense q-table-bordered q-table-horizontal-separator">
              <thead class="q-my-sm">
                <tr style="height: auto">
                    <td class="no-border no-padding no-margin"> 
                      <div class="row">
                      <q-btn-group outline class="full-width">
                        <q-search v-model="q" class="full-width" hide-underline/>
                        <q-btn dense icon="add" @click="$refs.ModalForm.show()"/>
                      </q-btn-group>
                      </div>
                      <div class="row q-ma-sm">
                       <q-chip 
                          dense closable  
                          v-if="closable1 && q !== ''"  
                          @hide="closable1 = false, q = ''"
                          color="light">word: {{q}}</q-chip>
                      <q-chip 
                          dense closable 
                          v-if="closable2 && perLetter !==''"  
                          @hide="closable2 = false, perLetter= ''" 
                          color="light">Letter: {{perLetter}}</q-chip>
                    
                      </div>
                    </td>
                </tr>
              </thead>
              <tbody  v-if="Words.data.length > 0" class="q-my-sm">
                  <template v-for="(word, index) in Words.data">
                      <tr v-if="isFirstChar(word, Words.data[index-1])" :key="word.id+ 'l'" class="bg-light">
                        <td style="height: auto" 
                          class="q-pa-md" colspan="2">
                          <a href="javacript: void();" class="btn" @click="perLetter = word.word_name.toUpperCase().charAt(0)">{{word.word_name.toUpperCase().charAt(0)}}</a>
                        </td>
                      </tr>
                      <tr :key="word.id + 'w'">
                        <td data-th="Word" class="text-left ellipsis"> 
                          <div class="row justify-between">
                            <div class="col-7">
                              <div class="full-height column justify-center">
                                {{capitalize(word.word_name)}}
                                <q-tooltip anchor="bottom left" self="top left" :offset="[5, 5]">
                                  <p><b>Word:</b> {{capitalize(word.word)}}</p>
                                  <p><b>Word Name:</b> {{capitalize(word.word_name)}}</p>
                                  <p><b>Display As:</b> {{word.display_as}}</p>
                                  <p><b>Sounds Like:</b> {{word.sounds_like}}</p>
                                  <!-- <p><b>Source:</b> {{word.source}}</p> -->
                                </q-tooltip>
                              </div>
                            </div>
                            <div class="col-5">
                                <!-- <words-actions :itemIndex="index" :item="word"/> -->
                                  <q-btn flat rounded dense icon="volume up" color="positive" small class="float-right"/>
                                  <q-btn flat @click="confirmDestroy(word, index)" rounded dense icon="delete" color="negative" small class="float-right"/>
                            </div>
                          </div>
                        </td>
                      </tr>
                  </template>
              </tbody>
              <tbody class="no-border" v-else>
                <tr class="no-border">
                    <td class="no-border q-table-bottom row items-center q-table-nodata no-pointer-events">  
                      <q-icon name="warning" /> no data available 
                      </td>
                </tr>
              </tbody>
            </table>
          <!-- <div v-else class="q-pa-sm column justify-center items-center" style="min-height: 80vh;">
                  <q-alert
                    icon="info"
                    color="primary"
                    :actions="[{ outline: true, icon: 'add', label: 'Add Word', handler: () => { $router.push({path: '/vocabulary/new' })} }]"
                    class="q-mb-sm shadow-1"
                    >
                    <span>No words. adding vocabulary will improve transcribing.</span>
                    </q-alert>
              </div> -->
            <div class="row justify-center" style="margin-bottom: 50px;">
              <q-spinner-dots slot="message" :size="40" v-if="scrolling"/>
            </div>
        </q-infinite-scroll>
     <q-dialog
        v-model="showDialog"
        :cancel="false"
        :ok="false"
      >
      <span slot="title">Are you sure?</span>
      <span slot="message">Will remove this permanently.</span>
      <div slot="body">
        <q-progress v-if="isProcess" indeterminate color="primary" />
      </div>
       <template slot="buttons" slot-scope="props">
         <q-btn flat color="default" label="cancel" @click="props.cancel" />
         <q-btn color="negative" label="confirm" @click="choose(props)" />
       </template>
     </q-dialog>
     <q-modal ref="ModalForm" :content-css="{minWidth: '80vw'}">
       <WordsForm @cancel="$refs.ModalForm.hide()"/>
     </q-modal>
  </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import WordsActions from './Actions'
import WordsForm from './form'
export default {
  data () {
    return { q: '', perLetter: '', 
      closable1: true,
      closable2: true ,
      scrolling: false,
      showDialog: false,
      item: {},
      itemIndex: -1,
      isProcess: false
    }
  },
  name: 'WordsList',
  computed: {
    ...mapGetters('STT/WORD', ['Words']),
    ...mapGetters('STT/USER', ['User'])
  },
  watch: {
    q () {
      this.closable2 = (this.perLetter !== '') ? true : false 
      return this.fetch()
    },
    perLetter () {
      this.closable2 = (this.perLetter !== '') ? true : false 
      return this.fetch()
    }
  },
  methods: {
    ...mapActions('STT/WORD', ['fetchList', 'destroyItem']),
    fetch () {
      this.fetchList({url: `/stt/customizations/${this.User.CustomizationId}/words`,
        params: { q: this.q, perLetter: this.perLetter, per_page: 12 }
      })
    },
    choose (fnc) {
      this.isProcess = true
      this.destroyItem({ url: `/stt/customizations/${this.item.CustomizationId}/words/${this.item.id}`,
        method: 'DELETE', 
        data: this.item
      }).then((result) => {
        // console.log(result)
        fnc.ok()
        this.isProcess = false
        this.$store.commit('STT/WORD/REMOVE_ITEM', this.itemIndex)
      }).catch((err) => {
        fnc.cancel()
        this.isProcess = false
        console.log(err)
        this.$q.notify({ message: err.error, type: 'negative', position: 'bottom-left' })
      })
    },
    confirmDestroy (item, itemIndex) {
      this.showDialog = true
      this.item = item
      this.itemIndex = itemIndex
    },
    loadMore (index, done) {
      if (this.Words.next_page_url) {
        this.scrolling = true
        this.$http2.exec({url: this.Words.next_page_url})
          .then((result) => {
            this.$store.commit('STT/WORD/CONCAT_WORDS', result)
            done()
          })
      } else {
        this.scrolling = false
        this.$refs.infiniteScroll.stop(done())
      }
    },
    capitalize (word) {
      return word.replace(/^./, word[0].toUpperCase())
    },
    isFirstChar (word1, word2) {
      if (!word2) {
        return true
      }
      else {
        let w1 = this.capitalize(word1.word_name)
        let w2 = this.capitalize(word2.word_name)
        if (w1.charAt(0) !== w2.charAt(0)) {
          return true
        }
      }
      return false
    }
  },
  created () {
    this.fetch()
  },
  components: {
    WordsActions,
    WordsForm
  }
}
</script>
<style>
.q-btn-dropdown-arrow {
  display: none !important;
}
</style>

