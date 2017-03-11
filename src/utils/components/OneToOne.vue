<template>
  <div>
    <label>{{ name }}</label>
    <select class="form-control" v-model="selected">
      <option v-for="option in options" :value="option">{{ option[display] }}</option>
    </select>
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
