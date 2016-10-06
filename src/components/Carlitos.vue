<template>
<p class="no-content"></p>
</template>
<script>
export default {
  ready () {
    this.$parent.$data.currentApp = 'Carlitos'
    this.$parent.$data.subMenuElements = [
      {name: 'Consumos', dropdown: true, subElements: [
        {name: 'Asignar', link: '/carlitos/consumos/asignar'},
        {name: 'Imputar', link: '/carlitos/consumos/imputar'}
      ]}
    ]
  }
}
</script>
