<template>
  <div>
    <q-select :inverted="property.inverted"
      float-label="Select Customization Language"
      v-model="customizationId"
      :options="CustomizationsOptions" 
      v-if="CustomizationsOptions" 
      @change="change"
      @input="input"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      customizationId: this.$store.getters['STT/USER/User'].CustomizationId
    }
  },
  props: {
    // value: [String, Number],
    property: {
      type: Object,
      default: () => {
        return { inverted: false }
      }
    }
  },
  /* watch: {
    customizationId () {
      if (this.value === null || this.value === undefined) {
        return 0
      }
      else {
        return this.value
      }
    }
  }, */
  computed: {
		...mapGetters({
      user: 'STT/USER/User'
		}),
    CustomizationsOptions: {
      get () {
        return this.$store.getters['STT/CUSTOMIZATION/CustomizationsOptions']
      },
      set () {
        return this.getCustomizations()
      }
    }
  },
  methods: {
    getCustomizations () {
      let params = {
        url: `/stt/customizations/customization`,
        method: 'get',
        params: {
          inUse: 1
        }
      }
      this.$store.dispatch('STT/CUSTOMIZATION/list', params)
    },
    change (e) {
      this.$emit('input', e)  
    },
    input (e) {
      console.log('Customization ID', e)
      this.$store.commit('STT/USER/UPDATE_ATTRIBUTE', { CustomizationId: this.customizationId })
    }
  },
  created () {
    this.getCustomizations()
  }
}
</script>
