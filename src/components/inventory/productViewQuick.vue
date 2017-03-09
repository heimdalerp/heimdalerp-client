<template>
  <div>
    <div id="createCountryModal" class="modal fade" role="dialog">
      <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" @click="dismiss">&times;</button>
            <h4 class="modal-title">Crear Producto</h4>
          </div>

          <div class="modal-body">
            <form class="form-inline">
              <div class="form-group">
                <label>Nombre</label>
                <input type='text' class='form-control' v-model="product.name" />
              </div>

              <div class="form-group">
                <label>Precio</label>
                <input type='text' class='form-control' v-model="product.current_price" />
              </div>

              <div class="form-group">
                <one-to-one display="name" name="IVA" :options="vats" v-model="product.vat"></one-to-one>
              </div>
            </form>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="save">Guardar</button>
            <button type="button" class="btn btn-default" @click="dismiss">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import auth from '../../auth/index.js'
import { addProduct, getVATs } from '../../vuex/actions'

export default {
  name: 'product-View-Quick',
  data () {
    return {
      product: {
        name: '',
        current_price: '',
        vat: {}
      }
    }
  },

  created () {
    this.getVATs(this)
  },

  methods: {
    save () {
      let hasErrors = false
      let msg = ''

      if (this.product.name === '') {
        msg += 'Debe rellenar el nombre.\r\n'
        hasErrors = true
      }

      if (this.product.current_price === '') {
        msg += 'Debe rellenar el precio.<br>'
        hasErrors = true
      }

      if (Object.keys(this.product.vat).length === 0) {
        msg += 'Debe rellenar el IVA.'
        hasErrors = true
      }

      if (hasErrors === true) {
        this.eventHub.$emit('showError', msg)
        return false
      }

      let product = JSON.parse(JSON.stringify(this.product))
      product.vat = product.vat.url
      product.invoice_company = auth.user.company_in

      this.addProduct(this, product).then(product => {
        this.$emit('input', product)
        this.dismiss()
      })
    },

    dismiss () {
      window.jQuery('#createCountryModal').modal('hide')
    },

    open () {
      window.jQuery('#createCountryModal').modal({backdrop: 'static'})
    }
  },

  vuex: {
    getters: {
      products: state => state.accounting.products.all,
      vats: state => state.accounting.vats.all
    },
    actions: {
      addProduct,
      getVATs
    }
  }
}
</script>

<style scoped>
/*.glyphicon {
  margin-top: 6px;
}*/
</style>
