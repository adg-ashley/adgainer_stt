<template>
  <div>
     <q-modal v-model="showModal" no-esc-dismiss maximized ref="editRecordModal" class="bg-grey-1">
        <q-modal-layout content-class="bg-grey-1">
          <q-btn icon="close" flat @click.native="closeModal"/>
            <div class="row">

              <div class="col-md-9 q-px-md">
                <records-edit/>
              </div>
              <div class="col-md-3 q-px-lg">
                <records-modal-right-panel/>
              </div>
            </div>
        </q-modal-layout>
      </q-modal>
  </div>
</template>
<script>
import RecordsEdit from './edit'
import SttKeywords from '../keywords'
import RecordsModalRightPanel from './modalRightPanel'
import { mapGetters } from 'vuex'
export default {
  props: { 
    isDisplay: {
      type: Boolean,
      default: false
    }
  },
  name: 'RecordsModalView',
  computed: {
    ...mapGetters('STT/RECORD', [ 'Records', 'Record']),
    showModal: { 
      get () { return this.isDisplay },
      set () { return this.isDisplay }
    },
    record: {
      get () { return this.Record },
      set (val) { this.$store.commit('STT/RECORD/SET_RECORD', val) }
    },
    records: {
      get () { return this.Records },
      set (val) { this.$store.commit('STT/RECORD/SET_RECORDS', val )}
    },
  },
  methods: {
    closeModal () {
      console.log('testing hide')
      this.$emit('hide', false)
      //this.isDisplay = false
      if (!this.record.hasOwnProperty('__index')){
        this.Records.total = this.Records.total + 1
        this.Records.data.unshift(this.record)
        this.$store.commit('STT/RECORD/SET_RECORDS', this.Records)
        //this.record = undefined
      }
      this.$refs.editRecordModal.hide()
      
    }
  },
  components: {
    RecordsEdit,
    SttKeywords,
    RecordsModalRightPanel
  }
}
</script>
