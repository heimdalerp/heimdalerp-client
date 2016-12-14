<template>
  <div>
    <button-bar :crumbs="bb_crumbs" :buttons="bb_buttons"></button-bar>
    <table class="table table-hover table-striped table-border table-condensed table-hover">
      <thead>
        <th><input type="checkbox"></th>
        <th>Cliente</th>
        <th>Fecha</th>
        <th>Número</th>
        <th>Vencimiento</th>
        <th>Total</th>
        <th>Estado</th>
      </thead>
      <tbody>
        <tr v-for="invoice in invoices" v-link="'/accounting/invoices/' + invoice.id">
          <td><input type="checkbox"></td>
          <td>{{ invoice.invoicear_contact.invoice_contact.legal_name }}</td>
          <td>{{ invoice.due_date }}</td>
          <td v-if="invoice.invoice_type !== null && invoice.number !== 0">{{ invoice.invoice_type + invoice.point_of_sale_ar + '-' + ('0000000' + invoice.number).slice(-8) }}</td>
          <td v-else>-</td>
          <td>{{ invoice.due_date }}</td>
          <td>$ {{ invoice.total }}</td>
          <td>{{ status_string(invoice.status) }}</td>
        </tr>
        <tr v-if="invoices.length === 0">
          <td colspan="4">Sin resultados.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ButtonBar from '../../utils/components/ButtonBar.vue'
import { getInvoices } from '../../vuex/actions'

export default {
  components: {
    ButtonBar
  },

  data: function () {
    return {
      bb_crumbs: ['Contabilidad', 'Facturas'],
      bb_buttons: [{text: 'Crear', method: 'create'}]
    }
  },

  methods: {
    create: function () {
      this.$router.go('/accounting/invoices/new')
    },
    status_string (status) {
      switch (status) {
        case 'D':
          return 'Borrador'
        case 'A':
          return 'Aceptada'
        case 'T':
          return 'Autorizada'
      }
    }
  },

  compiled () {
    this.getInvoices()
  },

  vuex: {
    getters: {
      invoices: store => store.accounting.invoices.all
    },
    actions: {
      getInvoices
    }
  }
}
</script>
