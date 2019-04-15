<template>
  <div id="viewfolder">
    <div id="image-wrapper">
      <span></span>
      <img src="@/assets/obi-wan-hello-there.jpg">
    </div>
    <button id="delete">Delete</button>
    <button id="save">Save</button>
    <div id="tags-wrapper">
      <input id="new-tag" type="text" placeholder="Type to add new tag...">
      <div id="image-tags">
        <!--<div class="tag">Tag</div>-->
      </div>
    </div>
    <div id="external-wrapper">
      <input type="text" placeholder="Type to search images...">
      <div id="external-images">
      </div>
    </div>
  </div>
</template>

<script>
import firebase from '../firebase';

let database = firebase.database();
let storage = firebase.storage();

export default {
  data: function () {
    return {

    }
  }
};
</script>

<style scoped>
#viewfolder {
  min-height: 0;
  display: grid;
  grid-template:
    "i i e" 1fr
    "d s e" 50px
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

#delete {
  grid-area: d;
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

#external-images {
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
