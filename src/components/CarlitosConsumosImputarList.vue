<template>
  <div>
    <button-bar :crumbs="bb_crumbs"></button-bar>
    <table class="table table-hover table-striped table-border table-condensed table-hover">
      <thead>
        <th><input type="checkbox"></th>
        <th>Nombre</th>
        <th>Teléfono</th>
        <th>Email</th>
      </thead>
      <tbody>
        <tr v-for="invoice in invoices" v-link="'/carlitos/consumos/imputar/' + invoice.id + '/' + currentYear + '/' + currentMonth">
          <td><input type="checkbox"></td>
          <td>{{invoice.invoice_contact.contact_contact.name}}</td>
          <td>{{invoice.invoice_contact.contact_contact.phone_numbers}}</td>
          <td>{{invoice.invoice_contact.contact_contact.extra_emails}}</td>
        </tr>
        <tr v-if="invoices.length === 0">
          <td colspan="4">Sin resultados.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ButtonBar from '../utils/components/ButtonBar.vue'

export default {
  components: {'ButtonBar': ButtonBar},
  data () {
    return {
      bb_crumbs: ['Consumos', 'Imputar'],
      bb_buttons: [{text: 'Crear', method: 'create'}],
      invoices: []
    }
  },
  computed: {
    currentMonth () {
      var d = new Date()
      return d.getMonth() + 1
    },
    currentYear () {
      var d = new Date()
      return d.getFullYear()
    }
  },
  methods: {
  },
  ready () {
  },
  compiled () {
    this.$http.get('invoice_ar/contacts/').then(
      function (response) {
        this.invoices = response.json().results
      })
  }
}
</script>
