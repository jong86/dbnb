<template>
  <site-section>
    <template slot="title">
      View my properties
    </template>
    <div
      class="create-box"
    >
      <input
        v-model="uri"
        placeholder="Enter URI"
      />
      <button
        class="create-button"
        @click="createWithURI(uri)"
      >
        Create new property
      </button>
    </div>
    <div
      class="property"
      v-for="(property, key) in $store.state.myProperties"
      :key="key"
    >
      <div class="property-col">
        Id: {{property.id}}
      </div>
      <div class="property-col">
        URI: {{property.uri}}
      </div>
      <div class="property-col">
        <button
          v-if="!property.price"
          @click="registerProperty(property.id)"
        >
          Register
        </button>
        <span v-else>
          Price: {{property.price}} PPT
        </span>
      </div>
      <div
        class="property-col"
        v-if="property.price"
      >
        Requests:
        <div
          v-for="(request, index) in property.requested"
          :key="index"
        >
          {{request.address}}
          Check-in {{request.times[0]}}
          Check-out {{request.times[1]}}
          <button v-if="!request.isApproved" @click="approveRequest(property.id, request.address)">
            Approve
          </button>
          <button v-else disabled>
            Approved
          </button>
        </div>
      </div>
      <div
        class="property-col"
        v-if="property.price"
      >
        Occupant: {{property.occupant}}
      </div>
    </div>
  </site-section>
</template>

<script>
import SiteSection from '@/src/components/reusables/SiteSection'
import invokeWhenInited from '@/util/invokeWhenInited'
import getTxOptions from '@/util/getTxOptions'

export default {
  name: 'ViewMyProperties',
  components: {
    SiteSection,
  },
  data() {
    return {
      uri: '',
    }
  },
  mounted() {
    this.$store.commit('startLoading', { message: 'Retrieving your properties...' })
    invokeWhenInited(this.getProperties)
  },
  methods: {
    async getProperties() {
      const { propertyContract, propertyRegistryContract } = this.$store.state
      const txOptions = await getTxOptions()
      let propertyIds = []
      const properties = []

      try {
        propertyIds = await propertyContract.getProperties(txOptions)
      } catch (e) {
        console.error(e)
      }

      if (propertyIds.length > 0) {
        propertyIds.forEach(async propertyId => {
          try {
            var uri = await propertyContract.getURI(propertyId, txOptions)
          } catch (e) {
            console.error(e);
          }

          try {
            const response = await propertyRegistryContract.getRegPropDataAsOwner(propertyId, txOptions)
            var price = parseInt(response[0].toString())
            var requested = response[1]
            var occupant = response[2] === "0x0000000000000000000000000000000000000000" ? 'Vacant' : response[2]
            var isApproved = response[3]

          } catch (e) {
            console.error(e);
          }


          const requested2 = []
          // (can't get .map working for some reason here)
          try {
            requested.forEach(async address => {
              const isApproved = await propertyRegistryContract.checkIfAddressApproved(propertyId, address, txOptions)
              const times = await propertyRegistryContract.getRequest(propertyId, address, txOptions)

              requested2.push({
                address,
                isApproved,
                times,
              })
            })
          } catch (e) {
            console.error(e)
          }

          properties.push({
            id: propertyId.toString(),
            uri,
            requested: requested2,
            price,
            occupant,
          })
        })
      }

      this.$store.commit('setMyProperties', properties)
      this.$store.commit('stopLoading')
    },

    async createWithURI(uri) {
      const { propertyContract } = this.$store.state
      const txOptions = await getTxOptions()

      this.$store.commit('startLoading', { message: 'Waiting for signature...' })

      try {
        await propertyContract.createWithURI(uri, txOptions);
      } catch(e) {
        console.error(e);
      }

      this.$store.commit('startLoading', { message: 'Waiting for block to be mined...' })
    },

    async registerProperty(id) {
      const { propertyRegistryContract } = this.$store.state
      const txOptions = await getTxOptions()

      const price = prompt("How much to charge per night?")
      this.$store.commit('startLoading', { message: 'Waiting for signature...' })

      try {
        await propertyRegistryContract.registerProperty(id, price, txOptions);
      } catch(e) {
        console.error(e);
      }

      this.$store.commit('startLoading', { message: 'Waiting for block to be mined...' })
    },

    async approveRequest(propertyId, addressOfRequester) {
      const { propertyRegistryContract } = this.$store.state
      const txOptions = await getTxOptions()

      this.$store.commit('startLoading', { message: 'Waiting for signature...' })

      try {
        await propertyRegistryContract.approveRequest(propertyId, addressOfRequester, txOptions);
      } catch(e) {
        console.error(e);
      }

      this.$store.commit('startLoading', { message: 'Waiting for block to be mined...' })
    },
  }
}
</script>

<style lang="scss">
.create-property {
  width: fit-content;
}
.create-box {
  border: 1px solid gainsboro;
  padding: 16px;
  border-radius: 4px;
  margin: 16px;
}
</style>