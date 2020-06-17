<template>
   <q-modal v-model="layoutModal" :content-css="{minWidth: '80%', minHeight: '80%'}">
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-btn flat round dense @click="layoutModal = false" icon="reply" />
          <q-toolbar-title>
            ADGainer Voice ID: {{ id }}
          </q-toolbar-title>
        </q-toolbar><br>
        <audio style="padding-bottom: 5px; width: 100%;" src="" controls />
        <q-editor v-model="editor" class="window-height full-height"/>

      </q-modal-layout>
    </q-modal>
</template>

<script>

export default {
  data () {
    return {
      layoutModal: false,
      editor: 'transcript here',
      id: null
    }
  },
  methods: {
    open (row) {
      this.layoutModal = true
      this.id = row.id
    }
  },
  components: {
  }
}
</script>
