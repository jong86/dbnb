<template>
  <site-section>
    <div>
      View my properties
    </div>
  </site-section>
</template>

<script>
import SiteSection from '../reusables/SiteSection.vue'

export default {
  components: {
    SiteSection,
  },
  mounted() {
    await getProperties()
  },
  methods: {
    async getProperties() {
      console.log('here');
      try {
        const properties = await window.propertyContract.getProperties({
          from: window.web3.eth.accounts[0],
          gas: 200000,
        });
        console.log('properties', properties);
      } catch(e) {
        console.log("e", e);
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
