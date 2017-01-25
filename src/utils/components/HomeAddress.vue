<template>
  <div>
    <div class="col-xs-12">
      <label>
        Domicilio
      </label>
      <input placeholder="Ej. Av. de Mayo 1773" v-if="editing" class="form-control" v-model="address.street_address"/>
      <p v-if="!editing">{{ address.street_address | default('-') }}</p>
    </div>
    <div class="col-xs-4">
      <label for="floor">
        Piso
        <input placeholder="Ej. 7" v-if="editing" class="form-control" v-model="address.floor_number"/>
      </label>
      <p v-if="!editing">{{ address.floor_number | default('-') }}</p>
    </div>
    <div class="col-xs-4">
      <label>
        Dpto
        <input v-if="editing" class="form-control" v-model="address.apartment_number"/>
      </label>
      <p v-if="!editing">{{ address.apartment_number | default('-') }}</p>
    </div>
    <div class="col-xs-4">
      <label>
        CP
        <input v-if="editing" class="form-control" v-model="address.postal_code"/>
      </label>
      <p v-if="!editing">{{ address.postal_code | default('-') }}</p>
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
<style>
</style>
