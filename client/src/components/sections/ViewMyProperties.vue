<template>
  <site-section>
    <div>
      View my properties
    </div>
    <div v-for="property in properties" :key="property.toString()">
      {{property.toString()}}
    </div>
  </site-section>
</template>

<script>
import SiteSection from '../reusables/SiteSection.vue'
import { getContract } from '../../contracts.js'
import jsonProperty from '../../../../build/contracts/Property.json'

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
      const propertyContract = await getContract(jsonProperty);
      console.log('propertyContract', propertyContract);

      try {
        const properties = await propertyContract.getProperties({
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
