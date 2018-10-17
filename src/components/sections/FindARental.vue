<template>
  <site-section>
    <template slot="title">
      Find a rental
    </template>
    <div
      class="rental"
      v-for="rental in $store.state.rentals"
      :key="rental.id"
    >
      Id: {{rental.id}}
      URI: {{rental.uri}}
      Price: {{rental.price}}
      <button
        @click="request(rental.id)"
        v-if="!rental.hasSentRequest"
      >
        Request
      </button>
      <span v-else>
        You have sent a request for this property
      </span>
    </div>
  </site-section>
</template>

<script>
import SiteSection from '@/src/components/reusables/SiteSection'
import retryInvoke from '@/util/retryInvoke'
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
      const { propertyContract, propertyRegistryContract } = this.$store.state
      const { txOptions } = this.$store.getters
      let propertyIds
      const properties = []

      try {
        propertyIds = await propertyRegistryContract.getAllRegProps(txOptions)
      } catch (e) {
        console.error(e)
      }

      propertyIds.forEach(async propertyId => {
        try {
          var uri = await propertyContract.getURI(propertyId, txOptions)
        } catch (e) {
          console.error(e);
        }

        try {
          const response = await propertyRegistryContract.getRegPropData(propertyId, txOptions)
          var price = parseInt(response[0].toString())
          var requested = response[1]
          var occupant = response[2]

        } catch (e) {
          console.error(e);
        }

        try {
          var hasSentRequest = await propertyRegistryContract.haveIRequested(propertyId, txOptions)
        } catch (e) {
          console.error(e)
        }

        // Only push vacant properties
        if (occupant === "0x0000000000000000000000000000000000000000") {
          properties.push({
            id: propertyId.toString(),
            uri,
            price,
            hasSentRequest,
          })
        }
      })

      this.$store.commit('setRentals', properties)
      this.$store.commit('stopLoading')
    },

    async request(id) {
      const { propertyRegistryContract } = this.$store.state
      const { txOptions } = this.$store.getters

      const checkIn = prompt('In how many days do you want to check in?')
      const checkOut = prompt('How many nights do you want to stay?') + checkIn

      this.$store.commit('startLoading', { message: "Waiting for signature..." })

      try {
        await propertyRegistryContract.request(id, now(checkIn, 'days'), now(checkOut, 'days'), txOptions)
      } catch (e) {
        console.error(e)
      }
    },
  }
}
</script>