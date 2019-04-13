<template>
  <div id="app">
    <div id="header">
      <router-link class='router-link' to="/">Home</router-link>
      <router-link class='router-link' to="/savefolder">Savefolder</router-link>
      <router-link class='router-link' to="/viewfolder">Viewfolder</router-link>
      <router-link class='router-link' to='/about'>About</router-link>
      <div class='filler'></div>
      <template v-if='user === null'>
        <router-link class='router-link' to="/login">Log in</router-link>
        <router-link class='router-link' to='/signup'>Sign up</router-link>
      </template>
      <template v-if='user !== null'>
        <router-link class='router-link' to='/settings'>Settings</router-link>
      </template>
    </div>
    <router-view class="page"/>
  </div>
</template>

<script>
export default {
  name: 'app',
  data: function () {
    return {
      user: null
    }
  }
}
</script>

<style>
#app {
  background-color: #b4cfec;
  
  height: 100%;

  margin: 0;
  border: 0;
  padding: 0;

  display: flex;
  flex-direction: column;
}

button, input {
  outline: none;
  padding: 10px;
  background: #A0BBD8;
}
button:active {
  background: #96B1CE;
}

.page {
  flex-grow: 1;
}

#header {
  height: 50px;
  display: flex;
  background-color: #8ca7c4;
}

.filler {
  flex-grow: 1;
}

#header a {
  text-align: center;
  width: 100px;
  padding: 15px;
  color: black;
  background-color: #a0bbd8;
  text-decoration: none;
}

#header a.router-link-exact-active {
  background-color: #96b1ce;
}
</style>
