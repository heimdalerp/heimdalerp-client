<template>
<label for="{{id}}">{{name}}:</label>
<select id="{{id}}" class="form-control" v-model="selected">
  <option v-for="option in options" value="{{ option.id }}">{{ option.name }}</option>
</select>
</template>
<script>
export default {
  props: ['name', 'options', 'default'],
  data () {
    return {
      selected: null
    }
  },
  created: function () {
    this.id = Math.floor((Math.random() * 10000) + 1)
    this.selected = this.default
  },
  watch: {
    selected () {
      this.$dispatch('otoChange', {name: this.name, value: this.selected})
    }
  }
}
</script>
<style>
</style>
