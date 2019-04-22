<template>
  <div id="app">
    <div id="header">
      <router-link class="router-link" to="/">Home</router-link>
      <template v-if="user !== null">
        <router-link class="router-link" to="/savefolder">Savefolder</router-link>
        <router-link class="router-link" to="/viewfolder">Viewfolder</router-link>
        <router-link class="router-link" to="/cloudfolder">Cloudfolder</router-link>
      </template>
      <router-link class="router-link" to="/about">About</router-link>
      <div class="filler"></div>
      <template v-if="user === null">
        <router-link class="router-link" to="/login">Log in</router-link>
        <router-link class="router-link" to="/signup">Sign up</router-link>
      </template>
      <template v-if="user !== null">
        <p>{{ user.email }}</p>
        <router-link class="router-link" to="/settings">Settings</router-link>
        <a v-on:click="logout" class="router-link">Log out</a>
      </template>
    </div>
    <router-view v-on:update="update" class="page"/>
  </div>
</template>

<script>
import firebase from './firebase';

let auth = firebase.auth();

export default {
  name: 'app',
  created: function () {
    auth.onAuthStateChanged(user => { this.user = user; });
  },
  data: function () {
    return {
      user: null
    };
  },
  methods: {
    update: function (data) {
      for (let v in data) {
        if (this[v] !== undefined) {
          this[v] = data[v];
        }
      }
    },
    logout: function () {
      auth.signOut().then(() => {
        this.$router.push('/');
      });
    }
  }
};
</script>

<style>
* {
  margin: 0px;
  padding: 0px;
  border: 0px;
  font-family: "Ubuntu Mono", monospace;
  font-size: 15pt;
}

html, body {
  width: 100%;
  height: 100%;
}

#app {
  background-color: #b4cfec;
  height: 100%;
  display: flex;
  flex-direction: column;
}

button, input {
  outline: none;
  padding: 10px;
  background: #a0bbd8;
}
button:active {
  background: #96b1ce;
}

.page {
  flex-grow: 1;
  padding: 10px;
}

#header {
  height: 50px;
  min-height: 50px;
  display: flex;
  background-color: #8ca7c4;
}

.filler {
  flex-grow: 1;
}

#header a {
  text-align: center;
  box-sizing: border-box;
  width: 150px;
  min-width: 150px;
  height: 50px;
  min-height: 50px;
  padding: 15px;
  color: black;
  background-color: #a0bbd8;
  text-decoration: none;
  cursor: pointer;
}

#header a.router-link-exact-active {
  background-color: #96b1ce;
}

p {
  padding: 15px;
}

.spinner {
  display: flex;
  padding: 20px;
}
</style>
