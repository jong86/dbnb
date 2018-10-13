<template>
  <site-section>
    <div>
      Create property
    </div>
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
import SiteSection from '../reusables/SiteSection.vue'
import NavButton from '../reusables/NavButton.vue'
import { propertyContract } from '../../contracts.js'

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
