<template>
  <site-section>
    <template slot="title">
      View my properties
    </template>
    <button
      class="create-property"
      @click="createProperty"
    >Create new property</button>
    <div v-for="(property, key) in properties" :key="key">
      Id: {{property.id}}
      URI: <input v-model="properties[key].uri" /><button @click="setURI(property.id, properties[key].uri)">Save</button>
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
    this.$store.commit('startLoading', { message: 'Retrieving your properties...' })
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
    },

    async setURI(propertyId, uri) {
      const propertyContract = store.state.propertyContract
      const address = await getAddress()

      console.log('setting uri', uri, 'for', propertyId);

      // try {
      //   propertyContract.setURI()
      // } catch (e) {

      // }
    },

    async createProperty(e) {
      e.preventDefault()
      this.$store.commit('startLoading', { message: 'Waiting for signature...' })
      const propertyContract = store.state.propertyContract
      const propertyRegistryContract = store.state.propertyRegistryContract
      const { state } = this.$store

      const address = await getAddress()

      // Create property
      try {
        const tx = await propertyContract.createProperty({
          from: address,
          gas: 200000,
        });
      } catch(e) {
        console.error(e);
      }

      this.$store.commit('stopLoading')
    },
  }
}
</script>

<style scoped lang="scss">
.create-property {
  width: fit-content;
}
</style>
