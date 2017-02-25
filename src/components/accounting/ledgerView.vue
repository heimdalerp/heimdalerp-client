<template>
  <div class="jumbotron">
    <h3>{{ contactName }}</h3>

    <table class="table table-striped">
      <thead>
        <tr><th>Fecha</th><th>Descripción</th><th>Debe</th><th>Haber</th></tr>
      </thead>
      <tbody>
        <tr v-for="line in lines">
          <td>{{ line.date }}</td>
          <td>{{ line.description }}</td>
          <td><span v-if="line.type === 'D'">${{ line.amount }}</span></td>
          <td><span v-if="line.type === 'H'">${{ line.amount }}</span></td>
        </tr>
        <tr>
          <td></td>
          <td>Subtotales</td>
          <td>${{ debeSum }}</td>
          <td>${{ haberSum }}</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td>Balance</td>
          <td>
            <span v-if="balance < 0" style="font-weight: bold; color: red">
              -${{ Math.abs(balance).toFixed(2) }}
            </span>
            <span v-if="balance >= 0" style="font-weight: bold; color: green">
              ${{ balance }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { getContacts, getInvoicesByContact, getPaymentsByContact } from '../../vuex/actions'

export default {
  data () {
    return {
      contactName: null,
      contactURL: null,
      db: null,
      lines: []
    }
  },

  computed: {
    contact () {
      for (let obj in this.contacts) {
        if (this.contacts[obj].id === parseInt(this.$route.params.contactId)) {
          return this.contacts[obj]
        }
      }
    },
    debeSum () {
      var subtotalDebe = 0
      this.lines.forEach(function (line) {
        if (line.type === 'D') {
          subtotalDebe += Number(line.amount)
        }
      })
      return subtotalDebe.toFixed(2)
    },
    haberSum () {
      var subtotalHaber = 0
      this.lines.forEach(function (line) {
        if (line.type === 'H') {
          subtotalHaber += Number(line.amount)
        }
      })
      return subtotalHaber.toFixed(2)
    },
    balance () {
      return (Number(this.haberSum) - this.debeSum).toFixed(2)
    }
  },

  created () {
    var TAFFY = require('taffydb').taffy
    this.db = TAFFY()

    var vm = this
    this.getContacts().then(function (response) {
      vm.contactName = vm.contact.invoice_contact.contact_contact.name

      // Get the invoices for this contact
      vm.getInvoicesByContact(vm.contact).then(function () {
        vm.invoices.forEach(function (invoice) {
          vm.db.insert(invoice)
        })
      })

      // Get the payments for this contact
      vm.getPaymentsByContact(vm.contact).then(function () {
        vm.payments.forEach(function (payment) {
          vm.lines.push({date: payment.payment_date, type: 'H', amount: payment.amount.toFixed(2), description: 'Pago ' + payment.description})
        })
      })
    })
  },

  vuex: {
    getters: {
      contacts: store => store.contacts.all,
      invoices: store => store.accounting.invoices.all,
      payments: store => store.accounting.payments.all
    },
    actions: {
      getContacts,
      getInvoicesByContact,
      getPaymentsByContact
    }
  }
}
</script>

<style scoped>
  .jumbotron {
    text-align: center;
  }
</style>
