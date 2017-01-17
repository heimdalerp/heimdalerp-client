<template>
  <div>
    <button-bar :crumbs="bb_crumbs" :buttons="bb_buttons"></button-bar>
    <table class="table table-hover table-striped table-border table-condensed table-hover">
      <thead>
        <th><input type="checkbox"></th>
        <th>Número</th>
        <th>Nombre de Fantasía</th>
        <th>Sistema</th>
        <th>Baja</th>
        <th>Domicilio</th>
      </thead>
      <tbody>
        <tr v-for="pointofsale in POSs" v-link="'/accounting/pointsofsale/' + pointofsale.id">
          <td><input type="checkbox"></td>
          <td>{{ pointofsale.afip_id }}</td>
          <td>{{ pointofsale.fantasy_name }}</td>
          <td>{{ type_string(pointofsale.point_of_sale_type) }}</td>
          <td><input type="checkbox" disabled="disabled" v-model="pointofsale.is_inactive"></td>
          <td>{{ pointofsale.fiscal_address.street_address | default '-' }}</td>
        </tr>
        <tr v-if="POSs.length === 0">
          <td colspan="6">Sin resultados.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getPOSs } from 'src/vuex/actions'

export default {
  components: {
    'ButtonBar': require('../../utils/components/ButtonBar.vue')
  },
  data () {
    return {
      bb_crumbs: ['Contabilidad', 'Puntos de Venta'],
      bb_buttons: [{text: 'Crear', method: 'create'}]
    }
  },
  methods: {
    create () {
      this.$router.push('/accounting/pointsofsale/new')
    },
    type_string (type) {
      switch (type) {
        case 'C':
          return 'Fiscal Controller'
        case 'F':
          return 'Pre-printed'
        case 'W':
          return 'Webservice'
        case 'L':
          return 'Online'
      }
    }
  },
  created () {
    this.getPOSs()
  },

  vuex: {
    getters: {
      POSs: store => store.accounting.pos.all
    },
    actions: {
      getPOSs
    }
  }
}
</script>
