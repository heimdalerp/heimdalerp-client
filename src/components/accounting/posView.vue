<template>
  <div>
    <button-bar :crumbs="bb_crumbs" :buttons="bb_buttons"></button-bar>
    <div class="jumbotron container">
      <div class="col-sm-12 col-xs-12">
        <div class="form-group">
          <label>Nombre de fantasía</label>
          <input v-if="editing" type='text' class='form-control' v-model="pos.fantasy_name" />
          <p v-else>{{ pos.fantasy_name }}</p>
        </div>
        <div class="form-group">
          <label>Domicilio Fiscal</label>
          <input v-if="editing" type='text' class='form-control' v-model="pos.fiscal_address.street_address" />
          <p v-else>{{ pos.fiscal_address }}</p>
        </div>
      </div>

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
import { addPOS, getPOSs } from '../../vuex/actions'
import auth from '../../auth/index'

export default {
  components: {
    'ButtonBar': require('../../utils/components/ButtonBar.vue'),
    'OneToOne': require('../../utils/components/OneToOne.vue')
  },
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
          this.$router.go(this.$route.path)
        } else {
          this.$router.go('/accounting/pointsofsale/')
        }
      }
    },
    save () {
      this.addPOS(this.pos).then(() => {
        this.$router.go('/accounting/pointsofsale/')
      })
    }
  },

  created () {
    this.getPOSs().then(function (response) {
      if (this.$route.params.posId === 'new') {
        this.editing = true
        this.bb_crumbs.push('Crear nuevo Punto de Venta')
        this.pos = Object.assign({}, {
          invoicear_company: auth.user.company_ar,
          fiscal_address: {
            'street_address': '',
            'floor_number': '',
            'apartment_number': '',
            'locality': null,
            'postal_code': ''
          }
        })
      } else {
        this.pos = this.currentPos
        this.bb_crumbs.push(this.pos.afip_id)
      }
    })

    this.getFiscalPositions
  },

  vuex: {
    getters: {
      POSs: state => state.accounting.pos.all
    },
    actions: {
      addPOS,
      getPOSs
    }
  }
}
</script>
