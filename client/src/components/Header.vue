<template>
  <div class="header">
    <h3>dBNB</h3>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
  width: 100%;
  background-color: #000;
  color: white;
  padding-top: 4px;
}

h3 {
}
</style>
