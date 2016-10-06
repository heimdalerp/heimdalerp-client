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
        <tr v-for="payment in payments" v-link="'/accounting/billing/' + payment.id">
          <td><input type="checkbox"></td>
          <td>{{ payment.payment_date }}</td>
          <td>{{ payment.contact_contact }}</td>
          <td>${{ payment.amount }}</td>
          <td>{{ type_string(payment.payment_type) }}</td>
          <td>{{ method_string(payment.payment_method) }}</td>
        </tr>
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
  components: {
    ButtonBar: require('../../utils/components/ButtonBar.vue')
  },
  data () {
    return {
      bb_crumbs: ['Contabilidad', 'Pagos'],
      bb_buttons: [{text: 'Ingresar', method: 'create'}]
    }
  },
  methods: {
    create () {
      this.$router.go('/accounting/billing/new')
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
  ready () {
    /* var p1 = this.$http.get('accounting/payments/')

    p1.then(
      function (response) {
        this.payments = response.json().results.reverse()
      },
      function (error) {
        this.$dispatch('showError', error.statusText)
      })

    p1.then(
      function (response) {
        for (let payment of this.payments) {
          // Fetch the contact's name
          var p2 = this.$http.get(payment.contact_contact)

          p2.then(function (response) {
            payment.contact_contact = response.data.name
          })
        }
      }
    )*/
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
