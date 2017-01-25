<template>
  <div>
    <button-bar :crumbs="bb_crumbs" :buttons="bb_buttons"></button-bar>
    <form novalidate>
    <div class="jumbotron">
      <div class="col-xs-12">
        <div class="col-xs-10">
          <h2 v-if="!editing">{{ invoice_ar_contact.invoice_contact.contact_contact.name }}</h2>
          <input
            type="text"
            v-if="editing"
            class="form-control input-lg"
            v-model="invoice_ar_contact.invoice_contact.contact_contact.name"
            placeholder="Razón Social"
            />
        </div>
      </div>
      <div class="col-xs-12">
        <div class="col-xs-10">
          <h6 v-if="!editing && type">Es una persona jurídica</h6>
          <h6 v-if="!editing && !type">Es una persona física</h6>
          <input v-if="editing" type="checkbox" v-model="type" /><span v-if="editing">Es una persona jurídica</span>
        </div>
      </div>
      <div class="row">

        <!-- Left column -->
        <div class="col-sm-6 col-xs-12">
          <div class="col-xs-12">
            <div class="form-group">
              <one-to-one v-if="editing" name="Posición fiscal" display="name" :options="fiscalpositions" v-model="invoice_ar_contact.invoice_contact.fiscal_position"></one-to-one>
              <p v-if="!editing">{{ invoice_ar_contact.invoice_contact.fiscal_position.name }}</p>
            </div>
          </div>
        </div>

        <!-- Right column -->
        <div class="col-sm-6 col-xs-12">
          <div class="col-xs-5">
            <div v-if="editing" class="form-group">
              <one-to-one name="Identificación" display="name" :options="idtypes" v-model="invoice_ar_contact.id_type"></one-to-one>
            </div>
            <p v-if="!editing">{{ invoice_ar_contact.id_type.name }}</p>
          </div>

          <div class="col-xs-7">
            <div v-if="editing" class="form-group">
              <label>&nbsp;</label>
              <input class="form-control" type="text" name="name" v-model="invoice_ar_contact.id_number"/>
            </div>
            <p v-if="!editing">{{ invoice_ar_contact.id_number }}</p>
          </div>
        </div>

        <!-- Left column -->
        <div class="col-sm-6 col-xs-12">
          <home-address :editing="editing" :value="invoice_ar_contact.invoice_contact.fiscal_address"></home-address>
          <locality :editing="editing" v-model="invoice_ar_contact.invoice_contact.fiscal_address.locality"></locality>
        </div>

        <!-- Right column -->
        <div class="col-sm-6 col-xs-12">
          <div class="col-xs-12">
            <div class="form-group">
              <label for="fiscal_phone">Teléfonos</label>
              <p v-if="!editing">{{ invoice_ar_contact.invoice_contact.contact_contact.phone_numbers | default('-')}}</p>
              <input id="addr" v-if="editing" class="form-control" type="text" name="address" v-model="invoice_ar_contact.invoice_contact.contact_contact.phone_numbers"/>
            </div>
          </div>
          <div class="col-xs-12">
            <div class="form-group">
              <label for="fiscal_phone">Direcciones de correo</label>
              <p v-if="!editing">{{invoice_ar_contact.invoice_contact.contact_contact.extra_emails | default('-')}}</p>
              <input id="addr" v-if="editing" class="form-control" type="text" name="address" v-model="invoice_ar_contact.invoice_contact.contact_contact.extra_emails"/>
            </div>
          </div>
        </div>

      </div>
    </div>
    </form>
  </div>
</template>

<script>
import auth from '../../auth/index.js'
import { addContact, editContact, getContacts, getFiscalPositions } from '../../vuex/actions'

export default {
  name: 'ContactView',
  data () {
    return {
      bb_buttons: [{text: 'Editar', method: 'edit', condition: function () { return !this.editing }.bind(this)},
                   {text: 'Guardar', method: 'save', condition: function () { return this.editing }.bind(this)},
                   {text: 'Descartar', method: 'discard', condition: function () { return this.editing }.bind(this), class: 'btn-link'}],
      bb_crumbs: ['Contactos'],
      idtypes: [{id: 'D', name: 'DNI'}, {id: 'T', name: 'CUIT'}, {id: 'L', name: 'CUIL'}],
      editing: false,
      invoice_ar_contact: {}
    }
  },

  computed: {
    type () {
      return this.invoice_ar_contact.invoice_contact.contact_contact.contact_type === 'C'
    },
    contact () {
      return this.contacts.find(contact => contact.id === parseInt(this.$route.params.contactId))
    }
  },

  methods: {
    edit () {
      this.editing = true
    },
    discard () {
      var r = window.confirm('Desea descartar los datos ingresados?')

      if (r) {
        if (this.$route.params.contactId !== 'new') {
          this.editing = false
          this.$router.push(this.$route.path)
        } else {
          this.$router.push('/contacts/')
        }
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
          this.$router.push('/contacts/' + response.data.id + '/')
        })
      } else {
        this.editContact(invoice).then(response => {
          this.$router.push('/contacts')
        })
      }
    },
    updateAddress (address) {
      this.invoice_ar_contact.invoice_contact.fiscal_address = address
    }
  },

  created () {
    var vm = this

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

    let contactLoaded = this.getContacts().then(function (response) {
      if (vm.$route.params.contactId === 'new') {
        vm.editing = true
        vm.bb_crumbs.push('Crear nuevo contacto')
      } else {
        vm.invoice_ar_contact = JSON.parse(JSON.stringify(vm.contact))
        vm.invoice_ar_contact.id_type = vm.idtypes.find(t => t.id === vm.invoice_ar_contact.id_type)
        vm.bb_crumbs.push(vm.invoice_ar_contact.invoice_contact.contact_contact.name)
      }
    })

    let fiscalPositionsLoaded = this.getFiscalPositions()

    contactLoaded.then(function () {
      vm.$http.get(vm.invoice_ar_contact.invoice_contact.fiscal_address.locality).then(function (response) {
        vm.invoice_ar_contact.invoice_contact.fiscal_address.locality = response.data
      })
    })

    Promise.all([contactLoaded, fiscalPositionsLoaded]).then(function () {
      vm.invoice_ar_contact.invoice_contact.fiscal_position =
        vm.fiscalpositions.find(fp => fp.url === vm.invoice_ar_contact.invoice_contact.fiscal_position)
    })
  },

  vuex: {
    getters: {
      contacts: state => state.contacts.all,
      fiscalpositions: state => state.accounting.fiscalPositions.all
    },
    actions: {
      addContact,
      editContact,
      getContacts,
      getFiscalPositions
    }
  },

  route: {
    canReuse: false
  }
}
</script>
