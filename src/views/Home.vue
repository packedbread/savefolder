<template>
  <div id="home">
    <img src="@/assets/obi-wan-hello-there.jpg" alt="Hello there">
    <h1>Hello there!</h1>
    <h2>This is Savefolder - a right place to store your internet memes.</h2>
    <p>You can upload pictures and add search tags to them in <router-link to="/savefolder">Savefolder</router-link></p>
    <p>You can view and search all uploaded images in <router-link to="/viewfolder">Viewfolder</router-link></p>
    <p>Also you can edit image tags in <router-link to="/viewfolder">Viewfolder</router-link></p>
  </div>
</template>

<style scoped>
#home {
  padding: 10px;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-content: center;
}

h1 {
  font-size: 24pt;
  padding: 10px;
}
h2 {
  font-size: 20pt;
  padding: 10px;
}

p {
  font-size: 20pt;
  padding: 10px;
}

img {
  align-self: center;
  object-fit: contain;
  width: 50%;
  max-height: 100%;
}

a {
  font-size: inherit;
  text-align: center;
  color: black;
  text-decoration: none;
}
</style>
