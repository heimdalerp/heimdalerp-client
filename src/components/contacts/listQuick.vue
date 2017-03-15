<template>
  <div>
    <!-- Create Organization Modal -->
    <div id="listContactModal" class="modal fade" role="dialog">
      <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" @click="dismiss">&times;</button>
            <h4 class="modal-title">Buscar Contacto</h4>
          </div>
          <div class="modal-body">
            <form class="form-inline">
              <div class="form-group">
                <label>Tipo</label>
                <select class="form-control" v-model="search_params.id_type">
                  <option value="">Todos</option>
                  <option v-for="type in idtypes" :value="type.id">{{ type.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Número</label>
                <input size="10" type="text" class="form-control" v-model="search_params.id_number">
              </div>
              <div class="form-group">
                <label>Nombre</label>
                <input type="text" class="form-control" v-model="search_params.legal_name">
              </div>
            </form>

            <br>

            <table class="table table-striped table-condensed">
              <thead>
                <tr>
                  <th width="25%">Identificación</th>
                  <th>Razón Social</th>
                  <th width="10%">Seleccionar</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="contact in contactsFilteredAndSorted">
                  <td>{{ idtypes.find(t => t.id === contact.id_type).name }} {{ contact.id_number }}</td>
                  <td>{{ contact.invoice_contact.legal_name }}</td>
                  <td style="text-align: center">
                    <button @click="selectContact(contact)">
                      <span class="glyphicon glyphicon-ok"></span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" @click="dismiss">Close</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import deepAccess from '../../utils/js/deepAccess'

export default {
  name: 'contactListQuick',
  data () {
    return {
      idtypes: [{id: 'D', name: 'DNI'}, {id: 'T', name: 'CUIT'}, {id: 'L', name: 'CUIL'}],
      search_params: { id_type: '', id_number: '', legal_name: '' }
    }
  },

  computed: {
    contactsFilteredAndSorted () {
      let vm = this
      let list2 = JSON.parse(JSON.stringify(this.contacts))

      list2 = list2.filter(function (value) {
        if (vm.search_params.id_type === '') {
          return true
        } else {
          return value.id_type === vm.search_params.id_type
        }
      })

      list2 = list2.filter(function (value) {
        if (vm.search_params.id_number === '') {
          return true
        } else {
          return value.id_number.indexOf(vm.search_params.id_number)
        }
      })

      list2 = list2.filter(function (value) {
        let haystack = value.invoice_contact.legal_name.toLowerCase()
        let needle = vm.search_params.legal_name.toLowerCase()

        if (vm.search_params.legal_name === '') {
          return true
        } else {
          return haystack.indexOf(needle) >= 0
        }
      })

      return list2.sort(function (a, b) {
        return deepAccess(a, 'invoice_contact.legal_name')
                .localeCompare(deepAccess(b, 'invoice_contact.legal_name'))
      })
    }
  },

  methods: {
    dismiss () {
      window.jQuery('#listContactModal').modal('hide')
    },

    open () {
      window.jQuery('#listContactModal').modal({backdrop: 'static'})
    },

    selectContact (contact) {
      this.$emit('input', contact)
      this.dismiss()
    }
  },

  vuex: {
    getters: {
      contacts: state => state.contacts.all
    }
  }
}
</script>

<style scoped>
.glyphicon {
  margin-top: 6px;
}
</style>
