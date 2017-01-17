<template>
  <router-view></router-view>
</template>
<script>
export default {
  created () {
    this.$parent.$data.currentApp = 'Contabilidad'
    this.$parent.$data.subMenuElements = [
      {name: 'Ventas', subElements: [
        {name: 'Facturas', link: '/accounting/invoices'},
        {name: 'Notas de Crédito', link: '/accounting/credits'},
        {name: 'Notas de Débito', link: '/accounting/debits'},
        {name: 'Pagos', link: '/accounting/billing'}
      ]},
      {name: 'Reportes', subElements: [
        {name: 'Cuenta Corriente', link: '/accounting/ledger'}
      ]},
      {name: 'Configuracion', subElements: [
        {name: 'Puntos de Venta', link: '/accounting/pointsofsale'}
      ]}
    ]
  }
}
</script>
