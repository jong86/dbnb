<template>
  <site-section>
    <template slot="title">
      Find a rental
    </template>
    <div
      class="property"
      v-for="rental in $store.state.rentals"
      :key="rental.id"
    >
      <div
        class="property-col"
      >
        Id: {{rental.id}}
      </div>
      <div
        class="property-col"
      >
        URI: {{rental.uri}}
      </div>
      <div
        class="property-col"
      >
        Price: {{rental.price}}
      </div>
      <div
        class="property-col"
      >
        <div v-if="rental.isApproved">
          Request approved
          <button @click="checkIn(rental.id)">Check-in</button>
          <button @click="checkOut(rental.id)">Check-out</button>
        </div> 
        <div v-else>
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
      </div>

    </div>
  </site-section>
</template>

<script>
import SiteSection from '@/src/components/reusables/SiteSection'
import retryInvoke from '@/util/retryInvoke'
import getTxOptions from '@/util/getTxOptions'
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
      const txOptions = await getTxOptions()
      let propertyIds = []
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
          const response = await propertyRegistryContract.getRegPropDataAsCustomer(propertyId, txOptions)
          var price = parseInt(response[0].toString())
          var vacant = response[1]
          var hasSentRequest = response[2]
          var isApproved = response[3]
        } catch (e) {
          console.error(e);
        }

        // Only push vacant properties
        properties.push({
          id: propertyId.toString(),
          uri,
          price,
          vacant,
          hasSentRequest,
          isApproved,
        })
      })

      this.$store.commit('setRentals', properties)
      this.$store.commit('stopLoading')
    },

    async request(id) {
      const { propertyRegistryContract } = this.$store.state
      const txOptions = await getTxOptions()

      const checkIn = prompt('In how many days do you want to check in?')
      const checkOut = prompt('How many nights do you want to stay?') + checkIn

      this.$store.commit('startLoading', { message: "Waiting for signature..." })

      try {
        await propertyRegistryContract.request(id, now(checkIn, 'days'), now(checkOut, 'days'), txOptions)
      } catch (e) {
        console.error(e)
      }
    },

    async checkIn(id) {
      const { propertyRegistryContract } = this.$store.state
      const txOptions = await getTxOptions()

      this.$store.commit('startLoading', { message: "Waiting for signature..." })

      try {
        await propertyRegistryContract.checkIn(id, txOptions)
      } catch (e) {
        console.error(e)
      }
    },

    async checkOut(id) {
      const { propertyRegistryContract } = this.$store.state
      const txOptions = await getTxOptions()

      this.$store.commit('startLoading', { message: "Waiting for signature..." })

      try {
        await propertyRegistryContract.checkOut(id, txOptions)
      } catch (e) {
        console.error(e)
      }
    },
  }
}
</script>