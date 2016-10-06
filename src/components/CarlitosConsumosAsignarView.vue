<template>
  <div>
    <button-bar :crumbs="bb_crumbs" :buttons="bb_buttons"></button-bar>
    <div class="jumbotron">
      <h3>{{ contactName }}</h3>

      <table class="table table-striped">
        <thead>
          <tr><th>Número</th><th>Descripción</th><th>Valor</th><th v-if="editing">Acción</th></tr>
        </thead>
        <tbody v-if="!editing">
          <tr v-for="consumo in consumos">
            <td>{{ consumo.code }}</td>
            <td>{{ consumo.description }}</td>
            <td>${{ consumo.price }}</td>
          </tr>
          <tr v-if="consumos.length === 0">
            <td colspan="4">Sin resultados.</td>
          </tr>
        </tbody>

        <tbody v-if="editing">
          <tr v-for="consumo in consumos">
            <td>
              <input class="form-control" type="text" v-model="consumo.code" :disabled="consumo.deleted" />
            </td>
            <td>
              <input class="form-control" id="description" type="text" v-model="consumo.description" :disabled="consumo.deleted" />
            </td>
            <td>
              <div class="input-group">
                <div class="input-group-addon">$</div>
                <input class="form-control" id="price" type="text" v-model="consumo.price" :disabled="consumo.deleted" />
              </div>
            </td>
            <td>
              <span v-if="!consumo.deleted" class="glyphicon glyphicon-remove" @click="remove(consumo)"></span>
              <span v-else class="glyphicon glyphicon-backward" @click="undoRemove(consumo)"></span>
            </td>
          </tr>
          <tr>
            <td>
            </td>
            <td>
            </td>
            <td>
            </td>
            <td>
              <span class="glyphicon glyphicon-plus" @click="add"></span>
            </td>
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
      bb_crumbs: ['Consumos', 'Asignar'],
      bb_buttons: [{text: 'Editar', method: 'edit', condition: function () { return !this.editing }.bind(this)},
                   {text: 'Guardar', method: 'save', condition: function () { return this.editing }.bind(this)},
                   {text: 'Descartar', method: 'discard', condition: function () { return this.editing }.bind(this), class: 'btn-link'}],
      contactName: '',
      contactUrl: '',
      editing: false,
      consumos: ''
    }
  },
  computed: {
    contact () {
      return this.$route.params.contactId
    }
  },
  methods: {
    edit () {
      this.editing = true
    },
    save () {
      var promises = []

      for (let consumo of this.consumos) {
        consumo.invoicear_contact = this.contactUrl
        if (consumo.new === true) {
          if (!('deleted' in consumo) || (consumo.deleted === false)) {
            promises.push(this.$http.post('csn/consumos/', consumo))
          }
          continue
        }

        if (consumo.deleted === true) {
          promises.push(this.$http.delete('csn/consumos/' + consumo.id + '/'))
          continue
        }

        promises.push(this.$http.put('csn/consumos/' + consumo.id + '/', consumo))
      }

      var vm = this
      Promise.all(promises).then(function () {
        vm.$router.go('/carlitos/consumos/asignar')
      })
    },
    discard () {
      var r = window.confirm('Desea descartar los datos ingresados?')

      if (r) {
        this.$router.go('/carlitos/consumos/asignar')
      }
    },
    add () {
      this.consumos.push({code: '', description: '', price: '', new: true})
    },
    remove (consumo) {
      Vue.set(consumo, 'deleted', true)
    },
    undoRemove (consumo) {
      Vue.set(consumo, 'deleted', false)
    }
  },
  ready () {
    this.$http.get('invoice_ar/contacts/' + this.contact + '/').then(function (response) {
      this.contactName = response.json().invoice_contact.contact_contact.name
      this.contactUrl = response.json().url
      this.bb_crumbs.push(response.json().invoice_contact.contact_contact.name)
    })
    this.$http.get('csn/contacts/' + this.contact + '/consumos/').then(function (response) {
      this.consumos = response.json().results
    })
  },
  canReuse: false
}
</script>
<style scoped>
  .jumbotron {
    text-align: center;
  }
  table {
    margin: auto;
    text-align: center;
    max-width: 10%;
  }

  .glyphicon-remove {
    color: red;
  }

  .glyphicon-plus {
    color: green;
  }

  #description {
    width: 150px;
  }

  #price {
    width: 100px;
  }
</style>
