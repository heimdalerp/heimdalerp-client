<template>
  <div class="row">
    <div class="col-xs-12">

      <div class="row">
        <div class="col-xs-12">
          <div class="form-group">
            <label>
              Domicilio
            </label>
            <input placeholder="Ej. Av. de Mayo 1773" v-if="editing" class="form-control" v-model="address.street_address"/>
            <p v-if="!editing">{{ address.street_address | default('-') }}</p>
          </div>
        </div>
      </div>

      <div class="row no-padding">
        <div class="col-xs-4">
          <div class="form-group">
            <label>
              Piso
            </label>
            <input placeholder="Ej. 7" v-if="editing" class="form-control" v-model="address.floor_number">
            <p v-if="!editing">{{ address.floor_number | default('-') }}</p>
          </div>
        </div>
        <div class="col-xs-4">
          <div class="form-group">
            <label>
              Dpto
            </label>
            <input v-if="editing" class="form-control" v-model="address.apartment_number">
            <p v-if="!editing">{{ address.apartment_number | default('-') }}</p>
          </div>
        </div>
        <div class="col-xs-4">
          <div class="form-group">
            <label>
              CP
            </label>
            <input v-if="editing" class="form-control" v-model="address.postal_code">
            <p v-if="!editing">{{ address.postal_code | default('-') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HomeAddress',
  props: ['editing', 'value'],
  computed: {
    address: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>
