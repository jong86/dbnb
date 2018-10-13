<template>
  <div class="header">
    <div>
      <h3>dBNB</h3>
    </div>
    <div class="links">
      <cool-button
        v-for="link of links"
        :key="link.path"
        :path="link.path"
      >{{link.label}}</cool-button>
    </div>
  </div>
</template>

<script>
import CoolButton from './reusables/CoolButton.vue'

export default {
  name: 'Header',
  components: {
    CoolButton,
  },
  data: () => ({
    links: [
      { label: 'Find Rental', path: '/' },
      { label: 'Create Property', path: '/create' },
      { label: 'View My Properties', path: '/my-properties' },
      { label: 'View My Requests', path: '/my-requests' },
    ],
  }),
}
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  background-color: #000;
  color: #fff;
  padding-top: 4px;
  display: flex;
  flex-direction: column;

  .links {
    display: flex;
  }

  h3 {

  }
}


</style>
