<template>
  <div id="wrapper">
    <div class="col-sm-4 col-sm-offset-4" id="loginbox" @keyup.enter="submit">
      <img id="imglogo" src="/static/logo.png" alt="Logo">
      <hr>
      <div>
        <div class="alert alert-danger" v-if="errors.other">
          <p>{{ errors.other }}</p>
        </div>
        <div class="form-group" v-bind:class="{ 'has-error': errors.username }">
          <label class="control-label" for="username">Usuario</label>
          <input
            type="text"
            id="username"
            class="form-control"
            placeholder="Tu nombre de usuario"
            v-model="credentials.username"
          />
          <span v-if="errors.username" class="help-block">{{ errors.username }}</span>
        </div>
        <div class="form-group" v-bind:class="{ 'has-error': errors.password }">
          <label class="control-label" for="password">Contraseña</label>
          <input
            id="password"
            type="password"
            class="form-control"
            placeholder="Tu contraseña"
            v-model="credentials.password"
          />
          <span v-if="errors.password" class="help-block">{{ errors.password }}</span>
        </div>
        <button type="button" class="btn btn-primary" @click="submit()">Acceder</button>
      </div>
    </div>
  </div>
</template>

<script>
import auth from '../auth'
export default {
  name: 'Login',
  data () {
    return {
      credentials: {
        username: '',
        password: ''
      },
      errors: []
    }
  },
  methods: {
    submit () {
      var credentials = {
        username: this.credentials.username,
        password: this.credentials.password
      }

      auth.login(this, credentials, '/')
    }
  }
}
</script>

<style scoped>
#loginbox {
  text-align: center;
  background-color: #fff;
  padding-bottom: 10px;
  border: 1px solid #999;
  box-shadow: 0 3px 9px rgba(0, 0, 0, .5);
}

#imglogo {
  padding: 20px 10px 0px 10px;
}

.form-group {
  text-align: left;
}

#wrapper {
  height: 100%;
  width: 100%;
  background-image: url('../assets/loginbg.png');
}
</style>
