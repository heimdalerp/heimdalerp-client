<template>
  <div>
    <button-bar :crumbs="bb_crumbs" :buttons="bb_buttons"></button-bar>
    <table class="table table-hover table-striped table-border table-condensed table-hover">
      <thead>
        <th><input type="checkbox"></th>
        <th>Nombre</th>
        <th>Precio</th>
        <th>IVA</th>
      </thead>
      <tbody>
        <router-link :to="'inventory/products/' + product.id" tag="tr" v-for="product in products">
          <td><input type="checkbox"></td>
          <td>{{ product.name }}</td>
          <td>{{ product.current_price }}</td>
          <td>{{ product.vat.name }}</td>
        </router-link>
        <tr v-if="products.length === 0">
          <td colspan="4">Sin resultados.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getProducts } from 'src/vuex/actions'

export default {
  data () {
    return {
      bb_crumbs: ['Inventario'],
      bb_buttons: [{text: 'Crear', method: 'create'}]
    }
  },

  methods: {
    create () {
      this.$router.push('/inventory/products/new')
    }
  },

  created () {
    this.getProducts()
  },

  vuex: {
    getters: {
      products: store => store.accounting.products.all
    },
    actions: {
      getProducts
    }
  }
}
</script>
