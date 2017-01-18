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
    // Contacts module
    { path: '/contacts', component: require('components/contacts/main'),
      children: [
        { path: '', component: require('components/contacts/list') },
        { path: 'prefs', component: require('components/contacts/prefs') },
        { path: ':contactId', component: require('components/contacts/view') }
      ]
    },
    //   '/contacts/': {
    //     component: require('components/contacts/main'),
    //     subRoutes: {
    //       '/': {
    //         component: require('components/contacts/list')
    //       },
    //       '/:contactId/': {
    //         component: require('components/contacts/view')
    //       },
    //       '/prefs/': {
    //         component: require('components/contacts/prefs')
    //       }
    //     }
    //   },
    // System routes
    { path: '/', component: require('components/ApplicationSwitcher') },
    { path: '/login', component: require('components/Login') },
    { path: '*', redirect: '/' }
  ]
})

// router.map({
//   '/login/': {
//     component: require('components/Login')
//   },
//   '/': {
//     component: require('components/ApplicationSwitcher')
//   },
//
//   '/accounting/': {
//     component: require('components/accounting/main'),
//     subRoutes: {
//       '/billing/': {
//         component: require('components/accounting/billingList')
//       },
//       '/billing/:paymentId/': {
//         component: require('components/accounting/billingView')
//       },
//       '/credits/': {
//         component: require('components/accounting/creditsList')
//       },
//       '/credits/:invoiceId/': {
//         component: require('components/accounting/creditsView')
//       },
//       '/debits/': {
//         component: require('components/accounting/debitsList')
//       },
//       '/invoices/': {
//         component: require('components/accounting/invoicesList')
//       },
//       '/invoices/:invoiceId/': {
//         component: require('components/accounting/invoicesView')
//       },
//       '/ledger/': {
//         component: require('components/accounting/ledgerList')
//       },
//       '/ledger/:contactId/': {
//         component: require('components/accounting/ledgerView')
//       },
//       '/pointsofsale/': {
//         component: require('components/accounting/posList')
//       },
//       '/pointsofsale/:posId': {
//         component: require('components/accounting/posView')
//       }
//     }
//   },
//
//   '/contacts/': {
//     component: require('components/contacts/main'),
//     subRoutes: {
//       '/': {
//         component: require('components/contacts/list')
//       },
//       '/:contactId/': {
//         component: require('components/contacts/view')
//       },
//       '/prefs/': {
//         component: require('components/contacts/prefs')
//       }
//     }
//   },
//
//   'inventory': {
//     component: require('components/inventory/main'),
//     subRoutes: {
//       '/': {
//         component: require('components/inventory/productList')
//       },
//       '/products/:productId': {
//         component: require('components/inventory/productView')
//       }
//     }
//   }
// })

// router.redirect({
//   '*': '/'
// })

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

// router.beforeEach(function (transition) {
//   auth.checkAuth()
//   Vue.http.headers.common['Authorization'] = auth.getAuthHeader()
//   Vue.http.headers.common['Accept-Language'] = 'es'
//   if (transition.to.path !== '/login' && !auth.user.authenticated) {
//     router.push('/login')
//   } else if (transition.to.path === '/login' && auth.user.authenticated) {
//     router.push('/')
//   }
//   transition.next()
// })

// Set up the error notification hub
export var eventHub = new Vue()

// Load filters
Vue.filter('default', function (value, _default) {
  return value || _default
})

// Load ulil components
Vue.component('Address', require('src/utils/components/Address.vue'))
Vue.component('ButtonBar', require('src/utils/components/ButtonBar.vue'))
Vue.component('Locality', require('src/utils/components/Locality.vue'))
Vue.component('OneToOne', require('src/utils/components/OneToOne.vue'))
Vue.component('OneToOneNext', require('src/utils/components/OneToOneNext.vue'))

// Showtime
// window.addEventListener('load', function () {
//   router.start(App, 'app')
// })

new Vue({ // eslint-disable-line no-new
  el: 'app',
  router: router,
  render: h => h(App)
})
