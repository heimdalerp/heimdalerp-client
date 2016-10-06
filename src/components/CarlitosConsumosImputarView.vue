<template>
  <div>
    <button-bar :crumbs="bb_crumbs" :buttons="bb_buttons"></button-bar>
    <div class="jumbotron">
      <h3>{{ contactName }}</h3>
      <h4>
        <button @click="goBack"><span class="glyphicon glyphicon-backward"></span></button>
        {{ monthName }} {{ year }}
        <button @click="goNext"><span class="glyphicon glyphicon-forward"></span></button>
      </h4>

      <table class="table table-striped">
        <thead>
          <tr><th>Día</th><th>Consumos</th><th>Subtotal</th></tr>
        </thead>
        <tbody>
          <tr v-for="consumo in consumos">
            <td>{{ dayName(consumo.day) }} {{ consumo.day + 1}}</td>
            <td>
              <form class="form-inline col-sm-12">
                <span v-for="item in consumo.desc" class="col-sm-4">
                  <span v-if="!consumo.editing">
                    <span class="label label-info">{{ item.id }}</span>: ${{ item.price}}
                  </span>

                  <div class="input-group" v-if="consumo.editing">
                    <span class="input-group-addon">{{ item.id }} ({{ getConsumo(item) }})</span>
                    <input type="text" class="form-control input-sm" placeholder="$" size="4" v-model="item.price" :disabled="item.deleted">
                    <span class="input-group-addon">
                      <span class="glyphicon glyphicon-minus" @click="itemRemove(item)" v-if="!item.deleted"></span>
                      <span class="glyphicon glyphicon-backward" @click="undoRemove(item)" v-else></span>
                    </span>
                  </div>
                </span>
              </form>

              <span class="col-sm-12">
                <select v-if="consumo.editing" v-model="asignado">
                  <option v-for="asignacion in asignados" value="{{$index}}">{{ asignacion.code }} - {{ asignacion.description}} (${{ asignacion.price }})</option>
                  <option value="e">Extra</option>
                </select>

                <span v-if="consumo.editing" class="glyphicon glyphicon-plus" @click="add(consumo.desc)"></span>

                <span v-if="editing && !consumo.editing" class="glyphicon glyphicon-pencil" @click="editConsumo(consumo)"></span>
              </span>
            </td>
            <td>${{ sumConsumo(consumo) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import ButtonBar from '../utils/components/ButtonBar.vue'
import Vue from 'vue'

export default {
  components: {'ButtonBar': ButtonBar},
  data () {
    return {
      bb_crumbs: ['Consumos', 'Imputar'],
      bb_buttons: [{text: 'Editar', method: 'edit', condition: function () { return !this.editing }.bind(this)},
                   {text: 'Guardar', method: 'save', condition: function () { return this.editing }.bind(this)},
                   {text: 'Descartar', method: 'discard', condition: function () { return this.editing }.bind(this), class: 'btn-link'}],
      contactName: '',
      consumos: [],
      editing: false,
      asignados: [],
      asignado: ''
    }
  },
  computed: {
    contact () {
      return this.$route.params.contactId
    },
    year () {
      return this.$route.params.year
    },
    month () {
      return this.$route.params.month
    },
    monthName () {
      var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
                   'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
      return meses[this.month - 1]
    },
    daysThisMonth () {
      var d = new Date(this.year, this.month, 0)
      return d.getDate()
    }
  },
  methods: {
    getConsumo (item) {
      return item.description
    },
    edit () {
      this.editing = true
      console.log(this.asignados)
    },
    save () {
      this.editing = false

      let _self = this

      let month = this.month
      if (month < 10) {
        month = '0' + month
      }
      let year = this.year

      let invoice = {
        invoicear_company: 'http://localhost:8000/api/invoice_ar/companies/1/',
        invoicear_contact: `http://localhost:8000/api/invoice_ar/contacts/${_self.contact}/`,
        number: 0,
        invoice_lines: [],
        invoice_type: null,
        invoice_date: null,
        notes: '',
        point_of_sale: 'http://localhost:8000/api/invoice_ar/pointsofsale/2/',
        due_date: null, // `${this.year}-${this.month}-${this.day}`,
        concept_type: 'http://localhost:8000/api/invoice_ar/concepttypes/1/'
      }

      // For each day
      this.consumos.forEach(function (consumo) {
        let day = consumo.day

        if (consumo.editing === true) {
          if (consumo.invoice_id !== null) {
            _self.$http.delete(`invoice_ar/invoices/${consumo.invoice_id}/`).then(function (response) {
              console.log(`Deleted ${consumo.invoice_id} for ${day + 1}.`)
            }, function (error) {
              this.$dispatch('showError', JSON.stringify(error.data))
            })
          } else {
            console.log(`Nothing to delete for ${day + 1}.`)
          }

          invoice.invoice_date = `${year}-${month}-${day + 1}`
          invoice.due_date = `${year}-${month}-${day + 1}`
          invoice.invoice_lines = []

          // For each consumo.desc of that day
          consumo.desc.forEach(function (desc) {
            if (!('deleted' in desc) || (desc.deleted === false)) {
              console.log(desc.id + ' stays.')
              invoice.invoice_lines.push({product: 'http://localhost:8000/api/invoice/products/1/',
                price_sold: parseFloat(desc.price),
                discount: 0,
                quantity: 1,
                description: `${desc.id} (${desc.description})`
              })
            }
          })

          // Check if there is anything to send before posting
          if (invoice.invoice_lines.length !== 0) {
            _self.$http.post('invoice_ar/invoices/', invoice).then(function (response) {
              console.log('k')
            }, function (error) {
              _self.$dispatch('showError', JSON.stringify(error.data))
            })
          }
        }
      })

      // window.location.reload()
    },
    discard () {
      var r = window.confirm('Desea descartar los datos ingresados?')

      if (r) {
        this.$router.go('/carlitos/consumos/imputar')
      }
    },
    goBack () {
      if (this.month !== '1') {
        this.$router.go('/carlitos/consumos/imputar/' + this.contact + '/' + this.year + '/' + (parseInt(this.month) - 1))
      } else {
        this.$router.go('/carlitos/consumos/imputar/' + this.contact + '/' + (parseInt(this.year) - 1) + '/12')
      }
    },
    goNext () {
      if (this.month !== '12') {
        this.$router.go('/carlitos/consumos/imputar/' + this.contact + '/' + this.year + '/' + (parseInt(this.month) + 1))
      } else {
        this.$router.go('/carlitos/consumos/imputar/' + this.contact + '/' + (parseInt(this.year) + 1) + '/1')
      }
    },
    dayName (day) {
      var dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
      var d = new Date(this.year, this.month - 1, day + 1, 0, 0, 0, 0)
      return dias[d.getDay()]
    },
    editConsumo (consumo) {
      consumo.editing = true
    },
    sumConsumo (consumo) {
      var subtotal = 0
      for (let i = 0; i < consumo.desc.length; i++) {
        if (consumo.desc[i].deleted !== true) {
          subtotal += parseInt(consumo.desc[i].price)
        }
      }
      return subtotal
    },
    add (items) {
      if (this.asignado === 'e') {
        items.push({id: 'e', description: '', price: 0})
      } else {
        var item = this.asignados[this.asignado]
        items.push({id: item.code, description: item.description, price: item.price})
      }
    },
    itemRemove (item) {
      Vue.set(item, 'deleted', true)
    },
    undoRemove (item) {
      Vue.set(item, 'deleted', false)
    }
  },
  ready () {
    for (var i = 0; i < this.daysThisMonth; i++) {
      this.consumos.push({day: i, invoice_id: null, desc: [], subtotal: '0', editing: false})
    }

    var _self = this
    this.$http.get(`invoice_ar/pointsofsale/2/invoices/?year=${this.year}&month=${this.month}`).then(function (response) {
      console.log(`?year=${this.year}&month=${this.month}`)
      response.json().results.forEach(function (item) {
        let day = item.invoice_date.split('-')[2] - 1
        console.log(day)
        let consumo = _self.consumos.filter(function (item) {
          return item.day === parseInt(day)
        })[0]

        consumo.invoice_id = item.id
        item.invoice_lines.forEach(function (line) {
          consumo.desc.push({id: line.description, price: parseInt(line.price_sold)})
        })
      })
    })

    this.$http.get('invoice_ar/contacts/' + this.contact + '/').then(function (response) {
      this.contactName = response.json().invoice_contact.contact_contact.name
      this.bb_crumbs.push(response.json().invoice_contact.contact_contact.name)
    })

    this.$http.get('csn/contacts/' + this.contact + '/consumos/').then(function (response) {
      this.asignados = response.json().results
    })
  },
  route: {
    canReuse: false
  }
}
</script>
<style scoped>
  .jumbotron {
    text-align: center;
  }

  .glyphicon-pencil {
    color: blue;
  }

  .glyphicon-plus {
    color: green;
  }

  .glyphicon-minus {
    color: red;
  }
</style>
