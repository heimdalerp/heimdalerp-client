<template>
  <div>
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
            <div class="row">
              <div class="col-xs-12">
                <input
                  type="text"
                  class="form-control input-lg"
                  v-model="invoice_ar_contact.invoice_contact.contact_contact.name"
                  placeholder="Razón Social">
              </div>
            </div>
            <div class="row">
              <div class="col-xs-12">
                <one-to-one name="Posición fiscal" display="name" :options="fiscalpositions" v-model="invoice_ar_contact.invoice_contact.fiscal_position"></one-to-one>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-3">
                <one-to-one name="Identificación" display="name" :options="idtypes" v-model="invoice_ar_contact.id_type"></one-to-one>
              </div>
              <div class="col-xs-9">
                <label></label>
                <input class="form-control" type="text" name="name" v-model="invoice_ar_contact.id_number"/>
              </div>
            </div>
            <div class="row">
              <home-address editing="true" v-model="invoice_ar_contact.invoice_contact.fiscal_address"></home-address>
            </div>
            <div class="row">
              <locality editing="true" v-model="invoice_ar_contact.invoice_contact.fiscal_address.locality"></locality>
            </div>
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
        this.eventHub.$emit('showError', msg)
        return false
      }

      let contact = JSON.parse(JSON.stringify(this.invoice_ar_contact))

      contact.id_type = this.invoice_ar_contact.id_type.id
      contact.invoice_contact.fiscal_position =
        this.invoice_ar_contact.invoice_contact.fiscal_position.url
      contact.invoice_contact.legal_name =
        this.invoice_ar_contact.invoice_contact.contact_contact.name
      contact.invoice_contact.fiscal_address.locality =
        contact.invoice_contact.fiscal_address.locality.url
      contact.invoice_contact.contact_contact.home_address =
        contact.invoice_contact.fiscal_address

      this.addContact(this, contact).then(contact => {
        this.$emit('input', contact)
        this.dismiss()
      })
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
    this.getFiscalPositions()
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

<style scoped>
.glyphicon {
  margin-top: 6px;
}
</style>
