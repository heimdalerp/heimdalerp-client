<template>
  <div>
    <div class="col-xs-12">
      <label>Localidad</label>
    </div>
    <div v-if="editing" class="col-xs-12">
      <div class="col-xs-4">
        <select class="form-control col-xs-4" v-model="country">
          <option v-for="country in countries" :value="country">{{ country.default_name }}</option>
        </select>
      </div>
      <div class="col-xs-4">
        <select class="form-control col-xs-4" v-model="region">
          <option v-for="region in regions" :value="region">{{ region.default_name }}</option>
        </select>
      </div>
      <div class="col-xs-4">
        <select class="form-control col-xs-4" v-model="locality">
          <option v-for="locality in localities" :value="locality">{{ locality.default_name }}</option>
        </select>
      </div>
    </div>
    <div class="col-xs-12" v-else>
      <p>{{ `${this.locality.default_name}, ${this.region.default_name}, ${this.country.default_name}` }}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: ['editing', 'value'],
  data () {
    return {
      countries: [],
      regions: [],
      localities: [],
      country: {},
      region: {}
    }
  },
  computed: {
    locality: {
      get () {
        return this.value || {}
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  created: function () {
    this.$http.get('geo/countries/').then((response) => {
      this.countries = response.data.results
    })
  },
  watch: {
    // When the country changes, show its regions
    country (country) {
      this.$http.get(country.regions).then((response) => {
        this.regions = response.data.results
      })
    },
    // When the region changes, show its localities
    region (region) {
      this.$http.get(region.localities).then((response) => {
        this.localities = response.data.results
      })
    },
    value (value) {
      // When the parent gives us a locality, get its region and country
      if (typeof value === 'object') {
        this.$http.get(value.region).then((response) => {
          this.region = response.data
          this.country = this.countries.find((c) => c.url === this.region.country)
          // Get the regions for this country
          this.$http.get(this.country.regions).then((response) => {
            this.regions = response.data.regions
          })
          // And the localities for that region
          this.$http.get(this.region.localities).then((response) => {
            this.localities = response.data.localities
          })
        })
      }
    }
  }
}
</script>
<style scoped>
.col-xs-4 {
  padding: 0;
}
</style>
