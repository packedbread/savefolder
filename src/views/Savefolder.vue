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
      <div class="spinner" v-if="spinner">
        <div class="filler"></div>
        <self-building-square-spinner v-bind:animation-duration="6000" v-bind:size="40" color="#8ca7c4"/>
        <div class="filler"></div>
      </div>
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
import { SelfBuildingSquareSpinner } from 'epic-spinners';

let auth = firebase.auth();

export default {
  components: {
    SelfBuildingSquareSpinner
  },
  created: function () {
    let database = firebase.database();
    let storage = firebase.storage();

    this.db_images_ref = database.ref('images/');
    this.storage_ref = storage.ref('images/');

    this.db_images_ref.once('value', snapshot => {
      let tags = [];
      for (let key in snapshot.val()) {
        let current_tags = snapshot.val()[key].tags || [];
        for (let i = 0; i < current_tags.length; ++i) {
          let tag = current_tags[i];
          if (!tags.includes(tag)) {
            tags.push(tag);
          }
        }
      }
      this.$set(this, 'external_tags', tags);
      this.search_tags();
      this.spinner = false;
    });
  },
  data: function () {
    return {
      spinner: true,
      new_tag: '',
      search_request: '',
      image: null,
      image_tags: [],
      external_tags: [],
      search_results: [],
      db_images_ref: null,
      storage_ref: null
    };
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
        reader.readAsDataURL(this.$refs.upload.files[0]);
      }
    },
    save: async function () {
      if (this.image !== null) {
        let db_image_ref = this.db_images_ref.push();
        await this.storage_ref.child(db_image_ref.key).putString(this.image.data, 'data_url');
        db_image_ref.set({
          created_by: auth.currentUser.uid,
          tags: this.image_tags,
          url: await this.storage_ref.child(db_image_ref.key).getDownloadURL()
        });
        this.image = null;
        for (let i = 0; i < this.image_tags.length; ++i) {
          let tag = this.image_tags[i];
          if (!this.external_tags.includes(tag)) {
            this.external_tags.push(tag);
          }
        }
        this.search_tags();
        this.$set(this, 'image_tags', []);
      }
    },
    add_new_tag: function () {
      this.add_tag(this.new_tag);
      this.new_tag = '';
    },
    add_tag: function (tag) {
      if (!this.image_tags.includes(tag)) {
        this.image_tags.push(tag);
      }
    },
    remove_tag: function (tag) {
      let index = this.image_tags.indexOf(tag);
      if (index > -1) {
        this.image_tags.splice(index, 1);
      }
    },
    search_tags: function () {
      this.$set(this, 'search_results', []);
      for (let i = 0; i < this.external_tags.length; ++i) {
        let tag = this.external_tags[i];
        if (tag.toLowerCase().includes(this.search_request.toLowerCase())) {
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
