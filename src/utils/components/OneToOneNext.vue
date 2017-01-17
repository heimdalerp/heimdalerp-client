<template>
<div>
  {{ value }}
  <button @click="foo">foo</button>
</div>
</template>
<script>
export default {
  props: ['value'],
  methods: {
    foo () {
      this.$emit('input', 47)
    }
  }
}
</script>
<style>
</style>
