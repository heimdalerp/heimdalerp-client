<template>
  <div id="ooe">
    <div class="apps">
      <template v-for="module in modules">
        <router-link :to="module.link" class="app">
          <img :src="'/static/' + module.icon + '.png'" />
          <div class="caption">{{module.name}}</div>
        </router-link>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      modules: [
        {name: 'Contabilidad', link: 'accounting', icon: 'accounting'},
        {name: 'Contactos', link: 'contacts', icon: 'contacts'},
        {name: 'Inventario', link: 'inventory', icon: 'inventory'}
      ]
    }
  }
}
</script>

<style scoped>
#ooe {
  padding-top: 44px;
  margin: 0 auto;
  height: 100%;
  width: 80%;
  align-items: center;
}

.apps {
  max-width: 768px;
}

.app {
  float: left;
  margin: 0 1.5% 15px;
  width: 13.66%;
  text-align: center;
}

.app > img {
  width: 100%;
  max-width: 80px;
  vertical-align: middle;
  border-radius: 8%;
}

.caption {
  display: block;
  margin-top: 8px;
  color: #e2e2e0;
  font-size: 14px;
  font-family: "Roboto";
}
</style>
