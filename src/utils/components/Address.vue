<template>
  <div>
    <div class="col-xs-12">
      <label>Domicilio</label>
      <input id="addr" placeholder="Ej. Av. de Mayo 1773" v-if="editing" class="form-control" type="text" name="address" v-model="street_address"/>
      <p v-if="!editing">{{ street_address | default '-'}}</p>
    </div>
    <div class="col-xs-4">
      <label for="floor">Piso</label>
      <input id="addr" placeholder="Ej. 7" v-if="editing" class="form-control" type="text" name="address" v-model="floor_number"/>
      <p v-if="!editing">{{ floor_number | default '-' }}</p>
    </div>
    <div class="col-xs-4">
      <label for="apartment">Dpto</label>
      <input id="addr" v-if="editing" class="form-control" type="text" name="address" v-model="apartment_number"/>
      <p v-if="!editing">{{ apartment_number | default '-' }}</p>
    </div>
    <div class="col-xs-4">
      <label for="postal">CP</label>
      <input id="addr" v-if="editing" class="form-control" type="text" name="address" v-model="postal_code"/>
      <p v-if="!editing">{{ postal_code }}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: ['editing', 'value'],
  data () {
    return {
      street_address: null,
      postal_code: null,
      floor_number: null,
      apartment_number: null
    }
  },
  computed: {
    address () {
      return {
        street_address: this.street_address,
        postal_code: this.postal_code,
        floor_number: this.floor_number,
        apartment_number: this.apartment_number
      }
    }
  },
  watch: {
    value (address) {
      this.street_address = address.street_address
      this.postal_code = address.postal_code
      this.floor_number = address.floor_number
      this.apartment_number = address.apartment_number
    },
    address (address) {
      this.$emit('update', address)
    }
  }
}
</script>
<style>
</style>
