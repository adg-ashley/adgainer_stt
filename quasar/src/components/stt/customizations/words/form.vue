<template>
  <div>
    <form>
      <q-list class="q-pa-md no-border">
        <q-list-header >
         Add Word Out of Vocabulary
          <div class="float-right q-mr-md">
              <template  v-if="http2.sending">
                <q-spinner size="25px"/>
              </template>
              <template v-else>
                <q-icon  size="25px" color="positive" name="check" v-if="http2.ok"/>
                <q-icon  size="25px" color="negative" name="error" v-if="http2.error"/>
              </template>
          </div>
          </q-list-header>
        <q-item>
          <q-item-main label="Language Model">
            <!-- <q-field 
              :error="$v.form.sounds_like.$error" 
              :error-label="getError('sounds_like')">
              <q-chips-input v-model="form.sounds_like" @input="$v.form.sounds_like.$touch()"/>
            </q-field> -->
              <q-select 
                v-model="CustomizationId"
                :options="ModelOptions"
              />
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-main label="Name">
            <q-field :error="$v.form.word_name.$error"  :error-label="getError('word_name')">
              <q-input
                float-label="word name" 
                v-model="form.word_name"/>
            </q-field>
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-main label="Display As">
            <q-field :error="$v.form.display_as.$error" :error-label="getError('display_as')">
              <q-input float-label="display as" v-model="form.display_as"/>
            </q-field>
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-main label="Sounds Like">
            <q-field 
              :error="$v.form.sounds_like.$error" 
              :error-label="getError('sounds_like')">
              <q-chips-input v-model="form.sounds_like" @input="$v.form.sounds_like.$touch()"/>
            </q-field>
          </q-item-main>
        </q-item>
        <q-item class="row justify-end no-margin">
            <q-btn outline label="cancel" @click.prevent="$emit('cancel')"/>
            <q-btn outline color="primary"  class="q-ml-sm" label="submit" @click.prevent="submit"/>
        </q-item>
      </q-list>
      
    </form>
  </div>
</template>

<script>
import { required, alpha } from 'vuelidate/lib/validators'
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'WordsForm',
  props: ['refModal'],
  data () {
    return {
      form: {
        word_name: '',
        display_as: '',
        sounds_like: []
      }
    }
  },
  computed: {
    ...mapGetters({ http2: 'Http2' }),
    ...mapGetters('STT/USER', [ 'User'] ),
    ...mapGetters('STT/MODEL', ['ModelOptions', 'UserModel']),
    CustomizationId: {
      get () { return this.User.CustomizationId },
      set (val) { return this.User.CustomizationId = val}
    }
  },
  validations: {
    form: {
      word_name: {
        required
      },
      display_as: {
        required
      },
      sounds_like: {
        required,
        $each: {
          required,
          alpha
        }
      }
    }
  },
  methods: {
    ...mapActions('STT/MODEL', [ 'fetchModels']),
    getError (key) {
      let v = this.$v,
        msg = '',
        errors = {
          word_name: function () {
            if (!v.form.word_name.required) {
              msg = 'require field'
            }
            return msg
          },
          display_as: function () {
            if (!v.form.display_as.required) {
              msg = 'require field'
            }
            return msg
          }
          // sounds_like: function() {
          //   if (!v.form.sounds_like.required) {
          //     msg = 'require field'
          //   }
          //   if (!v.form.sounds_like.$each.alpha) {
          //     msg = 'alphabets only'
          //   }
          //   return msg
          // }
        }
      if (!errors.hasOwnProperty(key)) {
        return msg
      }
      return errors[`${key}`].call()
    },
    submit () {
      this.$v.form.$reset()
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$http2.exec({ url: `/stt/customizations/${this.User.CustomizationId}/words`,
          method: 'POST',
          data: Object.assign({ CustomizationId: this.CustomizationId }, this.form)
        }).then ((res) => {
          this.$store.commit('STT/WORD/PUSH_WORD', res.data[0])
          this.$q.notify({ message: 'sucesssfully addded a word', type: 'positive', position: 'bottom-left' })
        }).catch((err) => {
          this.$q.notify({ message: err.error, type: 'negative', position: 'bottom-left' })
        })
      }
    }
  },
  created () {
    this.fetchModels({ url: '/stt/customizations/models' })
  }
}
</script>

<style>

</style>
