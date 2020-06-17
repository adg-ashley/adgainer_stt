<template>
  <div>
    <div class="bg-primary text-white">
        <q-btn dense flat icon="close" @click="rightSidebarDrawer = !rightSidebarDrawer"/>
    </div>
    <q-tabs no-pane-border>
      <q-tab default slot="title" name="tab-1" label="keywords"/>
      <!-- <q-tab slot="title"  name="tab-2" label="general" /> -->
      <q-tab slot="title" name="tab-3" v-lang.categories.vocabulary/>
      <q-tab-pane name="tab-1">
          <keywords :messages="Messages"/>
      </q-tab-pane>
      <!-- <q-tab-pane name="tab-2">
         <speech-setting/>
      </q-tab-pane> -->
      <q-tab-pane name="tab-3">
          <words-list :CustomizationId="User.CustomizationId"/> 
      </q-tab-pane>
    </q-tabs>
  </div>
</template>
<script>
import WordsList from './customizations/words/List'
import Keywords from './keywords'
import SpeechSetting from './speechSetting'
import {mapGetters} from 'vuex'
import lang from '../../lang/en/index.js'

export default {
  computed: {
    ...mapGetters('STT/USER', ['User']),
    ...mapGetters('STT/SPEECH', ['Messages']),
    ...mapGetters(['RightSidebarToogle']),
    rightSidebarDrawer: {
      get () { return this.RightSidebarToogle },
      set (val) { return this.$store.commit('SET_RIGHTSIDEBAR', val) }
    }
  },
  components: {
    WordsList,
    SpeechSetting,
    Keywords
  }
}
</script>

<style>

</style>
