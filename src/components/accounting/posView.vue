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
      <home-address :editing="editing" v-model="pos.fiscal_address"></home-address>
      <locality :editing="editing" v-model="pos.fiscal_address.locality"></locality>

      <div class="col-sm-6 col-xs-12">
        <div class="form-group">
          <label>Código</label>
          <input v-if="editing" type='text' class='form-control' v-model="pos.afip_id" />
          <p v-else>{{ pos.afip_id }}</p>
        </div>
      </div>

      <div class="col-sm-6 col-xs-12">
        <div class="form-group">
          <one-to-one v-if="editing" name="Tipo" display="name" :options="pos_types" v-model="pos.point_of_sale_type"></one-to-one>
          <div v-else><label>Tipo</label><p>{{ pos.point_of_sale_type.name | default('-') }}</p></div>
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
    // type_string () {
    //   return this.pos_types.find(t => t.id === this.pos.point_of_sale_type.id)
    //   // switch (this.pos.point_of_sale_type) {
    //   //   case 'C':
    //   //     return 'Fiscal Controller'
    //   //   case 'F':
    //   //     return 'Pre-printed'
    //   //   case 'W':
    //   //     return 'Webservice'
    //   //   case 'L':
    //   //     return 'Online'
    //   // }
    // },
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
      pos_types: [{id: 'C', name: 'Fiscal Controller'},
                  {id: 'F', name: 'Pre-printed'},
                  {id: 'W', name: 'Webservice'},
                  {id: 'L', name: 'Online'}]
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
      let pos = JSON.parse(JSON.stringify(this.pos))

      pos.point_of_sale_type = pos.point_of_sale_type.id
      pos.fiscal_address.locality = pos.fiscal_address.locality.url

      if (this.$route.params.posId === 'new') {
        this.addPOS(pos).then(response => {
          this.$router.push('/accounting/pointsofsale/' + response.data.id + '/')
        })
      } else {
        this.editPOS(this, pos).then(() => {
          this.$router.push('/accounting/pointsofsale')
        })
      }
    }
  },

  created () {
    this.pos = Object.assign({}, {
      invoicear_company: auth.user.company_ar,
      fiscal_address: {},
      point_of_sale_type: {}
    })

    let posLoaded = this.getPOSs().then(function (response) {
      if (this.$route.params.posId === 'new') {
        this.editing = true
        this.bb_crumbs.push('Crear nuevo Punto de Venta')
      } else {
        this.pos = JSON.parse(JSON.stringify(this.currentPos))
        this.pos.point_of_sale_type = this.pos_types.find(t => t.id === this.pos.point_of_sale_type)
        this.bb_crumbs.push(this.pos.afip_id)
      }
    })

    if (this.$route.params.posId !== 'new') {
      posLoaded.then(function () {
        this.$http.get(this.pos.fiscal_address.locality).then(function (response) {
          this.pos.fiscal_address.locality = response.data
        })
      })
    }
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
