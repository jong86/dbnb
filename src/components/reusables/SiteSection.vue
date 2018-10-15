<template>
  <div class="site-section">
    <h3><slot name="title" /></h3>
    <slot />
  </div>
</template>

<script>
export default {
}
</script>

<style scoped lang="scss">
.site-section {
  width: fill-available;
  background-color: whitesmoke;
  color: #000;
  display: flex;
  flex-direction: column;
  border: 1px solid gainsboro;
  border-radius: 4px;
  margin: 1em;
}
</style>
