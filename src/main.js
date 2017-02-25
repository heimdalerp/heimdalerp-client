import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import auth from './auth/index'

window.login_url = 'http://localhost:8000/'
window.api_url = 'http://localhost:8000/api/'

Vue.use(VueResource)
// Intercept all responses and check for authentication failure
Vue.http.interceptors.push(function (request, next) {
  eventHub.$emit('loading')

  if (request.url === 'api-token-auth/') {
    request.url = window.login_url + request.url
  } else {
    if (request.url.substring(0, 4) !== 'http') {
      request.url = window.api_url + request.url
    }
  }

  next((response) => {
    eventHub.$emit('doneLoading')
    if (response.status === 401) {
      auth.logout()
      auth.user.authenticated = false
      router.push('/login')
    } else if (response.status < 200 || response.status >= 300) {
      console.log(response.handled)
      if (!response.handled) {
        if (response.data === '') {
          eventHub.$emit('showError', 'Error desconocido')
        } else {
          eventHub.$emit('showError', JSON.stringify(response.data))
        }
      }
    }
    return response
  })
})

Vue.use(VueRouter)
export const router = new VueRouter({
  routes: [
    // Accounting module
    { path: '/accounting', component: require('components/accounting/main'),
      children: [
        { path: 'billing', component: require('components/accounting/billingList') },
        { path: 'billing/:paymentId', component: require('components/accounting/billingView') },
        { path: 'credits', component: require('components/accounting/creditsList') },
        { path: 'credits/:invoiceId', component: require('components/accounting/creditsView') },
        { path: 'invoices', component: require('components/accounting/invoicesList') },
        { path: 'invoices/:invoiceId', component: require('components/accounting/invoicesView') },
        { path: 'ledger', component: require('components/accounting/ledgerList') },
        { path: 'ledger/:contactId', component: require('components/accounting/ledgerView') },
        { path: 'pointsofsale', component: require('components/accounting/posList') },
        { path: 'pointsofsale/:posId', component: require('components/accounting/posView') }
      ]
    },

    //       '/debits/': {
    //         component: require('components/accounting/debitsList')
    //       },

    // Contacts module
    { path: '/contacts', component: require('components/contacts/main'),
      children: [
        { path: '', component: require('components/contacts/list') },
        { path: 'prefs', component: require('components/contacts/prefs') },
        { path: ':contactId', component: require('components/contacts/view') }
      ]
    },

    // Inventory module
    { path: '/inventory', component: require('components/inventory/main'),
      children: [
        { path: '', component: require('components/inventory/productList') },
        { path: 'products/:productId', component: require('components/inventory/productView') }
      ]
    },

    // System routes
    { path: '/', component: require('components/ApplicationSwitcher') },
    { path: '/login', component: require('components/Login') },
    { path: '*', redirect: '/' }
  ]
})

// Check if we're still authenticated
router.beforeEach((to, from, next) => {
  auth.checkAuth()
  Vue.http.headers.common['Authorization'] = auth.getAuthHeader()
  Vue.http.headers.common['Accept-Language'] = 'es'
  if (to.path !== '/login' && !auth.user.authenticated) {
    router.push('/login')
  } else if (to.path === '/login' && auth.user.authenticated) {
    router.push('/')
  }
  next()
})

// Set up the error notification hub
export var eventHub = new Vue()
Vue.prototype.eventHub = eventHub

// Load ulil components
Vue.component('HomeAddress', require('src/utils/components/HomeAddress.vue'))
Vue.component('ButtonBar', require('src/utils/components/ButtonBar.vue'))
Vue.component('Locality', require('src/utils/components/Locality.vue'))
Vue.component('OneToOne', require('src/utils/components/OneToOne.vue'))

Vue.filter('default', function (value, _default) {
  return value || _default
})

new Vue({ // eslint-disable-line no-new
  el: 'app',
  router: router,
  render: h => h(App)
})
