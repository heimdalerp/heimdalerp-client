<template>
<div>
  <label>
    {{ name }}
    <select class="form-control" v-model="selected">
      <option v-for="option in options" :value="option">{{ option[display] }}</option>
    </select>
  </label>

</div>
</template>
<script>
export default {
  props: ['options', 'value', 'name', 'display'],
  computed: {
    selected: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>

<style scoped>
label {
  display: block;
}
</style>
