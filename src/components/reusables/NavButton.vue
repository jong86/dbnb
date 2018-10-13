<template>
  <div
    class="nav-button"
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
    doAction() {
      const { path, fn } = this.$props

      if (path) {
        this.$router.push(path)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.nav-button {
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
  font-size: 14px;
}
</style>
