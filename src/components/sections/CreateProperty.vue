<template>
  <site-section>
    <template slot="title">
      Create property
    </template>
    <form>
      <!-- <input
        name="uri"
        type="text"
        v-model="uri"
        placeholder="Enter URI"
      > -->
      <button @click="createProperty">Create</button>
    </form>
  </site-section>
</template>

<script>
import SiteSection from '@/src/components/reusables/SiteSection.vue'
import NavButton from '@/src/components/reusables/NavButton.vue'
import store from '@/src/store'
import getAddress from '@/util/getAddress'

export default {
  components: {
    SiteSection,
    NavButton,
  },
  data() {
    return {
      uri: '',
    }
  },
  methods: {
    async createProperty(e) {
      e.preventDefault()
      this.$store.commit('startLoading', { message: 'Creating property...' })
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
form {
  display: flex;
  justify-content: center;
}
</style>
