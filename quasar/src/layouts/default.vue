<template>
  <q-layout view="lHh lpR lFf" >
    <q-layout-header class="no-shadow bordered">
      <q-toolbar
        text-color="black"
        color="grey-1"
        :flat="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          VoiceNote
          <!-- <div slot="subtitle">Speech to Text v{{version}}</div> -->
        </q-toolbar-title>

        <!-- <q-btn-dropdown :label="lang" icon="language" flat dense rounded>
          <q-list link>
            <q-item v-close-overlay @click.native="changeLanguage('en-us')">
              <q-item-main>
                <q-item-tile label>English</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item v-close-overlay @click.native="changeLanguage('ja')">
              <q-item-main>
                <q-item-tile label>日本語</q-item-tile>
              </q-item-main>
            </q-item>
          </q-list>
        </q-btn-dropdown> -->
        
        <q-btn-dropdown
          class="custom-dropdown"
          rounded flat dense icon="more_vert" 
          icon-right="more_vert"
          :content-style="{width: '200px'}"
          >
          <q-list link dense>
            <q-item @click.native="recordPost()" >
              <q-item-main> New Record </q-item-main>
            </q-item>
            <q-item @click.native="$refs.ModalForm.show()" >
              <q-item-main> New Vocabulary </q-item-main>
            </q-item>
            <q-item-separator />
            <q-item @click.native="toggleRightSidebar(rightSidebarDrawer)" >
              <q-item-main> Settings </q-item-main>
            </q-item>
          </q-list>
        </q-btn-dropdown>
    
    </q-toolbar>

    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-primary text-white' : null"
      :overlay="false"
    >
      <sidebar :usertype="this.usertype"/>
    </q-layout-drawer>

    <!-- <template v-if="isHome()"> -->
       <rightSidebar :right="rightSidebarDrawer"/>
    <!-- </template> -->

    <q-page-container  class="bg-grey-1">
      <router-view />
    </q-page-container>
    <q-modal v-model="positionModal" :position="position" :no-esc-dismiss="noEsc" :no-backdrop-dismiss="noEsc" :content-css="{padding: '20px', width: '50%'}">
      <div class="q-display-1 q-mb-md" align="center">Session ended due to inactivity!</div><div align="center"><p>Please login again to continue.</p></div>
      <div class="q-my-md">
        <q-input type="password" v-model="user.password"  float-label="Password"/>
      </div>
      <q-btn color="orange" @click="inactivity()" label="Login" style="width: 100%;" />
    </q-modal>
       <q-modal ref="ModalForm" :content-css="{minWidth: '80vw'}">
       <WordsForm @cancel="$refs.ModalForm.hide()"/>
     </q-modal>
  </q-layout>

</template>

<script>
import Sidebar from './sidebar'
import rightSidebar from './rightSidebar'
import EditRecord from '../components/stt/records/edit'
import WordsForm from '../components/stt/customizations/words/form'
import { Notify } from 'quasar'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'LayoutDefault',
  data () {
    return {
      user: {
        password: ''
      },
      count: null,
      leftDrawerOpen: this.$q.platform.is.desktop,
      rightDrawerOpen: this.$q.platform.is.desktop,
      right: false,
      usertype: 'stt',
      version: '1.0',
      timeoutID: null,
      positionModal: false,
      position: 'top',
      noEsc: true,
      lang: localStorage.getItem('vue-lang')
    }
  },
  computed: {
    ...mapGetters('STT/SPEECH', [ 'Stream']),
    ...mapGetters(['RightSidebarToogle']),
    ...mapGetters( 'STT/USER',['User']),
    rightSidebarDrawer: {
      get () { return this.RightSidebarToogle },
      set (val) { return this.$store.commit('SET_RIGHTSIDEBAR', val) }
    }
  },
  components: {
    Sidebar,
    rightSidebar,
    EditRecord,
    WordsForm
  },
  methods: {
    ...mapActions('STT/RECORD', [ 'createOrFind' ]),
    toggleRightSidebar (val) {
      this.rightSidebarDrawer = !val
    },
    recordPost () {
      this.createOrFind({ url: '/stt/records', method: 'post', data: { UserId: this.User.id, rid: undefined }}).then((data) => {
        this.$store.commit('STT/RECORD/SET_RECORD', data)
        this.$router.push({ path: '/', query: { rid: data.rid, isCreated: data.created }})
      })
    },
    setup () {
      addEventListener("mousemove", this.resetTimer, false)
      addEventListener("mousedown", this.resetTimer, false)
      addEventListener("keypress", this.resetTimer, false)
      addEventListener("DOMMouseScroll", this.resetTimer, false)
      addEventListener("mousewheel", this.resetTimer, false)
      addEventListener("touchmove", this.resetTimer, false)
      addEventListener("MSPointerMove", this.resetTimer, false)
  
      this.startTimer()
    },
    startTimer () {
      this.timeoutID = window.setTimeout(this.goInactive, 3600000) //15mins 900000 1hr 3600000
    },
    resetTimer (e) {
      window.clearTimeout(this.timeoutID)
      this.goActive()
    },
    goInactive () {
      if (this.Stream == undefined) {
        this.positionModal = true
      }
      /*if (this.Stream == undefined) {
        this.positionModal = true
        if (localStorage.getItem('googleToken')) {
          var auth2 = gapi.auth2.getAuthInstance()
          auth2.disconnect()
          auth2.signOut().then(function () {
            console.log('User signed out.')
          })
        }
        this.$store.commit('IDLE_LOGOUT', true)
        this.$store.commit('STT/USER/RESET_USER')
      } */
    },
    goActive () {
      // console.log('start')
      this.startTimer()
    },
    inactivity () {
      this.count = this.count + 1
      let details = {username: this.User.username, password: this.user.password}
      let payload = {url: '/stt/auth/idle', data: details, method: 'POST'}
      this.$store.dispatch('STT/USER/login', payload).then((data) => {
          this.$q.notify({
            message: data.message.text,
            type: 'positive',
            position: 'bottom-left'
          })
          this.positionModal = false
          this.count = 0
          this.user.password = ''
        }).catch((err) => {
          console.log(err)
          if (this.count > 3) {
            this.logout()
          }
          this.$q.notify({
            message: `Incorrect Password ${this.count} / 3 tries.`,
            position: 'bottom-left'
          })
        })
      // this.$router.push('/login')
    },
    
    isHome () {
      // if (this.$route.path === '/' || this.$route.path === '') {
      //   document.documentElement.style.overflow = 'hidden';  // firefox, chrome
      //   document.body.scroll = "no"; // ie only
      //   return true
      // }
      // else {
      //   document.documentElement.style.overflow = 'auto';  // firefox, chrome
      //   document.body.scroll = "yes"; // ie only
      //   return false
      // }
      //function unloadScrollBars() {

      //}
    },
    notify (source) {
      console.log(source)
    },
    logout () {
      if (localStorage.getItem('googleToken')) {
        var auth2 = gapi.auth2.getAuthInstance()
        auth2.disconnect()
        auth2.signOut().then(function () {
          console.log('User signed out.')
        })
      }
      this.$store.commit('IDLE_LOGOUT', true)
      this.$store.commit('STT/USER/RESET_USER')
      this.$router.push('/login')
    }
    /*changeLanguage (lang) {
      this.lang = lang
      this.language = lang
      this.$store.commit('SET_LANGUAGE', this.language)
    }*/
  },
  created () {
    this.setup()
    this.isHome()
    this.setup(),
    gapi.load('auth2', function() {
      gapi.auth2.init();
    })
    this.$router.push({path: '/records/all'})
  },
  watch: {
    lang (lang) {
      // dynamic import, so loading on demand only
      import(`quasar-framework/i18n/${lang}`).then(lang => {
        this.$q.i18n.set(lang.default)
      })
    }
  }
}
</script>

<style lang="css">
.bordered {
  border-bottom: 1px solid #dfdfdfc7;
  border-top: 1px solid #dfdfdfc7;
}
.custom-dropdown .on-right.q-btn-dropdown-arrow {
  display: none;
}
</style>
