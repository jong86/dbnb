<template>
  <div class="header">
    <div>
      <h3>dBNB</h3>
    </div>
    <div class="links">
      <nav-button
        v-for="link of links"
        :key="link.path"
        :path="link.path"
      >{{link.label}}</nav-button>
      <div class="balance">
        Your balance: {{ $store.state.tokenBalance / 100000000 }} PPT
      </div>
    </div>
  </div>
</template>

<script>
import NavButton from './reusables/NavButton.vue'

export default {
  name: 'Header',
  components: {
    NavButton,
  },
  data: () => ({
    links: [
      { label: 'Find a rental', path: '/' },
      { label: 'View my properties', path: '/my-properties' },
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
    margin: 4px;
  }
  .balance {
    display: flex;
    align-items: center;
    margin-left: 8px;
  }
}
</style>
