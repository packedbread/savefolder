<template>
  <div>
    <form v-on:submit.prevent="login_submit()">
      <span>Enter e-mail:</span>
      <input type="text" placeholder="e-mail" required>
      <span>And password:</span>
      <input type="password" placeholder="password" required>
      <button type="submit">Log in</button>
      <label>{{ error }}</label>
    </form>
  </div>
</template>

<script>
export default {
  
}
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


