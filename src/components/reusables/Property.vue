<template>
  <div
    class="property"
  >
    <div class="property-col">
      <slot>
      </slot>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
.property {
  display: flex;
  align-items: center;
  border: 1px solid gainsboro;
  border-radius: 4px;
  margin: 4px;
  padding: 4px;
  .property-col {
    padding: 4px;
  }
}
</style>
