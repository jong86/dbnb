<template>
  <site-section>
    <div>
      View my properties
    </div>
    <div v-for="property in properties" :key="property.id">
      Id: {{property.id}}
      URI: {{property.uri}}
    </div>
  </site-section>
</template>

<script>
import SiteSection from '../reusables/SiteSection.vue'
import store from '../../store.js'

export default {
  components: {
    SiteSection,
  },
  data() {
    return {
      properties: [],
    }
  },
  mounted() {
    this.getProperties()
  },
  methods: {
    async getProperties() {
      if (store.state.propertyContract) {
        const propertyContract = store.state.propertyContract

        try {
          const propertyIds = await propertyContract.getProperties({
            from: window.web3.eth.accounts[0],
            gas: 200000,
          })

          const properties = []

          propertyIds.forEach(async propertyId => {
            try {
              var uri = await propertyContract.getURI(propertyId, {
                from: window.web3.eth.accounts[0],
                gas: 200000,
              })
            } catch (e) {
              console.log('e', e);
            }

            properties.push({
              id: propertyId.toString(),
              uri: uri,
            })
          })

          this.properties = properties

        } catch(e) {
          console.log("e", e);
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
