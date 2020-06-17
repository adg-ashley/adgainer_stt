<template>
    <div class="full-height column">
        <q-list class="no-border no-shadow col-11" link>
          <q-item @click.native="recordPost()" item  exact text-color="white">
            <q-item-side inverted icon="add" color="white" text-color="primary"/>
            <q-item-main v-lang.categories.newRecord />
          </q-item>
          <q-list-header class="text-white" v-lang.categories.directory/> 
          <!-- <q-collapsible text-color="white" opened icon="view list" :label="selectedLanguage.records"
            @show="collapse()"
            @hide="collapse()"
          > -->
          <q-collapsible opened>
            <template slot="header">
              <q-item-side inverted text-color="primary" color="white" icon="view list" />
              <q-item-main :label="selectedLanguage.records" />
            </template>
            <q-item item to="/records/all">
              <q-item-side text-color="white" icon="view list" />
              <q-item-main label="Record List" />
            </q-item>
            <q-item item to="/records/favorites">
              <q-item-side text-color="white" icon="star" />
              <q-item-main label="Favorites" />
            </q-item>
            <q-item link to="/records/trash">
              <q-item-side text-color="white" icon="delete" />
              <q-item-main label="Trash" />
            </q-item>
          </q-collapsible>
          <!-- <q-item item to='/records'>
            <q-item-side inverted icon="view list" color="white" text-color="primary"/>
            <q-item-main v-lang.categories.records />
          </q-item> -->
          <q-item item to='/vocabulary'>
            <q-item-side inverted icon="sort by alpha" color="white" text-color="primary"/>
            <q-item-main v-lang.categories.vocabulary />
          </q-item>

          <!--TODO:  Will bring up this issue after stabilizing the app-->
          <!-- <template v-if="HasAdToken">
            <q-list-header class="text-white" >ADGainer.com</q-list-header>
            <q-item item to='/adgainer/voices'>
              <q-item-side icon="settings voice" text-color="white"/>
              <q-item-main v-lang.categories.voices />
            </q-item>
          </template> -->
          <!-- <q-list-header class="text-white" v-lang.categories.user />
          <q-item item to='/settings'>
              <q-item-side inverted icon="build" color="white" text-color="primary"/>
              <q-item-main v-lang.categories.settings />
          </q-item>
          <q-item link color="negative" @click.native="logout()">
            <q-item-side inverted color="white" text-color="primary">
              <avatar backgroundColor="white" color="#027be3" :initials="initials()" :size="38"></avatar>
            </q-item-side>
            <q-item-main v-lang.categories.logout ></q-item-main>
          </q-item>
          <q-item link color="negative" @click.native="logout()">
            <q-item-side icon="exit to app" text-color="white"/>
            <q-item-main v-lang.categories.logout ></q-item-main>
          </q-item> -->
        </q-list>
        <q-list class="no-border no-shadow column col" link>
         
          <q-item link color="negative" >
            <q-item-side inverted color="white" text-color="primary">
              <q-btn class="" flat round>
                  <avatar backgroundColor="white" color="#027be3" :username="initials()" :initials="initials()" :size="38"></avatar>
                  <q-popover anchor="top left" self="bottom left">
                    <!-- <q-list dense class="no-border no-shadow border-rounded bg-grey-1" link>
                        <q-item>
                            <avatar backgroundColor="white" color="#027be3" :initials="initials()" :size="38"></avatar>
                        </q-item>
                        <q-item>
                            <avatar backgroundColor="white" color="#027be3" :initials="initials()" :size="38"></avatar>
                        </q-item> 
                    </q-list> -->
                    <q-card>
                    <q-card-title>
                        <div class="row full-width justify-center items-center">
                        <avatar backgroundColor="#027be3" color="white" 
                          :username="initials()" :initials="initials()" :size="48"></avatar>
                        </div>
                    </q-card-title>

                    <q-card-main>
                        <div class="column full-width justify-center items-center">
                          <p class="q-title">{{ User.firstname }} {{ User.lastname }}</p>
                          <p>{{ User.email}}</p>
                        </div>
                    </q-card-main>
                    <q-card-separator />
                    <q-card-actions align="around">
                    <q-btn @click.native="logout()" color="negative" flat round dense icon="exit to app" />
                    <q-btn @click.native="$router.push({path: '/settings'})" flat round dense icon="build" />
                  </q-card-actions>
                  </q-card>
                  <!-- <q-item-side inverted color="white" text-color="primary">
                    <avatar backgroundColor="white" color="#027be3" :initials="initials()" :size="38"></avatar>
                  </q-item-side>
                  <q-item-main v-lang.categories.logout ></q-item-main> -->
                  </q-popover>
              </q-btn>

            </q-item-side>
          </q-item>
         
          <!-- <q-item link color="negative" @click.native="logout()">
            <q-item-side icon="exit to app" text-color="white"/>
            <q-item-main v-lang.categories.logout ></q-item-main>
          </q-item> -->
        </q-list>
         <records-modal-view :record="record" @hide="isDisplay = false" :isDisplay="isDisplay" />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import en from '../lang/en/categories'
import ja from '../lang/ja/categories'
import RecordsModalView from '../components/stt/records/modalView'
import Avatar from 'vue-avatar'

export default {
  data () {
    return {
      options: [
        { label: 'English (US)', value: 'en-us' },
        { label: '日本語', value: 'ja' },
      ],
      isDisplay: false,
      showPopOver: true
    }
  },
  computed: {
    ...mapGetters('STT/USER', ['User', 'HasAdToken', 'GoogleUser']),
    ...mapGetters('STT/RECORD', ['Record', 'Records', 'ToggleTr1Modal']),
    ...mapGetters([ 'Http2']),
    record: {
      get () { return this.Record },
      set (val) { this.$store.commit('STT/RECORD/SET_RECORD', val )}
    },
    selectedLanguage: function () {
      return this.language === 'en-us' ? en : ja
    },
    http () {
      return this.Http2
    },
    showTr1: {
      get () { return this.ToggleTr1Modal },
      set (val) { this.$store.commit('STT/RECORD/SET_TOGGLETR1MODAL', val)}
    }
  },
  methods: {
    test() {
      console.log('test')
    },
    ...mapActions('STT/RECORD', [ 'createOrFind' ]),
    logout () {
      this.$q.dialog({
        title: this.selectedLanguage.logout,
        message: this.selectedLanguage.areYouSure,
        ok: this.selectedLanguage.logout,
        cancel: this.selectedLanguage.cancel
      }).then(() => {
        if (localStorage.getItem('googleToken')) {
          var auth2 = gapi.auth2.getAuthInstance()
          auth2.disconnect()
          auth2.signOut().then(function () {
            console.log('User signed out.')
          })
        }
				this.$store.commit('STT/USER/RESET_USER')
        this.$router.push('/login')
      }).catch((err) => {
        console.log(err)
        console.log('Not Logged Out')
      })
    },
    testClick () {
      console.log('create new record and opend the modal')
    },
    recordPost () {
      this.record = {}
      this.createOrFind({ 
          url: '/stt/records', method: 'post', 
          data: { 
            UserId: this.User.id, rid: undefined 
          }
        }).then((data) => {
        if (data) {
          this.record = data
          //this.$store.commit('STT/RECORD/POP_RECORD')
          //this.showTr1 = true
          this.isDisplay = true
          //this.$router.push({ path: '/records' })
        }
        //this.$router.push({ path: '/', query: { rid: data.rid, isCreated: data.created }})
      })
    },
    initials () {
      return this.User.firstname.charAt(0) +  this.User.lastname.charAt(0)
    },
    collapse() {
      this.$router.push('/records')
    }
  },
  created () {
    gapi.load('auth2', function() {
      gapi.auth2.init();
    })
  },
  components: {
    RecordsModalView,
    Avatar
  }
}
</script>