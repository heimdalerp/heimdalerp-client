<template>
  <div>
    <nav v-if="user.authenticated" class="navbar navbar-default">
      <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <span v-if="$route.path === '/' && hasPrevious" class="navbar-brand glyphicon glyphicon-chevron-left" @click="goBack()" ></span>
          <router-link v-if="$route.path !== '/'" class="navbar-brand glyphicon glyphicon-home" to="'/'"></router-link>
          <span v-if="$route.path !== '/'" class="navbar-brand">{{currentApp}}</span>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul v-if="$route.path !== '/'"  class="nav navbar-nav">
            <li v-for="subMenuElement in subMenuElements" v-bind:class="{'dropdown': subMenuElement.subElements}">
              <!-- It's a flat submenu -->
              <router-link v-if="!subMenuElement.subElements" :to="subMenuElement.link">{{subMenuElement.name}}</router-link>
              <!-- It's a dropdown submenu -->
              <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{{subMenuElement.name}} <span class="caret"></span></a>
              <ul class="dropdown-menu">
                <li v-for="subSubMenuElement in subMenuElement.subElements"><router-link to="subSubMenuElement.link">{{subSubMenuElement.name}}</router-link></li>
              </ul>
            </li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li><a href="#">{{ user.username }}<span class="glyphicon glyphicon-user"></span></a></li>
            <li><a @click="logout()"><span class="glyphicon glyphicon-log-out"></span></a></li>
          </ul>
        </div><!-- /.navbar-collapse -->
      </div><!-- /.container-fluid -->
    </nav>
    <div id="oe" class="container-fluid">
      <router-view></router-view>
    </div>

    <!-- Error -->
    <div class="modal fade" id="errorModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel">Ha ocurrido un error</h4>
          </div>
          <div class="modal-body">
            {{ errorModal.errorMsg }}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div id="loading" class="modal" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
  		<div class="modal-dialog modal-m">
    		<div class="modal-content">
    			<div class="modal-header">
            <h3 style="margin:0;">Cargando...
            </h3>
          </div>
    			<div class="modal-body">
    			 <div class="progress progress-striped active" style="margin-bottom:0;">
             <div class="progress-bar" style="width: 100%">
             </div>
            </div>
    			</div>
    		</div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from './auth/index.js'
import store from './vuex/store'
import { eventHub } from './main'

export default {
  store,
  data () {
    return {
      currentApp: '',
      subMenuElements: {},
      user: auth.user,
      errorModal: {
        errorMsg: ''
      },
      loadingQueue: 0
    }
  },
  created () {
    eventHub.$on('showError', this.showError)
    eventHub.$on('loading', this.loading)
    eventHub.$on('doneLoading', this.doneLoading)
  },
  methods: {
    logout () {
      auth.logout()
      this.$router.push('login')
    },
    showError (msg) {
      this.errorModal.errorMsg = msg
      jQuery('#errorModal').modal('show') //eslint-disable-line
    },
    loading () {
      this.loadingQueue++
      if (this.loadingQueue === 1) {
        jQuery('#loading').modal('show') //eslint-disable-line
      }
    },
    doneLoading () {
      this.loadingQueue--
      if (this.loadingQueue < 1) {
        jQuery('#loading').modal('hide') //eslint-disable-line
      }
    }
  }
}
</script>

<style scoped>
.glyphicon-user {
  margin-left: 0.4em;
}

nav {
  margin-bottom: 0px !important;
}

#oe {
  position: absolute;
  top: 50px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  padding: 0 0 0 0;
  background-color: #434857;
  overflow: auto;
}
</style>

<style>
html, body {
  height: 100% !important;
  margin: 0px;
  background-image: url('assets/loginbg.png');
}

.jumbotron {
  padding-top: 20px;
  margin: 5px 100px auto 100px;
  border-radius: 0px !important;
  background-color: white;
}

/* Navbar styling */
.navbar {
  background-color: #293a46;
  border-radius: 0;
  border: 0px;
}

.navbar-brand {
  color: white !important;
}

.navbar-nav li a {
  color: white !important;
}

.dropdown-menu li a {
  color: black !important;
}

.navbar-default .navbar-nav>.open>a, .navbar-default .navbar-nav>.open>a:focus, .navbar-default .navbar-nav>.open>a:hover {
  background-color: #1ca8dd;
}

.btn {
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 0px;
}

/* Hack so href="#" is not needed*/
a {
  cursor: pointer;
}

/* Table styling */
th {
  background-color: #e2e2e0;
}

/* No content box */
.no-content {
  width: 600px;
  margin-top: 10px;
  margin-left: 10px;
  padding: 10px 10px 10px 10px;
  background-color: white;
  font-weight: bold;
  color: gray;
}

.no-content:after {
  content: "No hay vista configurada para este menú o el filtro de búsqueda es incompatible.";
}

table {
  background-color: white;
}


/* Tagsinput styling */
.bootstrap-tagsinput {
    width: 100%;
}

.accordion {
    margin-bottom:-3px;
}

.accordion-group {
    border: none;
}

.twitter-typeahead .tt-query,
.twitter-typeahead .tt-hint {
    margin-bottom: 0;
}

.twitter-typeahead .tt-hint
{
    display: none;
}

.tt-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    display: none;
    float: left;
    min-width: 160px;
    padding: 5px 0;
    margin: 2px 0 0;
    list-style: none;
    font-size: 14px;
    background-color: #ffffff;
    border: 1px solid #cccccc;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
    background-clip: padding-box;
    cursor: pointer;
}

.tt-suggestion {
    display: block;
    padding: 3px 20px;
    clear: both;
    font-weight: normal;
    line-height: 1.428571429;
    color: #333333;
    white-space: nowrap;
}

.tt-suggestion:hover,
.tt-suggestion:focus {
  color: #ffffff;
  text-decoration: none;
  outline: 0;
  background-color: #428bca;
}
</style>
