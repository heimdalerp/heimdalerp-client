<template>
  <div>
    <button-bar :crumbs="bb_crumbs" :buttons="bb_buttons"></button-bar>
    <div class="jumbotron container">
      <div class="col-sm-12 col-xs-12">
        <div class="form-group">
          <label>Nombre de fantasía</label>
          <input v-if="editing" type='text' class='form-control' />
          <p v-else>{ pos.fantasy_name }}</p>
        </div>
        <div class="form-group">
          <label>Domicilio Fiscal</label>
          <input v-if="editing" type='text' class='form-control' />
          <p v-else>{ pos.fiscal_address }}</p>
        </div>
      </div>

      <div class="col-sm-6 col-xs-12">
      </div>

      <div class="col-sm-6 col-xs-12">
      </div>

    </div>
  </div>
</template>
<script>
export default {
  components: {
    'ButtonBar': require('../../utils/components/ButtonBar.vue')
  },
  computed: {
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
  data () {
    return {
      bb_crumbs: ['Contabilidad', 'Puntos de Venta', 'Crear'],
      bb_buttons: [{text: 'Editar', method: 'edit', condition: function () { return !this.editing }.bind(this)},
                   {text: 'Guardar', method: 'save', condition: function () { return this.editing }.bind(this)},
                   {text: 'Descartar', method: 'discard', class: 'btn-link', condition: function () { return this.editing }.bind(this)}],
      editing: false
    }
  },
  methods: {
    edit () {
      this.editing = true
    },
    discard () {
      this.$router.go('/accounting/pointsofsale/')
    },
    save () {
    }
  }
}
</script>
