<template>
<div>
  <label :for="id">{{ name }}</label>
  <select :id="id" class="form-control" v-model="selected">
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
  },
  created: function () {
    this.id = Math.floor((Math.random() * 10000) + 1)
  }
}
</script>
