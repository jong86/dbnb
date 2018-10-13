<template>
  <div
    class="cool-button"
    @click="doAction"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    path: String,
  },
  methods: {
    doAction: function() {
      this.$router.push(this.$props.path)
    }
  }
}
</script>

<style scoped lang="scss">
.cool-button {
  width: fit-content;
  background-color: whitesmoke;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid gainsboro;
  border-radius: 4px;
  margin: 4px;
  padding: 2px;
  cursor: pointer;
}
</style>
