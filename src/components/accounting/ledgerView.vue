<template>
  <div class="jumbotron">
    <h3>{{ contactName }}</h3>

    <table class="table table-striped">
      <thead>
        <tr><th>Fecha</th><th>Descripción</th><th>Debe</th><th>Haber</th></tr>
      </thead>
      <tbody>
        <tr v-for="line in lines | orderBy 'date' -1">
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
import { getContacts, getPaymentsByContact } from '../../vuex/actions'

export default {
  data () {
    return {
      contactName: null,
      contactURL: null,
      db: null,
      lines: [{date: '', desc: '', type: 'D', amount: 0}]
    }
  },

  computed: {
    store_contact () {
      for (let obj in this.contacts) {
        if (this.contacts[obj].id === parseInt(this.$route.params.contactId)) {
          return this.contacts[obj]
        }
      }
    },
    contact () {
      return this.$route.params.contactId
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
    var p = this.getContacts()
    p.then(function (response) {
      var p2 = this.getPaymentsByContact(this.store_contact)
      p2.then(function (response) {
        this.contactName = this.store_contact.invoice_contact.contact_contact.name
      })
    })
  },

  ready: function () {
    var TAFFY = require('taffydb').taffy

    // Get the invoices for this contact
    let _self = this
    this.db = TAFFY()
    this.$http.get('invoice_ar/contacts/' + this.contact + '/invoices/').then(function (response) {
      response.json().results.forEach(function (result) {
        _self.db.insert(result)
      })

      _self.lines = []

      // Add to lines grouped by month, only 2016 for now
      for (let i = 1; i <= 12; i++) {
        var subtotalMonth = 0
        var iPad = ('00' + i).substring(i.toString().length)

        this.db({invoice_date: {like: '2016-' + iPad}}).each(function (r) {
          subtotalMonth += Math.round(r.total * 100) / 100
        })

        subtotalMonth = parseFloat(subtotalMonth).toFixed(2)

        if (subtotalMonth !== '0.00') {
          _self.lines.push({date: '2016-' + iPad + '-30', type: 'D', amount: subtotalMonth, description: 'Consumos de ' + i + ' 2016'})
        }
      }

      this.$http.get('accounting/contacts/' + this.contact + '/payments/').then(function (response) {
        response.json().results.forEach(function (result) {
          _self.lines.push({date: result.payment_date, type: 'H', amount: result.amount.toFixed(2), description: 'Pago ' + result.description})
        })
      })
    })
  },

  vuex: {
    getters: {
      contacts: store => store.contacts.all,
      payments: store => store.accounting.payments.all
    },
    actions: {
      getContacts,
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
