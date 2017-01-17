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
              <one-to-one v-if="editing" :name="otofiscal.name" :options="otofiscal.options" :model.sync="invoice_ar_contact.invoice_contact.fiscal_position"></one-to-one>
              <p v-if="!editing">{{ pf(invoice_ar_contact.invoice_contact.fiscal_position) }}</p>
            </div>
          </div>
        </div>

        <!-- Right column -->
        <div class="col-sm-6 col-xs-12">
          <div class="col-xs-5">
            <div v-if="editing" class="form-group">
              <one-to-one :name="otoidtype.name" :options="otoidtype.options" :model.sync="invoice_ar_contact.id_type"></one-to-one>
            </div>
            <p v-if="!editing">{{ df(invoice_ar_contact.id_type) }}</p>
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
          <address :editing="editing" v-on:update="updateAddress" :value="invoice_ar_contact.invoice_contact.fiscal_address"></address>
          <locality :editing="editing" v-on:update="updateLocality" :url="invoice_ar_contact.invoice_contact.fiscal_address.locality"></locality>
        </div>

        <!-- Right column -->
        <div class="col-sm-6 col-xs-12">
          <div class="col-xs-12">
            <div class="form-group">
              <label for="fiscal_phone">Teléfonos</label>
              <p v-if="!editing">{{ invoice_ar_contact.invoice_contact.contact_contact.phone_numbers | default '-'}}</p>
              <input id="addr" v-if="editing" class="form-control" type="text" name="address" v-model="invoice_ar_contact.invoice_contact.contact_contact.phone_numbers"/>
            </div>
          </div>
          <div class="col-xs-12">
            <div class="form-group">
              <label for="fiscal_phone">Direcciones de correo</label>
              <p v-if="!editing">{{invoice_ar_contact.invoice_contact.contact_contact.extra_emails | default '-'}}</p>
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
  data () {
    return {
      bb_buttons: [{text: 'Editar', method: 'edit', condition: function () { return !this.editing }.bind(this)},
                   {text: 'Guardar', method: 'save', condition: function () { return this.editing }.bind(this)},
                   {text: 'Descartar', method: 'discard', condition: function () { return this.editing }.bind(this), class: 'btn-link'}],
      bb_crumbs: ['Contactos'],
      otofiscal: {name: 'Posición fiscal', options: []},
      otoidtype: {name: 'Identificación', options: [{id: 'D', name: 'DNI'}, {id: 'T', name: 'CUIT'}, {id: 'L', name: 'CUIL'}]},
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
    pf (val) {
      if (val === null) {
        return 'ERR'
      }

      val = parseInt(val.substring(val.length - 2, val.length - 1))

      if (val === 2) {
        return 'IVA Responsable Inscripto'
      } else if (val === 1) {
        return 'IVA Exento'
      } else if (val === 3) {
        return 'Consumidor Final'
      }

      return 'ERR'
    },
    df (val) {
      if (val === null) {
        return '---'
      }

      if (val === 'D') {
        return 'DNI'
      } else if (val === 'T') {
        return 'CUIT'
      } else if (val === 'L') {
        return 'CUIL'
      }

      return 'ERR'
    },
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

      this.invoice_ar_contact.invoice_contact.legal_name =
        this.invoice_ar_contact.invoice_contact.contact_contact.name
      this.invoice_ar_contact.invoice_contact.contact_contact.home_address =
        this.invoice_ar_contact.invoice_contact.fiscal_address

      if (this.$route.params.contactId === 'new') {
        this.addContact(this, this.invoice_ar_contact).then(response => {
          this.$router.push('/contacts/' + response.data.id + '/')
        })
      } else {
        this.editContact(this.invoice_ar_contact).then(response => {
          this.$router.push('/contacts')
        })
      }
    },
    updateAddress (address) {
      this.invoice_ar_contact.invoice_contact.fiscal_address = address
    },
    updateLocality (url) {
      this.invoice_ar_contact.invoice_contact.fiscal_address.locality = url
    }
  },

  created () {
    var vm = this

    this.invoice_ar_contact = {
      invoice_contact: {
        fiscal_position: null,
        fiscal_address: {
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

    this.getContacts().then(function (response) {
      if (vm.$route.params.contactId === 'new') {
        vm.editing = true
        vm.bb_crumbs.push('Crear nuevo contacto')
      } else {
        vm.invoice_ar_contact = JSON.parse(JSON.stringify(vm.contact))
        vm.bb_crumbs.push(vm.invoice_ar_contact.invoice_contact.contact_contact.name)
      }
    })

    this.getFiscalPositions().then(function (response) {
      vm.otofiscal.options.push(...vm.fiscalpositions)
    })
  },

  vuex: {
    getters: {
      contacts: state => state.contacts.all,
      fiscalpositions: state => state.accounting.fiscalPositions.all
        .map(function (c) { return { id: c.url, name: c.name } })
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
