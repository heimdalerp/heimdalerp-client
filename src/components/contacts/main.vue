<template>
  <router-view></router-view>
</template>
<script>
export default {
  created () {
    this.$parent.$data.currentApp = 'Contactos'
    this.$parent.$data.subMenuElements = [{ name: 'Preferencias', link: '/contacts/prefs/' }]
  }
}
</script>
