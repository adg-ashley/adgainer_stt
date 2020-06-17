<template>
  <div class="docs-table q-ma-sm">
    <q-table
      class="no-border no-shadow"
      title="Voices List"
      :data="voices.data"
      :columns="VoicesTableConfig.columns"
      :pagination.sync="paginationControl"
    >
    <template slot="top-right" slot-scope="props">
      <q-search hide-underline v-model="filter" />
    </template>
    <q-tr slot="body" slot-scope="props" :props="props">

      <q-td key="actions" :props="props">
        <!-- <div style="text-align: center;">
          <q-btn color="primary" round dense flat  icon="eject" @click="showTranscript(cell.row)" />
        </div> -->
        <span class="text-bold">
             <q-btn no-caps flat dense @click="showVoiceModal(props.row)">
              {{ props.row.unique_call_id.substr(props.row.unique_call_id.length - 8) }}.mp3          
             </q-btn>
        </span>
      </q-td>
      <q-td  key="phone_number" :props="props">
        {{ props.row.phone_number}}
      </q-td>

      <q-td  key="caller_number" :props="props">
        {{ props.row.caller_number}}
      </q-td>
      <q-td  key="account_id" :props="props">
        <span class="text-bold">{{ props.row.account_id.substr(props.row.account_id.length - 8) }}</span>
        <q-tooltip>{{ props.row.account_id }}</q-tooltip>
      </q-td>

      <q-td key="account_name" :props="props">
        <span class="text-italic">{{ props.row.AdAccount ? props.row.AdAccount.accountName : '' }}</span>
      </q-td>

      <q-td  key="campaign_id" :props="props">
        <span class="text-bold">{{ props.row.campaign_id.substr(props.row.campaign_id.length - 8) }}</span>
        <q-tooltip>{{ props.row.campaign_id }}</q-tooltip>
      </q-td>

      <q-td  key="campaign_name" :props="props">
        <span class="text-italic">{{ props.row.AdCampaign ? props.row.AdCampaign.campaign_name : '' }}</span>
      </q-td>
    </q-tr>

    </q-table>
    <transcript-modal ref="modalTranscript" />
    <q-modal ref="modalVoice">
                
                <q-card v-if="voice">
                  <q-card-title>
                      {{ voice.unique_call_id.substr(voice.unique_call_id.length - 8) }}.mp3   
                  </q-card-title>
                  <q-card-main>
                      <audio controls class="full-width">
                      <source :src="`http://callrecordings.calltracking.jp/audio/${voice.unique_call_id}.mp3`" type="audio/mpeg"/>
                      </audio>
                  </q-card-main>
                   <q-card-separator />
                   <q-card-actions vertical>
                    <q-btn class="full-width" color="primary" no-caps outline   icon="file download"
                        @click="checkIfExist(`http://callrecordings.calltracking.jp/audio/${voice.unique_call_id}.mp3`)">
                        Download
                    </q-btn>
                    <q-btn class="full-width" color="primary" no-caps outline  icon="add">
                        Add To Records
                    </q-btn>
                   </q-card-actions>
                </q-card>
    </q-modal>
  </div>  
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TranscriptModal from '../../../components/ad/transcriptModal'
import VoicesTableConfig from './tableConfig'

export default {
  data () {
    return {
      VoicesTableConfig,
      paginationControl: { rowsPerPage: 10, page: 1 },
      expand: false,
      voice: undefined,
      filter: ''
    }
  },
  components: {
    TranscriptModal
  },
  computed: {
    ...mapGetters({
      voices: 'AD/VOICES/Voices'
    }),
    ...mapGetters('STT/USER', ['User'])
  },
  methods: {
    ...mapActions('AD/VOICES', ['fetchList']),
    fetch () {
      this.fetchList({url: `/ad/voices/list`,
        params: {
          page: this.paginationControl.page
        },
        headers: {
          Authorization: `Bearer ${this.User.adToken}`
        }
      })
    },
    showTranscript (data) {
      this.$refs.modalTranscript.open(data)
    },
    showVoiceModal (data) {
      console.log(data)
      this.voice = data
      this.$refs.modalVoice.show()
    },
    checkIfExist(url) {
      window.open(url, 'Download')
    },
  },
  created () {
    this.fetch()
  }
}
</script>

<style>
  .padding {
    padding: 10px;
  }
</style>
