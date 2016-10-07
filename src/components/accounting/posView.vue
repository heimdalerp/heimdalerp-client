<template>
  <div>
    <button-bar :crumbs="bb_crumbs" :buttons="bb_buttons"></button-bar>
    <div class="jumbotron container">
      <div class="col-sm-12 col-xs-12">
        <div class="form-group">
          <label>Nombre de fantasía</label>
          <input v-if="editing" type='text' class='form-control' />
          <p v-else>{{ pos.fantasy_name }}</p>
        </div>
        <div class="form-group">
          <label>Domicilio Fiscal</label>
          <input v-if="editing" type='text' class='form-control' />
          <p v-else>{{ pos.fiscal_address }}</p>
        </div>
      </div>

      <div class="col-sm-6 col-xs-12">
        <div class="form-group">
          <label>Código</label>
          <input v-if="editing" type='text' class='form-control' />
          <p v-else>{{ pos.afip_id }}</p>
        </div>
      </div>

      <div class="col-sm-6 col-xs-12">
        <div class="form-group">
          <label>Tipo</label>
          <input v-if="editing" type='text' class='form-control' />
          <p v-else>{{ type_string }}</p>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import { getPOSs } from '../../vuex/actions'
import Vue from 'vue'

export default {
  components: {
    'ButtonBar': require('../../utils/components/ButtonBar.vue')
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
      pos: {}
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
          this.$router.go(this.$route.path)
        } else {
          this.$router.go('/accounting/pointsofsale/')
        }
      }
    },
    save () {
    }
  },

  //  this.pos = Object.assign({}, {
  //  fantasy_name: null,
  //  fiscal_address: null,
  //  afip_id: null,
  //  point_of_sale_type: null
  // })

  /* if (this.$route.params.posId === 'new') {
    this.editing = true
    this.bb_crumbs.push('Crear nuevo Punto de Venta')
  } else {
    // this.bb_crumbs.push(this.pos.afip_id)
  } */
  created () {
    this.getPOSs().then(function (response) {
      var vm = this
      Vue.nextTick(function () {
        console.log(vm.POSs.length)
      })
    })

    var vm = this
    setTimeout(function () {
      console.log(vm.POSs.length)
    }, 3000)
  },

  vuex: {
    getters: {
      POSs: state => state.accounting.pos.all
    },
    actions: {
      getPOSs
    }
  }
}
</script>
