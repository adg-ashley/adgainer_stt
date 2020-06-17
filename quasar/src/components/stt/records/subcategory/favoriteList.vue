<template>
    <div class="docs-table q-ma-sm">
      <q-table
        ref="table"
        title="Favorites"
        :data="records.data"
        :columns="RecordColumns"
        selection="multiple"
        color="secondary"
        :selected.sync="selected"
        :pagination.sync="serverPagination"
        class="no-shadow"
        row-key="rid"
        :loading="http2.sending"
        @request="fetchList"
        :filter="filter"
        :rows-per-page-options="[ 6, 12, 24, 50, 100, 0]"
        
      >
      <template slot="top-right" slot-scope="props">
        <q-search hide-underline v-model="filter" />
      </template>
      <template slot="header" slot-scope="props" >
      <q-tr :props="props">
        <q-th auto-width>
          <q-checkbox
            :disabled="http2.sending"
            color="secondary"
            v-if="props.multipleSelect"
            v-model="props.selected"
            indeterminate-value="some"
          />
        </q-th>
        <template v-for="col in props.cols.filter(r => r.name !== 'action')">
          <q-th :key="col.name" :props="props" :width="col.width">
            {{ col.label }}
          </q-th>
        </template>
          <q-th  key="action" :props="props">
            <q-btn size="sm" v-if="selected.length > 0" color="negative" outline icon="delete"  @click="deleteRows" label="Delete" dense/>
          </q-th>
      </q-tr>
      </template>
      <template slot="body" slot-scope="props" >
        <q-tr :props="props" class="cursor-pointer" @click.native.stop="openModal(props.row)" >
            <q-td auto-width> <q-checkbox  :disabled="http2.sending" color="secondary" v-model="props.selected" /> </q-td>
            <q-td v-for="col in props.cols.filter(r => r.name !== 'action')" 
                :key="col.name" :props="props" :class="col.class"  
                :style="{width: col.width}">
                {{ col.value }}
            </q-td>
            <q-td key="action" style="width: 30%;" align="right">
                <div class="row full-width items-center justify-end actions">
                <div id="miscActions"> <!-- id="miscActions" --> 
                  <RecordDownload :record="props.row" class="download-btn" @click.stop />
                </div>
                <div style="padding-left: 15px;">
                  <q-btn :icon="props.row.IsPinned ? 'star' : 'star_border'" flat round @click.stop="favoriteRow(props.row)"/>
                </div>
                <div>
                  <q-btn-dropdown 
                      @click.stop
                      class="custom-dropdown q-mx-md col-md-4"
                      icon="more_horiz" icon-right="more_horiz" 
                      rounded flat dense >
                      <!-- dropdown content -->
                      <q-list dense link>
                        <q-item @click.native="openModal(props.row)">
                          <q-item-main>
                            <q-item-tile label>Edit</q-item-tile>
                          </q-item-main>
                        </q-item>
                        <q-item @click.native="deleteRow(props.row)">
                          <q-item-main>
                            <q-item-tile label>Delete</q-item-tile>
                          </q-item-main>
                        </q-item>
                      </q-list>
                  </q-btn-dropdown>
                </div>
              </div>
            </q-td>
        </q-tr>
      </template>
      </q-table>
      <records-modal-view :isDisplay="isDisplay" :record="record" @hide="isDisplay = false"/>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import RecordsEdit from '../edit'
import RecordsModalView from '../modalView'
import RecordColumns from '../columns'
import RecordDownload from '../download'
const FileSaver = require('file-saver')
const ab2str = require('arraybuffer-to-string')

export default {
  name: 'RecordsList',
  data () {
    return {
      RecordColumns,
      serverPagination: { rowsNumber: 12, rowsPerPage: 12, page: 1 },
      selected: [],
      filter: '',
      isDisplay: false
    }
  },
  computed: {
    ...mapGetters({http2: 'Http2'}),
    ...mapGetters( 'STT', { User :'USER/User', Records: 'RECORD/Records', Record: 'RECORD/Record' } ),
    records: {
      get () { return this.Records },
      set (val) { this.$store.commit('STT/RECORD/SET_RECORDS', val )}
    },
    rowCount: {
      get () { return this.records.total },
      set (val) { this.records.total = val}
    },
    record: {
      get () { return this.Record },
      set (val) { this.$store.commit('STT/RECORD/SET_RECORD', val) }
    }
  },
  watch: {
    rowCount () {
      this.fetchList({
      pagination: this.serverPagination,
      filter: this.filter })
    }
  },
  methods: {
    ...mapActions('STT/RECORD', ['fetch', 'delete', 'bulkDelete', 'update']),
    fetchList ({ pagination, filter }) {
      this.fetch({
        url: `/stt/records/favorites`,
        params: {
          favorite: true,
          filter:  filter,
          per_page: pagination.rowsPerPage
        }
      }).then ((data) => {
        this.serverPagination = pagination
        this.records = data
        this.serverPagination.rowsNumber = this.records.total // rowsNumber
        this.serverPagination.rowsPerPage = this.records.per_page // rowsPerPage
        
      })
    },
    deleteRow (row) {
      this.$q.dialog({ 
        title: 'Delete record?',
        message: `Are you sure you want to delete '${row.name}'?`,
        ok: 'Delete',
        cancel: 'Cancel'
      }).then(() => {
        this.delete({url: `/stt/records/${row.rid}`, method: 'DELETE'})
          .then((data)=> {
            this.rowCount = this.rowCount - 1
            this.deleteSelected(row)
            this.$q.notify({ type: 'positive', message: `'${row.name}' moved to trash.`, position: 'bottom-left'})
          })
      })
    },
    openModal (record) {
      //this.$router.push({path: `/`, query: { rid: record.rid, isCreated: record.created}})
      //this.$refs.editRecordModal.show()
      this.isDisplay = true
      this.record = record
    },
    deleteSelected (item) {
      this.selected = this.selected.splice(item.__index, 1)
    },
    deleteRows () {
       let rows = this.selected
       this.$q.dialog({ 
        title: 'Delete selected records?',
        message: `Are you sure you want to delete '${rows.length}' ${ rows.length > 1 ? 'files' : 'file' }? `,
        ok: 'Delete',
        cancel: 'Cancel'
      }).then(() => {
        var c = 1;
        const iterateRows = (rows, cb) => {
          rows.map((r) => {
            this.delete({url: `/stt/records/${r.rid}`, method: 'DELETE'})
              .then((data)=> {
              //c = c + 1
              this.deleteSelected(r)
              this.rowCount = this.rowCount - 1
              cb(c++)
            })
          })
        }
        iterateRows(rows, (i) => {    
          if (rows.length === i) {
            this.$q.notify( { type: 'positive', position: 'bottom-left', message: `successfully deleted '${rows.length}' ${ rows.length > 1 ? 'files' : 'file' }.`})
          }
        })
      })
    },
    favoriteRow (record) {
      let params = {
        url: `stt/records/${record.rid}/updatefavorite`,
        method: 'post',
        data: {
          rid: record.rid
        },
        params: {
          favorite: record.IsPinned ? false : true
        }
      }
      this.update(params).then((data) => {
        let records = this.records
        record.IsPinned = !record.IsPinned
        records[record.__index] = record
        this.records = records
      })
    }
  },
  mounted () {
    this.fetchList({
      pagination: this.serverPagination,
      filter: this.filter })
  },
  components: {
    RecordDownload,
    RecordsEdit,
    RecordsModalView
  }
  
}
</script>

<style >
  .padding {
    padding: 10px;
  }
  .custom-dropdown .on-right.q-btn-dropdown-arrow {
  display: none;
  }
  @media screen and (max-width: 1024px) {
    #miscActions {
        display: none !important;
    }
  }
  #miscActions {
    display: none;
    min-width: 90px;
  }
  tr {
    z-index: -1;
  }
  tr:hover #miscActions {
    display: block;
  }
  .actions {
  z-index: 10000;
  }

  td.ellipsis {
    max-width: 100px; 
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
