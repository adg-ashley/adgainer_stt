<template>
  <div>
    <form class="loginForm">
      <h4>Login</h4>
      <div style="padding-bottom: 10px;">
        <q-field
          error-label="We need a valid username"
        >
        <q-input
          v-model="form.username"
          float-label="Username"
          />
        </q-field>
      </div>
      <div style="padding-bottom: 10px;">
        <q-field
          error-label="We need a valid password"
          placeholder="Password"
        >
        
        <q-input
          type="password"
          v-model="form.password"
          float-label="Password" />
        </q-field>
      </div>
      <div style="padding-bottom: 10px;">
        <q-btn 
        color="primary"
        class="full-width"
        v-on:click.prevent="validateSttUser()">Login</q-btn>
      </div>
      <div style="padding-bottom: 10px;">
        <q-btn
          class="full-width"
          v-on:click.prevent="validateAdUser()">Login via ADGainer
        </q-btn>
      </div>
      <div style="float: right;">
        <router-link to="signup">Sign Up</router-link>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    validateSttUser () {
      var querystring = require('querystring')
      this.$axios.post('/stt/auth/login', querystring.stringify(this.form), {
        headers: {'Content-type': 'application/x-www-form-urlencoded'}
      }).then(response => {
            const data = response.data
            if (data.user.token) {
              this.$store.commit('STT/USER/SET_USER', data.user)
              this.$router.push('/')
            }
          })
          .catch(error => {
            this.$q.notify({
              type: 'warning',
              message: 'Incorrect Username or Password!'
            })
          })
    }
  }
}
</script>

<style>
  .loginForm {
    margin-left: 25%;
    margin-right: 25%;
    width: 50%;
  }
</style>
