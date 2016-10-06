import Vue from 'vue'
import Vuex from 'vuex'

import contacts from './modules/contacts'
import accounting from './modules/accounting'

Vue.use(Vuex)
Vue.config.debug = true

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    accounting,
    contacts
  },
  strict: debug
})
