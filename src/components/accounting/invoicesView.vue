<template>
  <div>
    <button-bar :crumbs="bb_crumbs" :buttons="bb_buttons"></button-bar>
    <div class="jumbotron container">
      <div id="workflow" style="text-align: right; margin: -20px -60px 20px -60px; padding-right: 20px; min-height: 50px; background-color: lightgray; font-size: 1.5em">
        <span ><span class="workflow_current" style="font-weight: bold">Draft</span> > Authorized</span>
      </div>
      <div class="col-sm-6 col-xs-12">
        <div class="form-group" style="max-height: 59px">
          <label>Cliente</label>
          <input id="contactInput" type="text" class="form-control">
        </div>
        <div class="form-group">
          <label>Tipo</label>
          <select class="form-control" v-model="invoice.invoice_type">
            <option v-for="InvoiceType in invoiceTypes" value="{{ InvoiceType.url }}">{{ InvoiceType.name }}</option>
          </select>
        </div>
        <div v-show="invoice.concept_type > 1" class="form-group">
          <label>Desde</label>
          <div class="input-group">
            <input type="text" class="calendar form-control" v-model="invoice.service_start">
            <div class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></div>
          </div>
        </div>
      </div>

      <div class="col-sm-6 col-xs-12">
        <div class="form-group">
          <label>Fecha</label>
          <div class="input-group">
            <input type="text" class="calendar form-control" v-model="invoice.invoice_date">
            <div class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></div>
          </div>
        </div>
        <div class="form-group">
          <label>Concepto</label>
          <select class="form-control" v-model="invoice.concept_type">
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
          <tfoot>
            <tr colspan="6">
              <td @click="addItem"><span class="glyphicon glyphicon-plus"></span> Agregar item</td>
            </tr>
          </tfoot>
          <tbody>
            <tr v-for="line in invoicelines">
              <td><input id="line-{{$index}}" type="text" class="form-control" :disabled="line._deleted" /></td>
              <td><textarea rows="1" v-model="line.description" class="form-control" :disabled="line._deleted"></textarea></td>
              <td><input size="3"  type="text" v-model="line.quantity" class="form-control" :disabled="line._deleted"></td>
              <td>
                <div class="input-group">
                  <div class="input-group-addon">$</div>
                  <input size="3" type="text" v-model="line.price_sold" class="form-control" :disabled="line._deleted">
                </div>
              </td>
              <td>
                <div class="input-group">
                  <input size="3" type="text" v-model="line.discount" class="form-control" :disabled="line._deleted">
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
        </table>
      </div>
      <div class="col-md-8">
      </div>
      <div class="col-md-4">
        <div class="col-md-12">
          <div class="col-md-4">
            <label>Neto:</label>
          </div>
          <div class="col-md-8">
            ${{ net }}
          </div>
        </div>
        <div class="col-md-12">
          <div class="col-md-4">
            <label>Impuestos:</label>
          </div>
          <div class="col-md-8">
            ${{ tax }}
          </div>
        </div>
        <div class="col-md-12">
          <div class="col-md-4">
            <label>Total:</label>
          </div>
          <div class="col-md-8">
            ${{ total }}
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import ButtonBar from '../../utils/components/ButtonBar.vue'
import Vue from 'vue'
import { addInvoice, getInvoiceTypes, getContacts, getProducts } from '../../vuex/actions'

export default {
  components: {
    ButtonBar
  },
  computed: {
    net () {
      var sum = 0
      for (let line of this.invoicelines) {
        sum += line.price_sold * line.quantity * (100 - line.discount) / 100
      }
      return sum
    },
    tax () {
      var sum = 0
      for (let line of this.invoicelines) {
        sum += (line.price_sold * line.quantity * (100 - line.discount) / 100) * line.vat / 100
      }
      return sum
    },
    total () {
      return this.net + this.tax
    }
  },
  data () {
    return {
      bb_crumbs: ['Contabilidad', 'Facturas', 'Ingresar'],
      bb_buttons: [{text: 'Guardar', method: 'save'}, {text: 'Descartar', method: 'discard', class: 'btn-link'}],
      invoice: {},
      // invoicelines: [{product: '', description: '', price_sold: 3.50, discount: 0, quantity: 3, vat: 21},
      //                {product: '', description: 'Gluten free', price_sold: 7, discount: 0, quantity: 1, vat: 10.5, _deleted: true}],
      invoicelines: [],
      productPromise: null,
      productEngine: null,
      p1: null,
      p2: null,
      p3: null
    }
  },
  methods: {
    discard () {
      this.$router.go('/accounting/invoices/')
    },
    save () {
      let invoice = {
        invoicear_company: 'http://localhost:8000/api/invoice_ar/companies/1/',
        invoicear_contact: window.jQuery('#contactInput').val(),
        number: 0,
        invoice_type: this.invoice.invoice_type,
        invoice_date: this.invoice.invoice_date,
        notes: '',
        point_of_sale_ar: 'http://localhost:8000/api/invoice_ar/pointsofsalear/1/',
        due_date: this.invoice.invoice_date,
        concept_type: `http://localhost:8000/api/invoice_ar/concepttypes/${this.invoice.concept_type}/`
      }
      invoice.invoice_lines = []

      this.addInvoice(invoice)
    },
    getProduct (product) {
      return this.products.find(p => p.url === product.url)
    },
    addItem () {
      this.invoicelines.push({
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
        console.log(vm.invoicelines[line])
        console.log(product)
        vm.invoicelines[line].price_sold = product.current_price
        vm.invoicelines[line].vat = product.vat.tax * 100
      })
    }
  },

  created () {
    this.p1 = this.getInvoiceTypes()
    this.p2 = this.getContacts()
    this.p3 = this.getProducts()
  },

  ready () {
    var vm = this

    Promise.all([this.p1, this.p2, this.p3]).then(function () {
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
        'startDate': '2016-08-01',
        'endDate': '2016-08-31'
      })

      // Init the product inputs
      vm.initProducts()
    })
  },

  vuex: {
    getters: {
      invoiceTypes: state => state.accounting.invoiceTypes.all.filter(it => it.invoice_type_class === 'B'),
      contacts: state => state.contacts.all,
      products: state => state.accounting.products.all
    },
    actions: {
      addInvoice,
      getContacts,
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
