<template>
  <div>
    <button-bar :crumbs="bb_crumbs" :buttons="bb_buttons"></button-bar>
    <div class="jumbotron container">
      <div class="col-xs-12">
        <div class="form-group">
          <label>Nombre de fantasía</label>
          <input v-if="editing" type='text' class='form-control' v-model="pos.fantasy_name" />
          <p v-else>{{ pos.fantasy_name }}</p>
        </div>
      </div>
      <address :editing="editing" @update="updateAddress" :value="pos.fiscal_address"></address>
      <locality :editing="editing" @update="updateLocality" :url="pos.fiscal_address.locality"></locality>

      <div class="col-sm-6 col-xs-12">
        <div class="form-group">
          <label>Código</label>
          <input v-if="editing" type='text' class='form-control' v-model="pos.afip_id" />
          <p v-else>{{ pos.afip_id }}</p>
        </div>
      </div>

      <div class="col-sm-6 col-xs-12">
        <div class="form-group">
          <one-to-one v-if="editing" :name="ototype.name" :options="ototype.options" :model.sync="pos.point_of_sale_type"></one-to-one>
          <div v-else><label>Tipo</label><p>{{ type_string }}</p></div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import { addPOS, editPOS, getPOSs } from '../../vuex/actions'
import auth from '../../auth/index'

export default {
  computed: {
    type_string () {
      switch (this.pos.point_of_sale_type) {
        case 'C':
          return 'Fiscal Controller'
        case 'F':
          return 'Pre-printed'
        case 'W':
          return 'Webservice'
        case 'L':
          return 'Online'
      }
    },
    currentPos () {
      return this.POSs.find(p => p.id === parseInt(this.$route.params.posId))
    }
  },
  data () {
    return {
      bb_crumbs: ['Contabilidad', 'Puntos de Venta'],
      bb_buttons: [{text: 'Editar', method: 'edit', condition: function () { return !this.editing }.bind(this)},
                   {text: 'Guardar', method: 'save', condition: function () { return this.editing }.bind(this)},
                   {text: 'Descartar', method: 'discard', class: 'btn-link', condition: function () { return this.editing }.bind(this)}],
      editing: false,
      pos: {},
      ototype: {name: 'Tipo', options: [{id: 'C', name: 'Fiscal Controller'},
                                        {id: 'F', name: 'Pre-printed'},
                                        {id: 'W', name: 'Webservice'},
                                        {id: 'L', name: 'Online'}]}
    }
  },
  methods: {
    edit () {
      this.editing = true
    },
    discard () {
      var r = window.confirm('Desea descartar los datos ingresados?')

      if (r) {
        if (this.$route.params.posId !== 'new') {
          this.editing = false
          this.$router.push(this.$route.path)
        } else {
          this.$router.push('/accounting/pointsofsale/')
        }
      }
    },
    save () {
      if (this.$route.params.posId === 'new') {
        this.addPOS(this.pos).then(response => {
          this.$router.push('/accounting/pointsofsale/' + response.data.id + '/')
        })
      } else {
        this.editPOS(this, this.pos).then(() => {
          this.$router.push('/accounting/pointsofsale')
        })
      }
    },
    updateAddress (address) {
      this.pos.fiscal_address = address
    },
    updateLocality (url) {
      this.pos.fiscal_address.locality = url
    }
  },

  created () {
    this.pos = Object.assign({}, {
      invoicear_company: auth.user.company_ar,
      fiscal_address: {}
    })

    this.getPOSs().then(function (response) {
      if (this.$route.params.posId === 'new') {
        this.editing = true
        this.bb_crumbs.push('Crear nuevo Punto de Venta')
      } else {
        this.pos = JSON.parse(JSON.stringify(this.currentPos))
        this.bb_crumbs.push(this.pos.afip_id)
      }
    })
  },

  vuex: {
    getters: {
      POSs: state => state.accounting.pos.all
    },
    actions: {
      addPOS,
      editPOS,
      getPOSs
    }
  }
}
</script>
