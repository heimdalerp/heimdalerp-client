<template>
  <div id="buttonbar" class="container-fluid">
    <ol class="breadcrumb">
      <li v-for="crumb in crumbs" v-bind:class="{'active': $index == crumbs.length-1}">{{crumb | capitalize}}</li>
    </ol>
    <button v-for="button in buttons" @click="clicked(button.method)"
            v-if="condition(button.condition)" class="btn"
            v-bind:class="[button.class? button.class : 'btn-primary']">
              {{button.text}}
    </button>
  </div>
</template>
<script>
export default {
  props: ['crumbs', 'buttons'],
  methods: {
    clicked (method) {
      if (method !== undefined) {
        this.$parent[method]()
      }
    },
    condition (condition) {
      if (condition !== undefined) {
        return condition()
      } else {
        return true
      }
    }
  }
}
</script>
<style scoped>
#buttonbar {
  background-color: white;
  padding-top: 5px;
  min-height: 87.5px;
}

.btn {
  margin-right: 5px;
}

.breadcrumb {
  margin-bottom: 2.5px;
}
</style>
