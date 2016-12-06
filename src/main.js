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
  this.$dispatch('loading')

  if (request.url === 'api-token-auth/') {
    request.url = window.login_url + request.url
  } else {
    if (request.url.substring(0, 4) !== 'http') {
      request.url = window.api_url + request.url
    }
  }

  next((response) => {
    this.$dispatch('doneLoading')
    if (response.status === 401) {
      auth.logout()
      auth.user.authenticated = false
      router.go('/login')
    } else if (response.status < 200 || response.status >= 300) {
      if (response.data === '') {
        this.$dispatch('showError', 'Error desconocido')
      } else {
        this.$dispatch('showError', JSON.stringify(response.data))
      }
    }
    return response
  })
})

Vue.use(VueRouter)
export var router = new VueRouter()

router.map({
  '/login/': {
    component: require('components/Login')
  },
  '/': {
    component: require('components/ApplicationSwitcher')
  },

  '/accounting/': {
    component: require('components/accounting/main'),
    subRoutes: {
      '/billing/': {
        component: require('components/accounting/billingList')
      },
      '/billing/:paymentId/': {
        component: require('components/accounting/billingView')
      },
      '/ledger/': {
        component: require('components/accounting/ledgerList')
      },
      '/ledger/:contactId/': {
        component: require('components/accounting/ledgerView')
      },
      '/invoices/': {
        component: require('components/accounting/invoicesList')
      },
      '/invoices/:invoiceId/': {
        component: require('components/accounting/invoicesView')
      },
      '/pointsofsale/': {
        component: require('components/accounting/posList')
      },
      '/pointsofsale/:posId': {
        component: require('components/accounting/posView')
      }
    }
  },

  '/contacts/': {
    component: require('components/contacts/main'),
    subRoutes: {
      '/': {
        component: require('components/contacts/list')
      },
      '/:contactId/': {
        component: require('components/contacts/view')
      },
      '/prefs/': {
        component: require('components/contacts/prefs')
      }
    }
  },

  'inventory': {
    component: require('components/inventory/main'),
    subRoutes: {
      '/': {
        component: require('components/inventory/productList')
      },
      '/products/:productId': {
        component: require('components/inventory/productView')
      }
    }
  }
})

router.redirect({
  '*': '/'
})

// Check if we're still authenticated
router.beforeEach(function (transition) {
  auth.checkAuth()
  Vue.http.headers.common['Authorization'] = auth.getAuthHeader()
  Vue.http.headers.common['Accept-Language'] = 'es'
  if (transition.to.path !== '/login' && !auth.user.authenticated) {
    router.go('/login')
  } else if (transition.to.path === '/login' && auth.user.authenticated) {
    router.go('/')
  }
  transition.next()
})

Vue.filter('default', function (value, _default) {
  return value || _default
})

// Showtime
window.addEventListener('load', function () {
  router.start(App, 'app')
})
