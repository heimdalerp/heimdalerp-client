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
  props: ['editing', 'url'],
  data () {
    return {
      countries: [],
      regions: [],
      localities: [],
      country: {},
      region: {},
      locality: {}
    }
  },
  created: function () {
    this.$http.get('geo/countries/').then((response) => {
      this.countries = response.data.results
    })
  },
  watch: {
    country (country) {
      this.$http.get(country.regions).then((response) => {
        this.regions = response.data.results
      })
    },
    region (region) {
      this.$http.get(region.localities).then((response) => {
        this.localities = response.data.results
      })
    },
    locality (locality) {
      this.$emit('update', locality.url)
    },
    url (url) {
      // Get this locality
      if (url) {
        this.$http.get(url).then((response) => {
          this.locality = response.data
          // Get its region
          this.$http.get(this.locality.region).then((response) => {
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
