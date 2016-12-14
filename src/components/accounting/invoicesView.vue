<template>
  <div>
    <button-bar :crumbs="bb_crumbs" :buttons="bb_buttons"></button-bar>
    <div class="jumbotron container">
      <div id="workflow" style="text-align: right; margin: -20px -60px 20px -60px; padding-right: 20px; min-height: 50px; background-color: lightgray; font-size: 1.5em">
        <span ><span class="workflow_current" style="font-weight: bold">{{ invoice.status }}</span>
      </div>

      <div class="col-sm-6 col-xs-12">
        <div class="form-group">
          <label>Punto de venta</label>
          <p v-show="!editing">{{ `000${invoice.point_of_sale_ar.afip_id}`.slice(-4) + ` - ${invoice.point_of_sale_ar.fantasy_name}`}}</p>
          <select v-else class="form-control" v-model="pointofsale">
            <option v-for="pos in pointsofsale" :value="pos.url">{{ pos.fantasy_name }}</option>
          </select>
        </div>
        <div class="form-group" style="max-height: 59px">
          <label>Contacto</label>
          <p v-show="!editing">{{ invoice.invoicear_contact.invoice_contact.legal_name }}</p>
          <span v-else><input id="contactInput" type="text" class="form-control"></span>
        </div>
        <div class="form-group">
          <label>Tipo</label>
          <p v-show="!editing">{{ invoice.invoice_type.name }}</p>
          <select v-else class="form-control" v-model="invoice.invoice_type">
            <option v-for="InvoiceType in invoiceTypes" value="{{ InvoiceType.url }}">{{ InvoiceType.name }}</option>
          </select>
        </div>
        <div v-show="invoice.concept_type > 1" class="form-group">
          <label>Desde</label>
          <p v-show="!editing">{{ invoice.service_start }}</p>
          <div class="input-group" v-else>
            <input type="text" class="calendar form-control" v-model="invoice.service_start">
            <div class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></div>
          </div>
        </div>
      </div>

      <div class="col-sm-6 col-xs-12">
        <div class="form-group" v-if="this.selectedPos.point_of_sale_type !== 'W'">
          <label>Número</label>
          <p v-show="!editing">00000000</p>
          <input v-show="editing" class="form-control" value="00000000">
        </div>
        <div class="form-group">
          <label>Fecha</label>
          <p v-show="!editing">{{ invoice.invoice_date }}</p>
          <div v-else class="input-group">
            <input type="text" class="calendar form-control" v-model="invoice.invoice_date" :disabled="!editing">
            <div class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></div>
          </div>
        </div>
        <div class="form-group">
          <label>Concepto</label>
          <p v-show="!editing">{{ invoice.concept_type.name }}</p>
          <select v-else class="form-control" v-model="invoice.concept_type">
            <option v-bind:value="1">Productos</option>
            <option v-bind:value="2">Servicios</option>
            <option v-bind:value="3">Productos y servicios</option>
          </select>
        </div>
        <div v-show="invoice.concept_type > 1" class="form-group">
          <label>Hasta</label>
          <div class="input-group">
            <input type="text" class="calendar form-control" v-model="invoice.service_end">
            <div class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></div>
          </div>
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
import { addInvoice, getInvoices, getInvoiceTypes, getContacts, getProducts, getPOSs } from '../../vuex/actions'

export default {
  components: {
    ButtonBar
  },
  computed: {
    selectedPos () {
      if (this.pointsofsale) {
        return this.pointsofsale.find(p => p.url === this.pointofsale) || {}
      }
    },
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
      bb_crumbs: ['Contabilidad', 'Facturas', 'Ingresar'],
      bb_buttons: [{text: 'Editar', method: 'edit', condition: function () { return this.can_edit() }.bind(this)},
                   {text: 'Autorizar', method: 'authorize', condition: function () { return this.can_authorize() }.bind(this)},
                   {text: 'Cancelar', method: 'cancel', condition: function () { return this.can_cancel() }.bind(this)},
                   {text: 'Guardar', method: 'save', condition: function () { return this.editing }.bind(this)},
                   {text: 'Descartar', method: 'discard', condition: function () { return this.editing }.bind(this), class: 'btn-link'},
                   {text: 'Generar Crédito', method: 'credit', condition: function () { return true }},
                   {text: 'Generar Débito', method: 'debit', condition: function () { return true }}
                    ],
      invoice: {},
      // invoicelines: [{product: '', description: '', price_sold: 3.50, discount: 0, quantity: 3, vat: 21},
      //                {product: '', description: 'Gluten free', price_sold: 7, discount: 0, quantity: 1, vat: 10.5, _deleted: true}],
      invoice_lines: [],
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
      console.log(!this.editing && this.invoice.status === 'D')
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
      window.alert('no')
    },
    edit () {
      this.editing = true
    },
    discard () {
      this.$router.go('/accounting/invoices/')
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
      invoicear_contact: {
        invoice_contact: {}
      },
      concept_type: {},
      invoice_type: {},
      point_of_sale_ar: {}
    }

    this.p1 = this.getInvoices()
    this.p1.then(function () {
      if (vm.$route.params.invoiceId !== 'new') {
        vm.editing = false
        vm.invoice = Object.assign({}, vm.invoices.find(function (i) {
          console.log(i)
          return i.id === parseInt(vm.$route.params.invoiceId)
        }))
      }
    })
    this.p2 = this.getInvoiceTypes()
    this.p3 = this.getContacts()
    this.p4 = this.getProducts()
    this.p5 = this.getPOSs()
  },
  /*
  ready () {
    var vm = this

    Promise.all([this.p1, this.p2, this.p3, this.p4, this.p5]).then(function () {
      // Init the contact input
      var bhContacts = vm.contacts.map(function (contact) {
        var map = {}
        map['url'] = contact.url
        map['name'] = contact.invoice_contact.legal_name
        return map
      })

      var engine = new window.Bloodhound({
        datumTokenizer: window.Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: window.Bloodhound.tokenizers.whitespace,
        local: bhContacts
      })
      engine.initialize()

      var elt = window.jQuery('#contactInput')
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
  */
  vuex: {
    getters: {
      invoices: state => state.accounting.invoices.all,
      invoiceTypes: state => state.accounting.invoiceTypes.all, // .filter(it => it.invoice_type_class === 'B'),
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
</style>
