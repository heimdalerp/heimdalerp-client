var localStorage = require('localStorage')
import Vue from 'vue'

export default {
  // User object will let us check authentication status
  user: {
    authenticated: false,
    username: '',
    company: 'http://localhost:8000/api/persons/companies/1/',
    company_ar: 'http://localhost:8000/api/invoice_ar/companies/1/'
  },

  login (vuecontext, creds, redirect) {
    vuecontext.$http.post('api-token-auth/', creds).bind(this).then(function (response) {
      localStorage.setItem('id_token', response.body.token)
      console.log(response.json())
      localStorage.setItem('username', creds.username)
      this.user.authenticated = true
      this.user.username = creds.username

      vuecontext.$router.go('/')
    }, function (response) {
      switch (response.status) {
        case 0:
          vuecontext.errors.other = 'No se pudo contactar al servidor'
          break
        case 400:
          vuecontext.errors.other = 'Usuario o contraseña incorrectos'
          break
        default:
          vuecontext.errors.other = 'Error desconocido'
      }
      let errors = response.data
      Vue.set(vuecontext.errors, 'username', errors.username)
      Vue.set(vuecontext.errors, 'password', errors.password)
    })
  },

  logout () {
    localStorage.removeItem('id_token')
    this.user.authenticated = false
  },

  checkAuth () {
    var jwt = localStorage.getItem('id_token')
    if (jwt) {
      this.user.authenticated = true
      this.user.username = localStorage.getItem('username')
    } else {
      this.user.authenticated = false
    }
  },

  getAuthHeader () {
    return 'JWT ' + localStorage.getItem('id_token')
  }
}
