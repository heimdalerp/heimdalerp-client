<template>
  <div>
    <button-bar :crumbs="bb_crumbs" :buttons="bb_buttons"></button-bar>
    <table class="table table-hover table-striped table-border table-condensed table-hover">
      <thead>
        <th><input type="checkbox"></th>
        <th>Fecha</th>
        <th>Contacto</th>
        <th>Monto</th>
        <th>Tipo</th>
        <th>Método</th>
      </thead>
      <tbody>
        <router-link tag="tr" v-for="payment in payments" :to="'/accounting/billing/' + payment.id">
          <td><input type="checkbox"></td>
          <td>{{ payment.payment_date }}</td>
          <td>{{ payment.contact_contact }}</td>
          <td>${{ payment.amount }}</td>
          <td>{{ type_string(payment.payment_type) }}</td>
          <td>{{ method_string(payment.payment_method) }}</td>
        </router-link>
        <tr v-if="payments !== null && payments.length === 0">
          <td colspan="6">Sin resultados.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getPayments } from 'src/vuex/actions'

export default {
  data () {
    return {
      bb_crumbs: ['Contabilidad', 'Pagos'],
      bb_buttons: [{text: 'Ingresar', method: 'create'}]
    }
  },
  methods: {
    create () {
      this.$router.push('/accounting/billing/new')
    },
    type_string (type) {
      switch (type) {
        case 'R':
          return 'Receive'
        case 'S':
          return 'Send'
        case 'I':
          return 'Internal'
      }
    },
    method_string (method) {
      switch (method) {
        case 'C':
          return 'Cash'
        case 'CC':
          return 'Credit Card'
        case 'DB':
          return 'Debit Card'
        case 'B':
          return 'Bank Account'
        case 'CH':
          return 'Check'
        case 'P':
          return 'PayPal'
        case 'GW':
          return 'Google Wallet'
        case 'AP':
          return 'Apple Pay'
        case 'BC':
          return 'Bitcoin'
      }
    }
  },

  created () {
    this.getPayments()
  },

  vuex: {
    getters: {
      payments: store => store.accounting.payments.all
    },
    actions: {
      getPayments
    }
  }
}
</script>
