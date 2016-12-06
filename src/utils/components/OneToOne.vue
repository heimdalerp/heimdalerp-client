<template>
<div>
  <label for="{{id}}">{{name}}:</label>
  <select id="{{id}}" class="form-control" v-model="model">
    <option v-for="option in options" value="{{ option[key] || option.id }}">{{ option.name }}</option>
  </select>
</div>
</template>
<script>
export default {
  props: ['key', 'name', 'options', 'model'],
  created: function () {
    this.id = Math.floor((Math.random() * 10000) + 1)
  }
}
</script>
<style>
</style>
