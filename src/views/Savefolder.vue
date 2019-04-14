<template>
  <div id="savefolder">
    <div id="image-wrapper">
      <span></span>
      <img src="@/assets/obi-wan-hello-there.jpg">
    </div>
    <button id="upload">Upload</button>
    <button id="save">Save</button>
    <div id="tags-wrapper">
      <input id="new-tag" type="text" placeholder="Type to add new tag...">
      <div id="image-tags">
        <!--<div class="tag">Tag</div>-->
      </div>
    </div>
    <div id="external-wrapper">
      <input type="text" placeholder="Type to search tags...">
      <div id="external-tags">
      </div>
    </div>
  </div>
</template>

<script>
import firebase from '../firebase'

let database = firebase.database();

export default {
  
}
</script>

<style scoped>
#savefolder {
  min-height: 0;
  display: grid;
  grid-template: 
    "i i e" 1fr
    "u s e" 50px
    "t t e" 1fr 
    / 1fr 1fr 2fr;
  grid-gap: 10px;
}

#image-wrapper {
  grid-area: i;
}

span {
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}

img {
  object-fit: contain;
  width: 100%;
  max-height: 100%;
  vertical-align: middle;
}

#tags-wrapper {
  grid-area: t;

  min-height: 0;
  
  display: flex;
  flex-direction: column;
}

#image-tags {
  overflow-y: auto;
}

#upload {
  grid-area: u;
}

#save {
  grid-area: s;
}

#external-wrapper {
  grid-area: e;

  min-height: 0;

  display: flex;
  flex-direction: column;
}

#external-tags {
  overflow-y: auto;
}

input {
  margin: 10px;
}

.tag {
  padding: 10px;
  margin: 10px;
}

</style>
