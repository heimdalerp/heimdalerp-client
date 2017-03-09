<template>
  <div>
    <button-bar :crumbs="bb_crumbs" :buttons="bb_buttons"></button-bar>
    <div class="jumbotron container">
      <div class="row">
        <div class="col-sm-6 col-xs-12">
          <div class="form-group" style="max-height: 59px">
            <label>Contacto</label>
            <div v-if="editing" class="input-group">
              <select class="form-control" v-model="payment.contact_contact">
                <option v-for="contact in contacts" :value="contact">{{ contact.invoice_contact.legal_name }}</option>
              </select>
              <div class="input-group-addon">
                <span class="glyphicon glyphicon-plus" @click="openContactViewQuick"></span>
              </div>
              </div>
            <p v-else>{{ payment.contact_contact }}</p>
          </div>
          <div class="form-group">
            <label>Tipo</label>
            <select v-if="editing" class="form-control" v-model="payment.payment_type">
              <option v-bind:value="'S'">Enviar</option>
              <option v-bind:value="'R'">Recibir</option>
            </select>
            <p v-else>{{ payment_type_human }}</p>
          </div>
          <div class="form-group" style="max-height: 59px">
            <label>Monto</label>
            <div v-if="editing" class="input-group">
              <div class="input-group-addon">$</div>
              <input type='text' class='form-control' v-model="payment.amount"/>
            </div>
            <p v-else>${{ payment.amount }}</p>
          </div>
        </div>

        <div class="col-sm-6 col-xs-12">
          <div class="form-group">
            <label>Fecha</label>
            <div v-if="editing" class="input-group">
              <input id="demo" type="text" class="form-control" v-model="payment.payment_date">
              <div class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></div>
            </div>
            <p v-else>{{ payment.payment_date }}</p>
          </div>
          <div class="form-group">
            <label>Método</label>
            <select v-if="editing" class="form-control" v-model="payment.payment_method">
              <option v-bind:value="'C'">Efectivo</option>
              <option v-bind:value="'CC'">Tarj. Credito</option>
              <option v-bind:value="'DB'">Tarj. Debito</option>
              <option v-bind:value="'B'">Transferencia</option>
              <option v-bind:value="'CH'">Cheque</option>
              <option v-bind:value="'P'">PayPal</option>
              <option v-bind:value="'GW'">Google Wallet</option>
              <option v-bind:value="'BC'">Bitcoin</option>
            </select>
            <!-- <select v-if="editing" class="form-control" v-model="payment.payment_method">
              <option v-for="paymentMethod in paymentMethods" :value="paymentMethod.id">{{ paymentMethod.name }}</option>
            </select> -->
            <p v-else>{{ payment_method_human }}</p>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-12">
          <label>Descripción</label>
          <textarea v-if="editing" v-model="payment.description"></textarea>
          <p v-else>{{ payment.description | default('-') }}</p>
        </div>
      </div>
      <contact-view-quick ref="contactViewQuick" v-model="contactCreated"></contact-view-quick>
    </div>

  </div>
</template>

<script>
import Vue from 'vue'
import { addPayment, getContacts } from '../../vuex/actions'

export default {
  name: 'BillingView',
  components: {
    ButtonBar: require('../../utils/components/ButtonBar.vue'),
    contactViewQuick: require('../contacts/viewQuick')
  },
  computed: {
    store_payment () {
      for (let obj in this.payments) {
        if (this.payments[obj].id === parseInt(this.$route.params.paymentId)) {
          return this.payments[obj]
        }
      }
    },
    editing () {
      return this.$route.params.paymentId === 'new'
    },
    payment_method_human () {
      switch (this.payment.payment_method) {
        case 'C':
          return 'Efectivo'
        case 'CC':
          return 'Tarj. Crédito'
        case 'DB':
          return 'Tarj. Débito'
        case 'B':
          return 'Transferencia'
        case 'CH':
          return 'Cheque'
        case 'P':
          return 'PayPal'
        case 'GW':
          return 'Google Wallet'
        case 'BC':
          return 'Bitcoin'
      }
    },
    payment_type_human () {
      switch (this.payment.payment_type) {
        case 'S':
          return 'Enviar'
        case 'R':
          return 'Recibir'
        case 'I':
          return 'Interno'
      }
    }
  },

  data () {
    return {
      bb_crumbs: ['Contabilidad', 'Pagos', 'Ingresar'],
      bb_buttons: [{text: 'Guardar', method: 'save', condition: function () { return this.editing }.bind(this)},
                   {text: 'Descartar', method: 'discard', class: 'btn-link', condition: function () { return this.editing }.bind(this)}],
      payment: {},
      paymentMethods: [{ id: 'C', name: 'Efectivo' },
                       { id: 'CC', name: 'Tarj. Credito' },
                       { id: 'DB', name: 'Tarj. Debito' },
                       { id: 'B', name: 'Transferencia' },
                       { id: 'CH', name: 'Cheque' },
                       { id: 'P', name: 'PayPal' },
                       { id: 'GW', name: 'Google Wallet' },
                       { id: 'BC', name: 'Bitcoin' }],
      contactCreated: {}
    }
  },

  methods: {
    discard () {
      this.$router.push('/accounting/billing/')
    },
    save () {
      let payment = JSON.parse(JSON.stringify(this.payment))

      payment.contact_contact = payment.contact_contact.contact_contact
      payment.accounting_company = 'http://localhost:8000/api/accounting/companies/1/'

      this.addPayment(this.payment).then(function (response) {
        this.$router.push('/accounting/billing/')
      })
    },
    openContactViewQuick () {
      this.$refs.contactViewQuick.open()
    }
  },

  created () {
    if (this.$route.params.paymentId === 'new') {
      this.payment = Object.assign({}, this.payment, {
        accounting_company: null,
        contact_contact: null,
        payment_date: null,
        payment_type: null,
        payment_method: null,
        amount: null,
        description: ''
      })
      this.editing = true
      this.bb_crumbs.push('Ingresar nuevo pago')
    } else {
      this.payment = this.store_payment
    }
  },

  mounted () {
    let vm = this
    this.getContacts()

    Vue.nextTick(function () {
      var $ = window.jQuery

      if (vm.$route.params.paymentId === 'new') {
        $('#demo').daterangepicker({
          'singleDatePicker': true,
          'locale': {
            'format': 'YYYY-MM-DD',
            'separator': ' - ',
            'applyLabel': 'Apply',
            'cancelLabel': 'Cancel',
            'fromLabel': 'From',
            'toLabel': 'To',
            'customRangeLabel': 'Custom',
            'weekLabel': 'W',
            'daysOfWeek': [
              'Do',
              'Lu',
              'Ma',
              'Mi',
              'Ju',
              'Vi',
              'Sa'
            ],
            'monthNames': [
              'Enero',
              'Febrero',
              'Marzo',
              'Abril',
              'Mayo',
              'Junio',
              'Julio',
              'Agosto',
              'Septiembre',
              'Octubre',
              'Noviembre',
              'Diciembre'
            ],
            'firstDay': 1
          },
          'startDate': (function () {
            let today = new Date()
            return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
          })()
        })

        let today = new Date()
        vm.payment.payment_date = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
      }
    })
  },

  watch: {
    contactCreated (newContact) {
      this.payment.contact_contact = newContact
    }
  },

  vuex: {
    getters: {
      contacts: state => state.contacts.all,
      payments: state => state.accounting.payments.all
    },
    actions: {
      addPayment,
      getContacts
    }
  }
}
</script>

<style scoped>
textarea {
  display: block;
  width: 100%;
}
</style>
