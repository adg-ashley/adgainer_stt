
<template>
    <q-page class="q-ma-sm">
      <EditRecord :rid='$route.query.rid' :isCreated='$route.query.isCreated'/>
    </q-page>  
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import EditRecord from '../../../components/stt/records/edit'
export default {
  name: 'HomeIndex',
  data () {
    return { url: '' }
  },
  props: {
    rid: {
      type: String
    }
  },
  computed: {
    ...mapGetters('STT/USER', ['User'])
  },
  methods: {
    ...mapActions('STT/SPEECH', [
      'authenticate'
    ]),
    getToken () {
      return this.authenticate({url: `/stt/users/${this.User.id}/authenticate`, method: 'post'})
    }
  },
  created () {
    this.getToken()
    setInterval(this.getToken(), 50 * 60 * 1000)
    this.url = this.$route.query.url
    console.log('test')
    this.$router.push({path: '/records/all'})
  },
  components: {
    EditRecord
  }
}
</script>
