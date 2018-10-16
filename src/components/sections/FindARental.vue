<template>
  <site-section>
    <template slot="title">
      Find a rental
    </template>
    <div class="rental" v-for="rental in $store.state.rentals" :key="rental.id">
      Id: {{rental.id}}
      URI: {{rental.uri}}
      Price: {{rental.price}}
      <button
        @click="request(rental.id)"
        v-if="!rental.hasSentRequest"
      >Request</button>
      <span v-else>You have sent a request for this property</span>
    </div>
  </site-section>
</template>

<script>
import SiteSection from '@/src/components/reusables/SiteSection.vue'
import retryInvoke from '@/util/retryInvoke'
import getAddress from '@/util/getAddress'
import { now } from '@/util/time.js'

export default {
  name: 'FindARental',
  components: {
    SiteSection,
  },
  mounted() {
    this.$store.commit('startLoading', { message: 'Finding available rentals...' })
    retryInvoke(this.getRentals)
  },
  methods: {
    async getRentals() {
      const propertyContract = this.$store.state.propertyContract
      const propertyRegistryContract = this.$store.state.propertyRegistryContract
      const address = await getAddress()
      let propertyIds
      const properties = []

      try {
        propertyIds = await propertyRegistryContract.getAllRegProps({
          from: address,
          gas: 200000,
        })
        console.log('propertyIds', propertyIds);
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
          const response = await propertyRegistryContract.getRegPropData(propertyId, {
            from: address,
            gas: 200000,
          })

          var price = parseInt(response[0].toString())
          var requested = response[1]
          var occupant = response[2]

        } catch (e) {
          console.error(e);
        }

        try {
          var hasSentRequest = await propertyRegistryContract.haveIRequested(propertyId, {
            from: address,
            gas: 200000,
          })
        } catch (e) {
          console.error(e)
        }

        // Only push vacant properties
        if (occupant === "0x0000000000000000000000000000000000000000") {
          properties.push({
            id: propertyId.toString(),
            uri,
            requested,
            price,
            occupant,
            hasSentRequest,
          })
        }
      })

      this.$store.commit('setKeyToValue', { key: 'rentals', value: properties })
      this.$store.commit('stopLoading')
    },

    async request(id) {
      this.$store.commit('startLoading', { message: "Waiting for signature..." })
      const address = await getAddress()

      const propertyRegistryContract = this.$store.state.propertyRegistryContract

      try {
        await propertyRegistryContract.request(id, now(1, 'day'), now(2, 'days'), {
          from: address,
          gas: 200000,
        })
      } catch (e) {
        console.error(e)
      }
    },
  }
}
</script>

<style scoped lang="scss">

</style>
