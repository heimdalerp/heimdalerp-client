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
        <tr v-for="contact in contacts" v-link="'/accounting/ledger/' + contact.id">
          <td><input type="checkbox"></td>
          <td>{{contact.invoice_contact.contact_contact.name}}</td>
          <td>{{contact.invoice_contact.contact_contact.phone_numbers}}</td>
          <td>{{contact.invoice_contact.contact_contact.extra_emails}}</td>
        </tr>
        <tr v-if="contacts.length === 0">
          <td colspan="4">Sin resultados.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getContacts } from '../../vuex/actions'

export default {
  components: {
    'ButtonBar': require('../../utils/components/ButtonBar.vue')
  },

  data: function () {
    return {
      bb_crumbs: ['Contabilidad', 'Cuenta Corriente'],
      bb_buttons: []
    }
  },

  created () {
    this.getContacts()
  },

  vuex: {
    getters: {
      contacts: store => store.contacts.all
    },
    actions: {
      getContacts
    }
  }
}
</script>
