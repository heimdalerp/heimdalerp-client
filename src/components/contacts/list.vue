<template>
  <div>
    <button-bar :crumbs="bb_crumbs" :buttons="bb_buttons"></button-bar>
    <table class="table table-hover table-striped table-border table-condensed table-hover">
      <thead>
        <th><input type="checkbox"></th>
        <th>Nombre</th>
        <th>Teléfono</th>
        <th>Email</th>
      </thead>
      <tbody>
        <router-link :to="'/contacts/' + contact.id" tag="tr" v-for="contact in contacts">
          <td><input type="checkbox"></td>
          <td>{{ contact.invoice_contact.contact_contact.name }}</td>
          <td>{{ contact.invoice_contact.contact_contact.phone_numbers }}</td>
          <td>{{ contact.invoice_contact.contact_contact.extra_emails }}</td>
        </router-link>
        <tr v-if="contacts.length === 0">
          <td colspan="4">Sin resultados.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getContacts, deleteContact } from 'src/vuex/actions'

export default {
  data () {
    return {
      bb_crumbs: ['Contactos'],
      bb_buttons: [{text: 'Crear', method: 'create'}]
    }
  },

  methods: {
    create () {
      this.$router.push('/contacts/new')
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
      getContacts,
      deleteContact
    }
  }
}
</script>
