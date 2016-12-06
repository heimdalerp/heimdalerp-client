<template>
  <router-view></router-view>
</template>
<script>
export default {
  created () {
    this.$parent.$data.currentApp = 'Inventario'
    this.$parent.$data.subMenuElements = [{ name: 'Productos', link: '/inventory/' }]
  }
}
</script>
