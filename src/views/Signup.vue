<template>
  <div>
    <form v-on:submit.prevent="submit()">
      <span>Enter e-mail:</span>
      <input v-model="email" type="text" placeholder="e-mail" required>
      <span>Password:</span>
      <input v-model="password" type="password" placeholder="password" required>
      <span>And repeat password:</span>
      <input v-model="repeat_password" type="password" placeholder="repeat password" required>
      <button type="submit">Sign up</button>
      <label>{{ error }}</label>
    </form>
  </div>
</template>

<script>
import firebase from '../firebase';
let auth = firebase.auth();

export default {
  data: function () {
    return {
      error: '',
      email: '',
      password: '',
      repeat_password: ''
    };
  },
  methods: {
    submit: async function () {
      this.error = '';

      if (this.password !== this.repeat_password) {
        this.error = 'Passwords do not match.';
        return;
      }

      await auth.createUserWithEmailAndPassword(this.email, this.password)
        .catch(e => { this.error = e.message; });
      this.email = '';
      this.password = '';
      this.repeat_password = '';

      if (auth.currentUser != null) {
        this.$emit('update', { user: auth.currentUser });
        this.$router.push('/');
      }
    }
  }
};
</script>

<style scoped>
form {
  align-self: center;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 10px;
  padding: 10px;
  margin: 10px;
}
span {
  padding: 10px;
  grid-column: 2;
}
input {
  padding: 10px;
  grid-column: 3;
}
button {
  grid-column: 2 / 4;
}
label {
  padding: 10px;
  grid-column: 2 / 4;
  text-align: center;
}
</style>
