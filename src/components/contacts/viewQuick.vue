<template>
  <div>
    <span class="glyphicon glyphicon-plus" @click="open"></span>

    <!-- Create Organization Modal -->
    <div id="createContactModal" class="modal fade" role="dialog">
      <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" @click="dismiss">&times;</button>
            <h4 class="modal-title">Crear Contacto</h4>
          </div>
          <div class="modal-body">
              <input
                type="text"
                class="form-control input-lg"
                v-model="invoice_ar_contact.invoice_contact.contact_contact.name"
                placeholder="Razón Social"
                />
                <one-to-one v-if="editing" name="Posición fiscal" display="name" :options="fiscalpositions" v-model="invoice_ar_contact.invoice_contact.fiscal_position"></one-to-one>
                <one-to-one name="Identificación" display="name" :options="idtypes" v-model="invoice_ar_contact.id_type"></one-to-one>
                <input class="form-control" type="text" name="name" v-model="invoice_ar_contact.id_number"/>

                <home-address editing="true" v-model="invoice_ar_contact.invoice_contact.fiscal_address"></home-address>
                <locality editing="true" v-model="invoice_ar_contact.invoice_contact.fiscal_address.locality"></locality>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="save">Save</button>
            <button type="button" class="btn btn-default" @click="dismiss">Close</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import auth from '../../auth/index.js'
import { addContact, editContact, getFiscalPositions } from '../../vuex/actions'

export default {
  name: 'contactViewQuick',
  data () {
    return {
      idtypes: [{id: 'D', name: 'DNI'}, {id: 'T', name: 'CUIT'}, {id: 'L', name: 'CUIL'}],
      invoice_ar_contact: {}
    }
  },

  methods: {
    edit () {
      this.editing = true
    },
    discard () {
      var r = window.confirm('Desea descartar los datos ingresados?')

      if (r) {
      }
    },
    save () {
      var hasErrors = false
      var msg = ''
      if (this.invoice_ar_contact.invoice_contact.fiscal_position === undefined) {
        msg += 'Debe rellenar la Posición Fiscal.\r\n'
        hasErrors = true
      }

      if (this.invoice_ar_contact.invoice_contact.contact_contact.name === undefined) {
        msg += 'Debe rellenar la Razón Social.\r\n'
        hasErrors = true
      }

      if (hasErrors === true) {
        this.$dispatch('showError', msg)
        return false
      }

      this.invoice_ar_contact.id_type = this.invoice_ar_contact.id_type.id
      this.invoice_ar_contact.invoice_contact.fiscal_position =
        this.invoice_ar_contact.invoice_contact.fiscal_position.url
      this.invoice_ar_contact.invoice_contact.legal_name =
        this.invoice_ar_contact.invoice_contact.contact_contact.name
      this.invoice_ar_contact.invoice_contact.contact_contact.home_address =
        this.invoice_ar_contact.invoice_contact.fiscal_address

      let invoice = this.invoice_ar_contact
      invoice.invoice_contact.fiscal_address.locality =
        invoice.invoice_contact.fiscal_address.locality.url

      if (this.$route.params.contactId === 'new') {
        this.addContact(this, invoice).then(response => {
          // this.$router.push('/contacts/' + response.data.id + '/')
        })
      } else {
        this.editContact(invoice).then(response => {
          // this.$router.push('/contacts')
        })
      }
    },
    dismiss () {
      window.jQuery('#createContactModal').modal('hide')
    },
    open () {
      window.jQuery('#createContactModal').modal({backdrop: 'static'})
    }
  },

  created () {
    this.invoice_ar_contact = {
      id_type: {},
      invoice_contact: {
        fiscal_position: {},
        fiscal_address: {
          locality: {}
        },
        contact_contact: {
          contact_type: 'C',
          extra_emails: '',
          phone_numbers: '',
          home_address: '',
          persons_company: auth.user.company
        }
      }
    }
  },

  vuex: {
    getters: {
      fiscalpositions: state => state.accounting.fiscalPositions.all
    },
    actions: {
      addContact,
      editContact,
      getFiscalPositions
    }
  }
}
</script>
