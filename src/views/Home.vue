<template>
  <div id="home">
    <img src="@/assets/obi-wan-hello-there.jpg" alt="Hello there">
    <h1>Hello there!</h1>
    <h2>This is Savefolder - a right place to store your internet memes.</h2>
    <p>You can upload pictures and add search tags to them in Savefolder</p>
    <p>You can view and search all uploaded images in Viewfolder</p>
    <p>Also you can edit image tags in Viewfolder</p>
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
</style>

