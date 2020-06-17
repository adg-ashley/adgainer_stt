<template>
  <q-page class="q-ma-sm">
      <words-form/>
  </q-page> 
</template>

<script>
import WordsForm from '../../../components/stt/customizations/words/form'
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters('STT/USER', [ 'User' ])
  },
  components: {
    WordsForm
  }
}
</script>

<style>

</style>
