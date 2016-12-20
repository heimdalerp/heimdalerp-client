<template>
  <div>
    <button-bar :crumbs="bb_crumbs" :buttons="bb_buttons"></button-bar>
    <div class="jumbotron container">
      <div id="workflow" style="text-align: right; margin: -20px -60px 20px -60px; padding-right: 20px; min-height: 50px; background-color: lightgray; font-size: 1.5em">
        <span ><span class="workflow_current" style="font-weight: bold">{{ invoice.status }}</span>
      </div>

      <div class="col-xs-12">
        <div id="form-group">
          <label>Fecha</label>
          <p v-show="!editing">{{ invoice.invoice_date }}</p>
          <div v-else class="input-group">
            <input type="text" class="calendar form-control" v-model="invoice.invoice_date" :disabled="!editing">
            <div class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></div>
          </div>
        </div>
      </div>

      <div class="col-xs-6">
        <div id="form-group">
          <label>Factura</label>
          <p>{{ invoice.related_invoice.invoice_type.name }}
             {{ (`0000${invoice.related_invoice.point_of_sale_ar.afip_id}`).slice(-4) }}-{{ (`00000000${invoice.related_invoice.number}`).slice(-8) }}</p>
          <label>Fecha</label>
          <p>{{ invoice.related_invoice.invoice_date }}</p>
        </div>
      </div>
      <div class="col-xs-6">
        <div id="form-group">
          <label>Contacto</label>
          <p>{{ invoice.related_invoice.invoicear_contact.invoice_contact.legal_name }}</p>
          <p>CUIT {{ invoice.related_invoice.invoicear_contact.id_number }}</p>
        </div>
      </div>

      <div class="col-xs-12">
        <div class="col-xs-6">
          <div id="form-group">
            <label>Comprobantes asociados</label>
            <p v-for="asociado in invoice.related_invoices"></p>
            <p v-if="invoice.related_invoices.length === 0"> - </p>
          </div>
        </div>
        <div class="col-xs-6">
          <label>Balance</label>
        </div>
      </div>

      <div class="col-sm-12 col-xs-12">
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
                <input id="line-{{$index}}" type="text" class="form-control" :disabled="line._deleted || !editing" />
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
              <td><p>{{ line.vat }}%</p></td>
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
      </div>

      <div class="col-xs-8">
      </div>
      <div class="col-xs-4">
        <div class="col-xs-12">
          <div class="col-xs-4">
            <label>Neto:</label>
          </div>
          <div class="col-xs-8">
            <span v-if="editing">${{ net }}</span>
            <span v-else>${{ invoice.subtotal }}</span>
          </div>
        </div>
        <div class="col-xs-12">
          <div class="col-xs-4">
            <label>Impuestos:</label>
          </div>
          <div class="col-xs-8">
            <span v-if="editing">${{ tax }}</span>
            <span v-else>${{ invoice.vat_total }}</span>
          </div>
        </div>
        <div class="col-xs-12">
          <div class="col-xs-4">
            <label>Total:</label>
          </div>
          <div class="col-xs-8">
            <span v-if="editing">${{ total }}</span>
            <span v-else>${{ invoice.total }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import ButtonBar from '../../utils/components/ButtonBar.vue'
import Vue from 'vue'
import { addInvoice, getInvoices, getInvoiceTypes, getProducts } from '../../vuex/actions'

export default {
  components: {
    ButtonBar
  },
  computed: {
    net () {
      var sum = 0
      for (let line of this.invoice_lines) {
        sum += line.price_sold * line.quantity * (100 - line.discount) / 100
      }
      return parseFloat(sum.toFixed(2))
    },
    tax () {
      var sum = 0
      for (let line of this.invoice_lines) {
        sum += (line.price_sold * line.quantity * (100 - line.discount) / 100) * line.vat / 100
      }
      return sum.toFixed(2)
    },
    total () {
      return (parseFloat(this.net) + parseFloat(this.tax)).toFixed(2)
    }
  },
  data () {
    return {
      bb_crumbs: ['Contabilidad', 'Notas de Crédito', 'Ingresar'],
      bb_buttons: [{text: 'Editar', method: 'edit', condition: function () { return this.can_edit() }.bind(this)},
                   {text: 'Autorizar', method: 'authorize', condition: function () { return this.can_authorize() }.bind(this)},
                   {text: 'Cancelar', method: 'cancel', condition: function () { return this.can_cancel() }.bind(this)},
                   {text: 'Guardar', method: 'save', condition: function () { return this.editing }.bind(this)},
                   {text: 'Descartar', method: 'discard', condition: function () { return this.editing }.bind(this), class: 'btn-link'}
                    ],
      invoice: {},
      invoice_lines: [],
      related_invoices: {},
      productPromise: null,
      productEngine: null,
      p1: null,
      p2: null,
      p3: null,
      p4: null,
      p5: null,
      editing: true,
      pointofsale: null
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
    authorize () {
      this.$http.patch(`${this.invoice.url}accept/`)
    },
    edit () {
      this.editing = true
    },
    discard () {
      this.$router.go('/accounting/credits/')
    },
    save () {
      var vm = this
      let invoice = {
        invoicear_contact: this.invoice.related_invoice.invoicear_contact.url,
        number: 0,
        invoice_type: (function () {
          switch (vm.invoice.related_invoice.invoice_type.id) {
            case 1:
              return vm.invoiceTypes.find((it) => it.id === 3).url
          }
        })(),
        invoice_date: this.invoice.invoice_date,
        notes: '',
        point_of_sale_ar: this.invoice.related_invoice.point_of_sale_ar.url,
        due_date: this.invoice.invoice_date,
        concept_type: this.invoice.related_invoice.concept_type.url,
        related_invoice: this.invoice.related_invoice.url
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
      console.log(invoice)

      this.addInvoice(invoice).then(function () {
        this.editing = false
      })
    },
    getProduct (product) {
      return this.products.find(p => p.url === product.url)
    },
    addItem () {
      this.invoice_lines.push({
        _new: true,
        product: null,
        description: '',
        price_sold: '',
        discount: '',
        quantity: '',
        vat: 0
      })
      var vm = this
      Vue.nextTick(function () {
        vm.initProducts()
      })
    },
    removeItem (item) {
      Vue.set(item, '_deleted', true)
    },
    undoRemove (item) {
      Vue.set(item, '_deleted', false)
    },
    initProducts () {
      let vm = this
      let elt

      if (this.productEngine === null) {
        let products = vm.products.map(function (product) {
          var map = {}
          map['url'] = product.url
          map['name'] = product.name
          return map
        })

        this.productEngine = new window.Bloodhound({
          datumTokenizer: window.Bloodhound.tokenizers.obj.whitespace('name'),
          queryTokenizer: window.Bloodhound.tokenizers.whitespace,
          local: products
        })
        this.productEngine.initialize()
      }

      elt = window.jQuery('[id^=line]')
      elt.tagsinput({
        maxTags: 1,
        itemValue: 'url',
        itemText: 'name',
        typeaheadjs: {
          name: 'engine',
          displayKey: 'name',
          source: this.productEngine.ttAdapter()
        }
      })
      elt.on('itemAdded', function (event) {
        var line = event.currentTarget.id.split('-')[1]
        let product = vm.getProduct(event.item)
        vm.invoice_lines[line].price_sold = product.current_price
        vm.invoice_lines[line].vat = product.vat.tax * 100
      })
    }
  },

  created () {
    var vm = this

    this.invoice = {
      related_invoice: {
        invoicear_contact: {
          invoice_contact: {}
        },
        invoice_type: {},
        point_of_sale_ar: {}
      },
      related_invoices: []
    }

    this.p1 = this.getInvoices()
    this.p1.then(function () {
      // Fetch the parent invoiceId
      vm.invoice.related_invoice = vm.invoices.find(function (i) {
        return i.id === parseInt(vm.$route.query.invoice)
      })
      // And then this invoice, if it exists
      if (vm.$route.params.invoiceId !== 'new') {
        vm.editing = false
        vm.invoice = Object.assign({}, vm.invoices.find(function (i) {
          return i.id === parseInt(vm.$route.params.invoiceId)
        }))
      }
      console.log(vm.invoice)

      // Load the related invoices
      vm.$http.get(`${vm.invoice.related_invoice.url}relatedinvoices/`).then(function (response) {
        vm.related_invoices = response.data
      })
    })
    this.p3 = this.getInvoiceTypes()
    this.p4 = this.getProducts()
  },
  ready () {
    var vm = this

    Promise.all([this.p1, this.p3, this.p4]).then(function () {
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
        },
        'startDate': (function () {
          let today = new Date()
          return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
        })()
      })

      // Init the product inputs
      vm.initProducts()
    })
  },
  vuex: {
    getters: {
      invoices: state => state.accounting.invoices.all,
      invoiceTypes: state => state.accounting.invoiceTypes.all,
      products: state => state.accounting.products.all
    },
    actions: {
      getInvoices,
      addInvoice,
      getInvoiceTypes,
      getProducts
    }
  }
}
</script>
<style scoped>
.glyphicon-trash {
  color: red
}
</style>
