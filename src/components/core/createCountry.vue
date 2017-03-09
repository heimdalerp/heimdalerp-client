<template>
  <div>
    <span class="glyphicon glyphicon-plus" @click="open"></span>

    <div id="createCountryModal" class="modal fade" role="dialog">
      <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" @click="dismiss">&times;</button>
            <h4 class="modal-title">Crear País</h4>
          </div>

          <div class="modal-body">
            <form class="form-inline">
              <div class="form-group">
                <label>
                  Nombre:
                  <input class="form-control" v-model="newRegionName">
                </label>
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
export default {
  name: 'createCountry',
  data () {
    return {
      newCountryName: null
    }
  },

  methods: {
    save () {
      let hasErrors = false
      let msg = ''

      if (this.newCountry === '') {
        msg += 'Debe rellenar el nombre.\r\n'
        hasErrors = true
      }

      if (hasErrors === true) {
        this.eventHub.$emit('showError', msg)
        return false
      }

      console.log(this.newCountryName)
    },

    dismiss () {
      window.jQuery('#createCountryModal').modal('hide')
    },

    open () {
      window.jQuery('#createCountryModal').modal({backdrop: 'static'})
    }
  }
}
</script>

<style scoped>
/*.glyphicon {
  margin-top: 6px;
}*/
</style>
