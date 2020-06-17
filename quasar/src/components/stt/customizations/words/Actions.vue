<template>
  <div>
    <q-btn flat rounded dense icon="volume up" color="positive" small class="float-right"/>
    <q-btn flat rounded dense icon="delete" color="negative" small class="float-right"/>
  </div>
</template>

<script>
export default {
  name: 'WordsActions',
  props: { 
    item: {
      type: Object
    },
    itemIndex: {
      type: [ String, Number ]
    }
  }
}
</script>

<style>

</style>
