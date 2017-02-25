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
        <router-link v-for="pointofsale in POSs" :to="'/accounting/pointsofsale/' + pointofsale.id" tag="tr">
          <td><input type="checkbox"></td>
          <td>{{ pointofsale.afip_id }}</td>
          <td>{{ pointofsale.fantasy_name }}</td>
          <td>{{ pos_types.find(t => t.id === pointofsale.point_of_sale_type).name }}</td>
          <td><input type="checkbox" disabled="disabled" v-model="pointofsale.is_inactive"></td>
          <td>{{ pointofsale.fiscal_address.street_address | default('-') }}</td>
        </router-link>
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
  data () {
    return {
      bb_crumbs: ['Contabilidad', 'Puntos de Venta'],
      bb_buttons: [{ text: 'Crear', method: 'create' }],
      pos_types: [{ id: 'C', name: 'Fiscal Controller' },
                  { id: 'F', name: 'Pre-printed' },
                  { id: 'W', name: 'Webservice' },
                  { id: 'L', name: 'Online' }]
    }
  },

  created () {
    this.getPOSs()
  },

  methods: {
    create () {
      this.$router.push('/accounting/pointsofsale/new')
    }
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
