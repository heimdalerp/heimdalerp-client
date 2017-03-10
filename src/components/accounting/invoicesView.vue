<template>
  <div>
    <button-bar :crumbs="bb_crumbs" :buttons="bb_buttons"></button-bar>
    <div class="jumbotron container">
      <div class="row">
        <div id="workflow" style="text-align: right; min-height: 50px; background-color: lightgray; font-size: 1.5em">
          <span class="workflow_current" style="font-weight: bold">{{ invoice.status }}</span>
        </div>
      </div>

      <div class="row">
        <div class="col-xs-6">
          <div class="form-group">
            <label>Punto de venta</label>
            <p v-if="!editing">{{ `000${invoice.point_of_sale_ar.afip_id}`.slice(-4) + ` - ${invoice.point_of_sale_ar.fantasy_name}`}}</p>
            <select v-else class="form-control" v-model="pointofsale">
              <option v-for="pos in pointsofsale" :value="pos">{{ pos.fantasy_name }}</option>
            </select>
          </div>
        </div>
        <div class="col-xs-6">
          <div class="form-group" v-if="this.pointofsale.point_of_sale_type !== 'W'">
            <label>Número</label>
            <p v-show="!editing">{{ ('00000000' + invoice.number).slice(-8) }}</p>
            <input v-show="editing" class="form-control" value="00000000">
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-xs-12 col-sm-6">
          <div class="form-group">
            <label>Contacto</label>
            <p v-if="!editing">{{ invoice.invoicear_contact.invoice_contact.legal_name }}</p>
            <div class="input-group">
              <select class="form-control" v-model="invoice.invoicear_contact">
                <option v-for="contact in contacts" :value="contact">{{ contact.invoice_contact.legal_name }}</option>
              </select>
              <div class="input-group-addon">
                <span class="glyphicon glyphicon-search" @click="openContactListQuick"></span>
              </div>
              <div class="input-group-addon">
                <span class="glyphicon glyphicon-plus" @click="openContactViewQuick"></span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xs-12 col-sm-6">
          <div class="form-group">
            <label>Fecha</label>
            <p v-if="!editing">{{ invoice.invoice_date }}</p>
            <div v-else class="input-group">
              <input type="text" class="calendar form-control" v-model="invoice.invoice_date" :disabled="!editing">
              <div class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-xs-12 col-sm-6">
          <div class="form-group">
            <label>Tipo</label>
            <p v-if="!editing">{{ invoice.invoice_type.name }}</p>
            <select v-else class="form-control" v-model="invoice.invoice_type">
              <option v-for="InvoiceType in invoiceTypes" :value="InvoiceType.url">{{ InvoiceType.name }}</option>
            </select>
          </div>
        </div>

        <div class="col-xs-12 col-sm-6">
          <div class="form-group">
            <label>Concepto</label>
            <p v-if="!editing">{{ invoice.concept_type.name }}</p>
            <select v-else class="form-control" v-model="invoice.concept_type">
              <option v-bind:value="1">Productos</option>
              <option v-bind:value="2">Servicios</option>
              <option v-bind:value="3">Productos y servicios</option>
            </select>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-xs-12 col-sm-6">
          <div v-show="invoice.concept_type > 1" class="form-group">
            <label>Desde</label>
            <p v-if="!editing">{{ invoice.service_start }}</p>
            <div class="input-group" v-else>
              <input type="text" class="calendar form-control" v-model="invoice.service_start">
              <div class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></div>
            </div>
          </div>
        </div>

        <div class="col-xs-12 col-sm-6">
          <div v-show="invoice.concept_type > 1" class="form-group">
            <label>Hasta</label>
            <div class="input-group">
              <input type="text" class="calendar form-control" v-model="invoice.service_end">
              <div class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></div>
            </div>
          </div>
        </div>
      </div>


      <table class="table table-striped table-condensed">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Descripcion</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Descuento</th>
            <th>IVA</th>
            <th></th>
          </tr>
        </thead>
        <tfoot v-if="editing">
          <tr colspan="6">
            <td @click="addItem"><span class="glyphicon glyphicon-plus"></span> Agregar item</td>
          </tr>
        </tfoot>
        <tbody v-if="editing">
          <tr v-for="line in invoice_lines">
            <td>
              <div class="input-group">
                <select class="form-control" v-model="line.product" @change="updateProduct(line)">
                  <option v-for="product in products" :value="product">{{ product.name }}</option>
                </select>
                <div class="input-group-addon">
                  <span class="glyphicon glyphicon-search"></span>
                </div>
                <div class="input-group-addon" @click="openProductViewQuick(line)">
                  <span class="glyphicon glyphicon-plus"></span>
                </div>
              </div>
            </td>
            <td><textarea rows="1" v-model="line.description" class="form-control" :disabled="line._deleted || !editing"></textarea></td>
            <td><input size="3"  type="text" v-model="line.quantity" class="form-control" :disabled="line._deleted || !editing"></td>
            <td>
              <div class="input-group">
                <div class="input-group-addon">$</div>
                <input size="3" type="text" v-model="line.price_sold" class="form-control" :disabled="line._deleted || !editing">
              </div>
            </td>
            <td>
              <div class="input-group">
                <input size="3" type="text" v-model="line.discount" class="form-control" :disabled="line._deleted || !editing">
                <div class="input-group-addon">%</div>
              </div>
            </td>
            <td>
              <p>{{ line.product.vat.tax * 100 }}%</p>
            </td>
            <td>
              <span v-if="!line._deleted" class="glyphicon glyphicon-trash" @click="removeItem(line)"></span>
              <span v-else class="glyphicon glyphicon-backward" @click="undoRemove(line)"></span>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-for="line in invoice.invoice_lines">
            <td>{{ line.product.name }}</td>
            <td>{{ line.description | default }}</td>
            <td>{{ line.quantity }}</td>
            <td>${{ line.price_sold }}</td>
            <td>{{ line.discount }}</td>
            <td>{{ line.product.vat.name }}
          </tr>
        </tbody>
      </table>

      <div class="row">
        <div class="col-xs-6 col-xs-offset-6">
          <div class="row">
            <div class="col-xs-4">
              <label>Neto:</label>
            </div>
            <div class="col-xs-1">
              $
            </div>
            <div class="col-xs-5 amount">
              <span v-if="editing">{{ net }}</span>
              <span v-else>{{ invoice.subtotal }}</span>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-4">
              <label>Impuestos:</label>
            </div>
            <div class="col-xs-1">
              $
            </div>
            <div class="col-xs-5 amount">
              <span v-if="editing">{{ tax }}</span>
              <span v-else>{{ invoice.vat_total }}</span>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-4">
              <label>Total:</label>
            </div>
            <div class="col-xs-1">
              $
            </div>
            <div class="col-xs-5 amount">
              <span v-if="editing">{{ total }}</span>
              <span v-else>{{ invoice.total }}</span>
            </div>
          </div>
        </div>
      </div>

      <contact-view-quick ref="contactViewQuick" v-model="contactCreated"></contact-view-quick>
      <product-view-quick ref="productViewQuick" v-model="productCreated"></product-view-quick>
    </div>
  </div>
</template>
<script>
import contactViewQuick from '../contacts/viewQuick'
import productViewQuick from '../inventory/productViewQuick'

import Vue from 'vue'
import { addInvoice, getInvoices, getInvoiceTypes, getContacts, getProducts, getPOSs } from '../../vuex/actions'

export default {
  components: {
    contactViewQuick,
    productViewQuick
  },

  computed: {
    net () {
      var sum = 0
      for (let line of this.invoice_lines) {
        sum += line.price_sold * line.quantity * (100 - line.discount) / 100
      }
      return sum.toFixed(2)
    },

    tax () {
      var sum = 0
      for (let line of this.invoice_lines) {
        sum += (line.price_sold * line.quantity * (100 - line.discount) / 100) * line.product.vat.tax
      }
      return sum.toFixed(2)
    },

    total () {
      return (parseFloat(this.net) + parseFloat(this.tax)).toFixed(2)
    }
  },

  data () {
    return {
      bb_crumbs: ['Contabilidad', 'Facturas', 'Ingresar'],
      bb_buttons: [{text: 'Editar', method: 'edit', condition: function () { return this.can_edit() }.bind(this)},
                   {text: 'Autorizar', method: 'authorize', condition: function () { return this.can_authorize() }.bind(this)},
                   {text: 'Cancelar', method: 'cancel', condition: function () { return this.can_cancel() }.bind(this)},
                   {text: 'Guardar', method: 'save', condition: function () { return this.editing }.bind(this)},
                   {text: 'Descartar', method: 'discard', condition: function () { return this.editing }.bind(this), class: 'btn-link'},
                   {text: 'Generar Crédito', method: 'credit', condition: function () { return this.can_credit() }.bind(this)},
                   {text: 'Generar Débito', method: 'debit', condition: function () { return this.can_debit() }.bind(this)}],
      invoice: {},
      invoice_lines: [],
      productPromise: null,
      productEngine: null,
      editing: true,
      pointofsale: {},
      contactCreated: null,
      productCreated: null,
      lineToPlaceNewProduct: null
    }
  },
  methods: {
    can_authorize () {
      return !this.editing && this.invoice.status === 'D'
    },

    can_edit () {
      return !this.editing && this.invoice.status === 'D'
    },

    can_cancel () {
      return !this.editing && this.invoice.status === 'A'
    },

    can_credit () {
      return this.invoice.status === 'T'
    },

    can_debit () {
      return this.can_credit()
    },

    authorize () {
      this.$http.patch(`${this.invoice.url}accept/`)
    },

    edit () {
      this.pointofsale = this.invoice.point_of_sale_ar.url
      this.invoice.invoice_type = this.invoice.invoice_type.url
      this.invoice.concept_type = this.invoice.concept_type.id
      this.editing = true
    },

    discard () {
      this.$router.push('/accounting/invoices/')
    },

    credit () {
      this.$router.push(`/accounting/credits/new?invoice=${this.$route.params.invoiceId}`)
    },

    debit () {
      this.$router.push(`/accounting/debits/new?invoice=${this.$route.params.invoiceId}`)
    },

    save () {
      let invoice = {
        invoicear_contact: window.jQuery('#contactInput').val(),
        number: 0,
        invoice_type: this.invoice.invoice_type,
        invoice_date: this.invoice.invoice_date,
        notes: '',
        point_of_sale_ar: this.pointofsale,
        due_date: this.invoice.invoice_date,
        concept_type: `http://localhost:8000/api/invoice_ar/concepttypes/${this.invoice.concept_type}/`
      }
      invoice.invoice_lines = this.invoice_lines

      invoice.invoice_lines.forEach(function (line, id) {
        delete line._new
        delete line._deleted
        if (!line.discount) {
          line.discount = 0
        }
        line.product = window.jQuery(`#line-${id}`).val()
      })

      if (this.$route.params.invoiceId === 'new') {
        this.addInvoice(invoice).then(function (response) {
          this.$router.push(`/accounting/invoices/${response.data.id}/`)
        })
      }
    },

    addItem () {
      this.invoice_lines.push({
        _new: true,
        product: { vat: { tax: 0 } },
        description: '',
        price_sold: '',
        discount: '',
        quantity: ''
      })
    },

    removeItem (item) {
      Vue.set(item, '_deleted', true)
    },

    undoRemove (item) {
      Vue.set(item, '_deleted', false)
    },

    openContactViewQuick () {
      this.$refs.contactViewQuick.open()
    },

    openContactListQuick () {
      console.log('stub')
    },

    openProductViewQuick (lineToPlaceNewProduct) {
      this.lineToPlaceNewProduct = lineToPlaceNewProduct
      this.$refs.productViewQuick.open()
    },

    updateProduct (line) {
      line.price_sold = line.product.current_price
    }
  },

  created () {
    var vm = this

    this.invoice = {
      invoicear_contact: {
        invoice_contact: {}
      },
      concept_type: {},
      invoice_type: {},
      point_of_sale_ar: {},
      invoice_date: (function () {
        let today = new Date()
        return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
      })(),
      due_date: (function () {
        let today = new Date()
        return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
      })()
    }

    this.getInvoices().then(function () {
      if (vm.$route.params.invoiceId !== 'new') {
        vm.editing = false

        vm.invoice = JSON.parse(JSON.stringify(vm.invoices.find(function (i) {
          return i.id === parseInt(vm.$route.params.invoiceId)
        })))
      }
    })
    this.getInvoiceTypes()
    this.getContacts()
    this.getProducts()
    this.getPOSs()
  },

  mounted () {
    // Init the calendar
    window.jQuery('.daterangepicker').remove()
    window.jQuery('.calendar').daterangepicker({
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
      }
    })
  },

  watch: {
    contactCreated (newContact) {
      this.invoice.invoicear_contact = newContact
    },

    productCreated (newProduct) {
      this.lineToPlaceNewProduct.product = newProduct
      this.updateProduct(this.lineToPlaceNewProduct)
    }
  },

  vuex: {
    getters: {
      invoices: state => state.accounting.invoices.all,
      invoiceTypes: state => state.accounting.invoiceTypes.all,
      contacts: state => state.contacts.all,
      products: state => state.accounting.products.all,
      pointsofsale: state => state.accounting.pos.all
    },
    actions: {
      getInvoices,
      addInvoice,
      getContacts,
      getInvoiceTypes,
      getProducts,
      getPOSs
    }
  }
}
</script>
<style scoped>
.glyphicon-trash {
  color: red
}

.amount {
  text-align: right;
}
</style>
