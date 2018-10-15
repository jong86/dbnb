<template>
  <site-section>
    <div>
      View my requests
    </div>
  </site-section>
</template>

<script>
import SiteSection from '../reusables/SiteSection.vue'
import store from '../../store.js'
import { now } from '../../../util/time.js'

export default {
  components: {
    SiteSection,
  },
  data() {
    return {
      rentals: [],
    }
  },
  mounted() {
    this.getRentals()
  },
  methods: {
    async getRentals() {
      const propertyContract = store.state.propertyContract
      const totalSupply = await propertyContract.totalSupply()

      try {
        const rentals = []
        for (let i = 0; i < totalSupply; i++) {
          const uri = await propertyContract.getURI(i, {
            from: window.web3.eth.accounts[0],
            gas: 200000,
          })
          rentals.push({
            id: i,
            uri: uri,
          })
        }

        this.rentals = rentals

      } catch (e) {
        console.error(e)
      }
    },
  }
}
</script>

<style scoped lang="scss">

</style>
