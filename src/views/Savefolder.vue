<template>
  <div id="savefolder">
    <div id="image-wrapper">
      <span></span>
      <img v-if="image !== null" v-bind:src="image.data">
    </div>
    <input v-on:change="upload" ref="upload" id="upload-input" type="file"> 
    <button v-on:click="$refs.upload.click();" id="upload">Upload</button>
    <button v-on:click="save" id="save">Save</button>
    <div id="tags-wrapper">
      <input v-on:change="add_new_tag" v-model="new_tag" type="text" placeholder="Type to add new tag...">
      <div ref="tags" id="image-tags">
        <template v-for="tag in image_tags">
          <button v-on:click="remove_tag(tag)" v-bind:key="tag" class="tag">{{ tag }}</button>
        </template>
      </div>
    </div>
    <div id="external-wrapper">
      <input v-on:input="search_tags" v-model="search_request" type="text" placeholder="Type to search tags...">
      <div ref="external-tags" id="external-tags">
        <template v-for="tag in search_results">
          <button v-on:click="add_tag(tag)" v-bind:key="tag" class="tag">{{ tag }}</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from '../firebase';

let database = firebase.database();
let storage = firebase.storage();

export default {
  created: function () {

  },
  data: function () {
    return {
      new_tag: '',
      search_request: '',
      image: null,
      image_tags: [],
      external_tags: [],
      search_results: []
    }
  },
  methods: {
    upload: function () {
      if (this.$refs.upload.files && this.$refs.upload.files[0]) {
        let reader = new FileReader();
        reader.onload = event => {
          this.image = {
            name: this.$refs.upload.files[0].name,
            data: event.target.result
          };
        };
        reader.readAsDataURL(this.$refs.upload.files[0])
      }
    },
    save: function () {
      
    },
    add_new_tag: function () {
      this.add_tag(this.new_tag);
      this.new_tag = '';
    },
    add_tag: function (tag) {
      if (!this.image_tags.includes(tag)) {
        this.image_tags.push(tag)
      }
    },
    remove_tag: function (tag) {
      let index = this.image_tags.indexOf(tag);
      if (index > -1) {
        this.image_tags.splice(index, 1);
      }
    },
    search_tags: function () {
      this.search_results = [];
      for (let tag in this.external_tags) {
        if (tag.includes(this.search_request) > -1) {
          this.search_results.push(tag);
        }
      }
    }
  }
};
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
  padding: 10px;
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

#upload-input {
  display: none;
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
  margin: 10px;
}

</style>
