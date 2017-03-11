<template>
  <div>
    <!-- Create Organization Modal -->
    <div id="createLocalityModal" class="modal fade" role="dialog">
      <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" @click="dismiss">&times;</button>
            <h4 class="modal-title">Crear Localidad</h4>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label>Nombre:</label>
              <input class="form-control" v-model="newLocalityName">
            </div>
            <div class="form-group">
              <label>Provincia:</label>
              <div class="input-group">
                <select class="form-control" v-model="newLocalityRegion">
                  <option v-for="region in regions" :value="region.url">
                    {{ region.default_name }}
                  </option>
                </select>
              </div>
            </div>
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
  name: 'createLocality',
  data () {
    return {
      newLocalityName: null,
      newLocalityRegion: null,
      regions: []
    }
  },

  methods: {

    save () {
      let hasErrors = false
      let msg = ''

      if (this.newLocalityName === '') {
        msg += 'Debe rellenar el nombre.\r\n'
        hasErrors = true
      }

      if (hasErrors === true) {
        this.eventHub.$emit('showError', msg)
        return false
      }

      let locality = {
        'default_name': this.newLocalityName,
        'alternative_names': [],
        'region': this.newLocalityRegion
      }

      this.$http.post('geo/localities/', locality).then(response => {
        this.$emit('input', response.url)
        this.dismiss()
      })
    },

    dismiss () {
      window.jQuery('#createLocalityModal').modal('hide')
    },

    open () {
      window.jQuery('#createLocalityModal').modal({backdrop: 'static'})
    }
  },

  created () {
    this.$http.get('geo/regions/').then((response) => {
      this.regions = response.data.results
    })
  }
}
</script>

<style scoped>
/*.glyphicon {
  margin-top: 6px;
}*/
</style>
