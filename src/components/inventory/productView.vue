<template>
  <div>
    <button-bar :crumbs="bb_crumbs" :buttons="bb_buttons"></button-bar>
    <form novalidate>
    <div class="jumbotron">
      <div class="row">
        <div class="col-xs-12">
          <div class="form-group">
            <label>Nombre</label>
            <input v-if="editing" type='text' class='form-control' v-model="product.name" />
            <p v-else>{{ product.name }}</p>
          </div>

          <div class="form-group">
            <label>Precio</label>
            <input v-if="editing" type='text' class='form-control' v-model="product.current_price" />
            <p v-else>{{ product.current_price }}</p>
          </div>

          <div class="form-group">
            <one-to-one v-if="editing" display="name" name="IVA" :options="vats" v-model="product.vat"></one-to-one>
            <label v-if="!editing">IVA</label>
            <p v-if="!editing">{{ product.vat.name }}</p>
          </div>
        </div>
      </div>
    </div>
    </form>
  </div>
</template>

<script>
import auth from '../../auth/index.js'
import { getProducts, addProduct, editProduct, getVATs } from '../../vuex/actions'

export default {
  name: 'Product-View',
  data () {
    return {
      bb_buttons: [{text: 'Editar', method: 'edit', condition: function () { return !this.editing }.bind(this)},
                   {text: 'Guardar', method: 'save', condition: function () { return this.editing }.bind(this)},
                   {text: 'Descartar', method: 'discard', condition: function () { return this.editing }.bind(this), class: 'btn-link'}],
      bb_crumbs: ['Productos'],
      editing: false,
      product: {}
    }
  },

  methods: {
    edit () {
      this.editing = true
    },
    discard () {
      var r = window.confirm('Desea descartar los datos ingresados?')

      if (r) {
        if (this.$route.params.productId !== 'new') {
          this.editing = false
          this.$router.push(this.$route.path)
        } else {
          this.$router.push('/inventory/')
        }
      }
    },
    save () {
      var msg = ''
      var hasErrors = false

      if (this.product.name === undefined) {
        msg += 'Debe rellenar el nombre.\r\n'
        hasErrors = true
      }

      if (hasErrors === true) {
        this.eventHub.$emit('showError', msg)
        return false
      }

      this.product.invoice_company = auth.user.company_in

      let product = JSON.parse(JSON.stringify(this.product))
      product.vat = this.product.vat.url

      if (this.$route.params.productId === 'new') {
        this.addProduct(this, product).then(response => {
          console.log(response)
          this.$router.push('products/' + response.data.id + '/')
        })
      } else {
        this.editProduct(this, product).then(response => {
          this.$router.push('/inventory')
        })
      }
    }
  },

  created () {
    var vm = this

    this.product = {
      vat: {}
    }

    let vatsLoaded = this.getVATs(vm)

    vatsLoaded.then(function () {
      this.getProducts(vm).then(function (response) {
        if (vm.$route.params.productId === 'new') {
          vm.editing = true
          vm.bb_crumbs.push('Crear nuevo producto')
        } else {
          vm.product = Object.assign({}, vm.products.find(p => p.id === parseInt(vm.$route.params.productId)))
          vm.bb_crumbs.push(vm.product.name)
          vm.product.vat = vm.vats.find(v => v.id === vm.product.vat.id)
        }
      })
    })
  },

  vuex: {
    getters: {
      products: state => state.accounting.products.all,
      vats: state => state.accounting.vats.all
    },
    actions: {
      addProduct,
      editProduct,
      getProducts,
      getVATs
    }
  },

  route: {
    canReuse: false
  }
}
</script>
