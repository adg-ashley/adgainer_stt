<template>
  <q-page class="border-gray-1 q-ma-sm">
    <template v-if="isAll()">
      <records-list/>
    </template>
    <template v-if="isFavorites()">
      <favorite-list/>
    </template>
    <template v-if="isTrash()">
      <trash-list/>
    </template>
  </q-page>  
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import RecordsList from '../../../components/stt/records/list'
import FavoriteList from '../../../components/stt/records/subcategory/favoriteList'
import TrashList from '../../../components/stt/records/subcategory/trashList'
export default {
  computed: {
    ...mapGetters('STT/USER', ['User'])
  },
  methods: {
    ...mapActions('STT/SPEECH', [
      'authenticate'
    ]),
    getToken () {
      return this.authenticate({url: `/stt/users/${this.User.id}/authenticate`, method: 'post'})
    },
    isAll () {
       if (this.$route.path === '/records/all') {
         return true
       }
       else {
         return false
       }
    },
    isFavorites () {
       if (this.$route.path === '/records/favorites') {
         return true
       }
       else {
         return false
       }
    },
    isTrash () {
       if (this.$route.path === '/records/trash') {
         return true
       }
       else {
         return false
       }
    }
  },
  created () {
    this.getToken()
    setInterval(this.getToken(), 50 * 60 * 1000)
  },
  components: {
    RecordsList,
    FavoriteList,
    TrashList
  }
}
</script>