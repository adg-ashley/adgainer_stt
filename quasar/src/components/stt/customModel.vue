<template>
    <div>
      <q-select
          no-icon
          class="q-body-2"
          dense
          size="sm"
          v-model="model"
          :options="models"
        />
    </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  computed: {
    ...mapGetters('STT/USER', ['User']),
    ...mapGetters('STT/MODEL', ['ModelOptions', 'UserModel']),
    model: {
      get () { return this.User.CustomizationId },
      set (val) { 
        return this.sttUserUpdate({
            url: `/stt/users/${this.User.id}/update`, 
            data: { CustomizationId: val }, 
            method: 'put' 
          }) 
       }
    },
    models: {
      get () { return this.ModelOptions },
      set (val) { return this.$store.commit('STT/MODEL/SET_MODELS', val) }
    }
  },
  methods: {
    ...mapActions('STT/MODEL', [ 'fetchModels']),
    ...mapActions('STT/USER', { sttUserUpdate: 'update' }),
  },
  created () {

    this.fetchModels({ url: '/stt/customizations/models' })
    // console.log(this.UserModel)
    //this.$store.commit('STT/SPEECH/UPDATE_ATTRIBUTE_SETTINGS', 
    //  { model: this.UserModel.base_model_name, customization_id: this.UseModel.customization_id})
    // this.models()
  }
}

</script>
