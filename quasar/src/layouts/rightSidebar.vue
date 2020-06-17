<template>

  <q-layout-drawer
		side="right"
		v-model="drawer"
		:content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
		:content-style="{fontSize: '14px'}"
		:overlay="true"
	>
		<div class="no-padding no-margin">
			<stt-settings class="window-height full-height"/>
		</div>
	</q-layout-drawer>
</template>

<style>
</style>

<script>
import SttSettings from '../components/stt/Settings'
export default {
  name: 'PageIndex',
  data () {
    return {
			scrolling: true
    }
	},
	computed: {
		drawer () {
			return this.right
		}
	},
	props: {
    right: {
      default: true
    }
	},
	components: {
		SttSettings
	}
}
</script>
