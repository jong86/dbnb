<template>
  <site-section>
    <template slot="title">
      View my properties
    </template>
    <div v-for="property in properties" :key="property.id">
      Id: {{property.id}}
      URI: <input v-bind:value="property.uri" />
      Requested: {{property.requested}}
    </div>
  </site-section>
</template>

<script>
import SiteSection from '@/src/components/reusables/SiteSection.vue'
import store from '@/src/store.js'
import getAddress from '@/util/getAddress'
import retryInvoke from '@/util/retryInvoke'

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
    this.$store.commit('startLoading')
    retryInvoke(this.getProperties)
  },
  methods: {
    async getProperties() {
      const propertyContract = store.state.propertyContract
      const propertyRegistryContract = store.state.propertyRegistryContract
      const address = await getAddress()
      let propertyIds
      const properties = []

      try {
        propertyIds = await propertyContract.getProperties({
          from: address,
          gas: 200000,
        })
      } catch (e) {
        console.error(e)
      }

      propertyIds.forEach(async propertyId => {
        try {
          var uri = await propertyContract.getURI(propertyId, {
            from: address,
            gas: 200000,
          })
        } catch (e) {
          console.error(e);
        }

        try {
          var requested = await propertyRegistryContract.viewRequested(propertyId, {
            from: address,
            gas: 200000,
          })
        } catch (e) {
          console.error(e);
        }

        properties.push({
          id: propertyId.toString(),
          uri: uri,
          requested, requested,
        })
      })

      this.properties = properties
      this.$store.commit('stopLoading')
    }
  }
}
</script>

<style scoped lang="scss">

</style>
