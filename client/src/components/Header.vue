<template>
  <div class="header">
    <div>
      <h3>dBNB</h3>
    </div>
    <div class="links">
      <div>Create Property</div>
      <div>View My Properties</div>
      <div>Find Rental</div>
      <div>View My Requests</div>
    </div>
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
