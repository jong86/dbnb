<template>
  <site-section>
    <template slot="title">
      Create property
    </template>
    <form>
      <input
        name="uri"
        type="text"
        v-model="uri"
        placeholder="Enter URI"
      >
      <button @click="createProperty">Create</button>
    </form>
  </site-section>
</template>

<script>
import SiteSection from '@/src/components/reusables/SiteSection.vue'
import NavButton from '@/src/components/reusables/NavButton.vue'
import store from '@/src/store.js'

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
      const propertyContract = store.state.propertyContract

      try {
        const tx = await propertyContract.createProperty({
          from: window.web3.eth.accounts[0],
          gas: 200000,
        });
        console.log(tx);
        console.log('Property Created for Alice');
      } catch(e) {
        console.log(e);
        alert('Error creating property', e)
      }
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
