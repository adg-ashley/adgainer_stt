<template>
    <div>
        <!-- {{result}} -->
    </div>
</template>

<script>
export default {
  data() {
    return { result: [] };
  },
  name: 'CustomizationsModels',
  created () {
    this.$http2.exec({ url: '/stt/customizations/models' }).then((result) => {
      this.result = result
    }).catch((err) => {
      // console.log(err)
    });
  }
}
</script>

<style>

</style>
