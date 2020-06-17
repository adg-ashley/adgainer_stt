<template>
    <div>

      <!-- 
        TODO: SEARCH METHODS
        <q-search v-model="filter"/> -->
      <q-list highlight class="no-border cursor" link>
        <template v-if="record">
          <q-item v-if="!record.hasOwnProperty('__index')">
              <q-item-main>
                <q-item-tile>
                    <!--  TODO: delete btn
                      <q-btn size="sm" class="float-right" dense flat icon="delete"/> -->
                    <p class="ellipsis q-headline text-weight-bold">{{record.name}}</p> 
                    <p class="q-body-1"> {{m(record.updatedAt, 'YYYYMMDD hh:mm:ss +Z').fromNow()}}</p>           
                    <p style="max-height: 100px;" class="row  full-width text-weight-light q-body-1 ellipsis" v-html="record.transcriptData"></p>
                </q-item-tile>
              </q-item-main>
            </q-item>
          </template>
          <template v-for="r in Records.data">
              <q-item :key="r.rid" @click.native="changeRecord(r)">
                <q-item-main>
                  <q-item-tile>
                      <!--  TODO: delete btn
                        <q-btn size="sm" class="float-right" dense flat icon="delete"/> -->
                      <p class="ellipsis q-headline text-weight-bold">{{r.name}}</p> 
                      <p class="q-body-1"> {{m(r.updatedAt, 'YYYYMMDD hh:mm:ss +Z').fromNow()}}</p>           
                      <p style="max-height: 100px;" class="text-weight-light q-body-1 ellipsis" v-html="r.transcriptData"></p>
                  </q-item-tile>
                </q-item-main>
              </q-item>
              <q-item-separator :key="r.rid + r.name"/>
          </template>
      </q-list>
    </div>
</template>

<script>
import moment from 'moment'
import {mapGetters} from 'vuex'
export default {
  data () {
    return { filter: '', m: moment }
  },
  computed: {
    ...mapGetters('STT/RECORD', [ 'Records', 'Record' ]),
    record: {
      get () { return this.Record },
      set (val) { this.$store.commit('STT/RECORD/SET_RECORD', val) }
    }
  },
  methods: {
    changeRecord (record) {
      this.record = record
    },
    truncate(string){
      if (!string) return
      console.log(string.length)
      if (string.length > 5) {
        return string.substring(0,5)+' ...'
      }else {
        return string
      }
    }
  }
}
</script>
<style>
  p.ellipsis {
    max-width: 200px; 
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  p.ellipsis-line3 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  }
</style>
