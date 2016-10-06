<template>
  <div>
    <button-bar :crumbs="bb_crumbs" :buttons="bb_buttons"></button-bar>
    <div class="jumbotron container">
      <div class="col-sm-6 col-xs-12">
        <div class="form-group" style="max-height: 59px">
          <label>Contacto</label>
          <input v-if="editing" id='contactInput' type='text' class='form-control' />
          <p v-else>{{ payment.contact_contact }}</p>
        </div>
        <div class="form-group">
          <label>Tipo</label>
          <select v-if="editing" class="form-control" v-model="payment.payment_type">
            <option v-bind:value="'S'">Enviar</option>
            <option v-bind:value="'R'">Recibir</option>
            <option v-bind:value="'I'">Interno</option>
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
          <p v-else>{{ payment_method_human }}</p>
        </div>
      </div>

      <div class="col-sm-12">
        <label>Descripción</label>
        <textarea v-if="editing" v-model="payment.description"></textarea>
        <p v-else>{{ payment.description | default '-' }}</p>
      </div>

    </div>
  </div>
</template>

<script>
import { addPayment } from '../../vuex/actions'

export default {
  components: {
    ButtonBar: require('../../utils/components/ButtonBar.vue')
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
      payment: {}
    }
  },
  methods: {
    discard () {
      this.$router.go('/accounting/billing/')
    },
    save () {
      this.payment.contact_contact = window.jQuery('#contactInput').val()
      this.payment.accounting_company = 'http://localhost:8000/api/accounting/companies/1/'

      this.addPayment(this.payment).then(function (response) {
        this.$router.go('/accounting/billing/')
      })
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

  ready () {
    var p
    var $ = window.jQuery
    var elt = $('#contactInput')
    var engine

    if (this.$route.params.paymentId === 'new') {
      p = this.$http.get('contact/contacts/')
      p.then(function (response) {
        engine = new window.Bloodhound({
          datumTokenizer: window.Bloodhound.tokenizers.obj.whitespace('name'),
          queryTokenizer: window.Bloodhound.tokenizers.whitespace,
          local: response.data.results
        })
        engine.initialize()

        elt.tagsinput({
          maxTags: 1,
          itemValue: 'url',
          itemText: 'name',
          typeaheadjs: {
            name: 'engine',
            displayKey: 'name',
            source: engine.ttAdapter()
          }
        })
      })

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
        'startDate': '2016-08-01',
        'endDate': '2016-08-31'
      })
    }
  },
  vuex: {
    getters: {
      payments: state => state.accounting.payments.all
    },
    actions: {
      addPayment
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
