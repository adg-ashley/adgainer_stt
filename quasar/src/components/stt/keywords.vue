<template>
  <div>
    <q-list no-border>
      <q-item>
        <q-item-main>
           <q-chips-input
              float-label="Keywords"
              v-model="settings.keywords"
              @input="updateSettings(Object.assign(settings, {
                keywords_threshold: (settings.keywords.length ? 0.01 : undefined )
              }))"
            />
        </q-item-main>
      </q-item>
      <q-item>
        <q-item-main>
          <template v-for="k in settings.keywords">
              <q-chip :key="k"> {{k}} </q-chip>
          </template>
        </q-item-main>
      </q-item>
    </q-list>
    
    <h5 v-html="getKeywordsSummary" v-if="Settings.keywords.length > 0"/>
    <div v-html="fullKeywords" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      list: null,
      settings: {
        keywords: []
      }
    }
  },
  props: {
    messages: {
      type: [Object, Array],
      default: ''
    }
  },
  computed: {
    ...mapGetters('STT/SPEECH', ['Settings', 'SourceType']),
    fullKeywords () {
      console.log(this.Settings.keywords, this.Settings.keywords_threshold)
      const notSpotted = this.SourceType ? 'Searching...' : 'Not spotted.'
      const spotted = this.getSpotted(this.messages)
      this.list = this.Settings.keywords.map((k) => {
        const spottings = spotted[k]
        var count = 0
        if (spottings) {
          count = spottings.length
        }
        const spanSpotted = (spottings || []).map(s => `Time: ${s.start_time}s to ${s.end_time}s - Confidence: ${Math.round(s.confidence * 100)}%`).join(', <br />')
        return `
          <li key=${k}>
            <b>${k}</b>: ${spottings ? 'Spotted - ' : notSpotted} Frequency: <b>${count}</b> time(s)<br />
            <span>
              ${spanSpotted}
            </span>
          </li>
        `
      })
      return `<ul>${this.list.join('')}</ul>`
    },
    getKeywordsSummary () {
      const spotted = Object.keys(this.getSpotted(this.messages)).length
      const total = this.Settings.keywords.length
      return `Total Keywords Spotted: <b>${spotted} out of ${total}</b>`
    }
  },
  methods: {
    ...mapActions('STT/SPEECH', [ 'updateSettings' ]),
    allResultsReducer (list, message) {
      return list.concat(message.results)
    },
    keywordReducer (keywords, result) {
      Object.keys(result.keywords_result || {}).forEach((k) => {
        keywords[k] = keywords[k] || []
        keywords[k].push(...result.keywords_result[k])
      })
      return keywords
    },
    getSpotted (messages) {
      return messages.reduce(this.allResultsReducer, []).reduce(this.keywordReducer, {})
    }
  },
  created () {
    this.settings.keywords = this.Settings.keywords
  }
}
</script>

<style>
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  li {
    padding-bottom: 5px;
  }
</style>