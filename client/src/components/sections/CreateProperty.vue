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
      console.log('web3.eth.accounts', web3.eth.accounts);
      console.log(this.$data.uri)

      try {
        const tx = await window.propertyContract.createProperty();
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
