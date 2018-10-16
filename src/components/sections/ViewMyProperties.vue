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
      >Create new property</button>
    </div>
    <div
      class="my-property"
      v-for="(property, key) in $store.state.myProperties"
      :key="key"
    >
      <div class="my-property-col">
        Id: {{property.id}}
      </div>
      <div class="my-property-col">
        URI: {{property.uri}}
      </div>
      <div class="my-property-col">
        <button
          v-if="!property.price"
          @click="registerProperty(property.id)"
        >Register</button>
        <span v-else>Price: {{property.price}}</span>
      </div>
      <div class="my-property-col" v-if="property.price">
        Requests: {{property.requested}}
      </div>
      <div class="my-property-col" v-if="property.price">
        Occupant: {{property.occupant}}
      </div>
    </div>
  </site-section>
</template>

<script>
import SiteSection from '@/src/components/reusables/SiteSection.vue'
import getAddress from '@/util/getAddress'
import retryInvoke from '@/util/retryInvoke'

export default {
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
    retryInvoke(this.getProperties)
  },
  methods: {
    async getProperties() {
      const propertyContract = this.$store.state.propertyContract
      const propertyRegistryContract = this.$store.state.propertyRegistryContract
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
          const response = await propertyRegistryContract.getRegPropData(propertyId, {
            from: address,
            gas: 200000,
          })

          var price = parseInt(response[0].toString())
          var requested = response[1]
          var occupant = response[2] === "0x0000000000000000000000000000000000000000" ? 'Vacant' : response[2]

        } catch (e) {
          console.error(e);
        }

        properties.push({
          id: propertyId.toString(),
          uri,
          requested,
          price,
          occupant,
        })
      })

      this.$store.commit('setMyProperties', properties)
      this.$store.commit('stopLoading')
    },

    async setURI(id, uri) {
      const propertyContract = this.$store.state.propertyContract
      const address = await getAddress()

      console.log('setting uri', uri, 'for', id);

      // try {
      //   propertyContract.setURI()
      // } catch (e) {

      // }
    },

    async createWithURI(uri) {
      this.$store.commit('startLoading', { message: 'Waiting for signature...' })
      const propertyContract = this.$store.state.propertyContract
      const propertyRegistryContract = this.$store.state.propertyRegistryContract
      const address = await getAddress()

      try {
        await propertyContract.createWithURI(uri, {
          from: address,
          gas: 200000,
        });
      } catch(e) {
        console.error(e);
      }

      this.$store.commit('startLoading', { message: 'Waiting for block to be mined...' })
    },

    async registerProperty(id) {
      const price = prompt("How much to charge per night?")

      this.$store.commit('startLoading', { message: 'Waiting for signature...' })
      const propertyRegistryContract = this.$store.state.propertyRegistryContract
      const address = await getAddress()

      try {
        await propertyRegistryContract.registerProperty(id, price, {
          from: address,
          gas: 200000,
        });
      } catch(e) {
        console.error(e);
      }

      this.$store.commit('startLoading', { message: 'Waiting for block to be mined...' })
    },
  }
}
</script>

<style scoped lang="scss">
.create-property {
  width: fit-content;
}
.create-box {
  border: 1px solid gainsboro;
  padding: 16px;
  border-radius: 4px;
  margin: 16px;
}

.my-property {
  display: flex;
  align-items: center;
  border: 1px solid gainsboro;
  border-radius: 4px;
  margin: 4px;
  padding: 4px;

  .my-property-col {
    padding: 4px;
  }
}
</style>
