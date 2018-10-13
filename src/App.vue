<template>
  <div id="app">
    <Header />
    <!-- <div class="create-property" @click="stuff">create property</div> -->
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './components/Header.vue'

export default {
  name: 'app',
  components: {
    Header
  },
  methods: {

  }
}
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin: 0;
  padding: 0;
}
.create-property {
  background-color: salmon;
  height: 50px;
  width: 120px;
}
</style>
