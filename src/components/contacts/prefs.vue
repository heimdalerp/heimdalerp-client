<template>
  <div>
    <button-bar :crumbs="bb.crumbs" :buttons="bb.buttons"></button-bar>
    <div class="jumbotron">
      <div class="col-md-12">
        <div class="form-group">
          <div class="col-md-12">
            <label>Ciudad por defecto</label>
          </div>
          <div class="col-sm-4">
            Pais
          </div>
          <div class="col-sm-4">
            Provincia
          </div>
          <div class="col-sm-4">
            Ciudad
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    'ButtonBar': require('../../utils/components/ButtonBar.vue'),
    'OneToOne': require('../../utils/components/OneToOneNext.vue')
  },
  data () {
    return {
      bb: {
        buttons: [{text: 'Editar', method: 'edit', condition: function () { return !this.editing }.bind(this)},
                  {text: 'Guardar', method: 'save', condition: function () { return this.editing }.bind(this)},
                  {text: 'Descartar', method: 'discard', condition: function () { return this.editing }.bind(this), class: 'btn-link'}],
        crumbs: ['Contactos', 'Preferencias']
      },
      otoCountry: {
        name: 'País',
        options: [
          {id: 0, name: 'Cero'},
          {id: 1, name: 'Uno'},
          {id: 2, name: 'Dos'}
        ]
      },
      editing: false
    }
  },
  methods: {
    edit () {
      this.editing = true
    },
    save () {
      this.editing = false
    },
    discard () {
      this.editing = false
    }
  }
}
</script>
