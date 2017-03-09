<template>
  <div>
    <span class="glyphicon glyphicon-plus" @click="open"></span>

    <div id="createRegionModal" class="modal fade" role="dialog">
      <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" @click="dismiss">&times;</button>
            <h4 class="modal-title">Crear Provincia</h4>
          </div>

          <div class="modal-body">
            <form class="form-inline">
              <div class="form-group">
                <label>
                  Nombre:
                  <input class="form-control" v-model="newRegionName">
                </label>
              </div>
              <div class="form-group">
                <label>
                  País:
                  <div class="input-group">
                    <select class="form-control" v-model="newRegion">
                      <option v-for="country in countries" :value="country.url">
                        {{ country.default_name }}
                      </option>
                    </select>
                    <create-country></create-country>
                  </div>
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
import createCountry from './createCountry'

export default {
  components: { createCountry },
  name: 'createRegion',
  data () {
    return {
      newRegionName: null,
      newRegionCountry: null,
      countries: []
    }
  },

  methods: {

    save () {
      let hasErrors = false
      let msg = ''

      if (this.newRegionName === '') {
        msg += 'Debe rellenar el nombre.\r\n'
        hasErrors = true
      }

      if (hasErrors === true) {
        this.eventHub.$emit('showError', msg)
        return false
      }

      console.log(this.newRegionName)
      console.log(this.newRegionCountry)
    },

    dismiss () {
      window.jQuery('#createRegionModal').modal('hide')
    },

    open () {
      window.jQuery('#createRegionModal').modal({backdrop: 'static'})
    },

    showCreateCountryModal () {
      console.log('stub')
    }
  },

  created () {
    this.$http.post('geo/countries/').then((response) => {
      this.countries = response.data.results
    })
  }
}
</script>

<style scoped>
/*.glyphicon {
  margin-top: 6px;
}*/
</style>
