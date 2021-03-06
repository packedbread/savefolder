<template>
  <div id="viewfolder">
    <div id="image-wrapper">
      <span></span>
      <img v-if="image_url !== null" v-bind:src="image_url">
    </div>
    <button v-on:click="erase" id="erase">Erase</button>
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
      <input v-on:input="search_images" v-model="search_request" type="text" placeholder="Type to search images...">
      <div id="external-images">
        <div class="spinner" v-if="spinner">
          <div class="filler"></div>
          <self-building-square-spinner v-bind:animation-duration="6000" v-bind:size="40" color="#8ca7c4"/>
          <div class="filler"></div>
        </div>
        <template v-for="index in search_results">
          <button v-on:click="select_image(index)" class="tag img" v-bind:key="index">
            <img class="preview" v-bind:src="external_images[index].url">
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from '../firebase';
import { SelfBuildingSquareSpinner } from 'epic-spinners';

export default {
  components: {
    SelfBuildingSquareSpinner
  },
  created: function () {
    let database = firebase.database();
    let storage = firebase.storage();

    this.db_images_ref = database.ref('images/');
    this.storage_ref = storage.ref('images/');

    this.db_images_ref.once('value', async snapshot => {
      this.$set(this, 'external_images', []);
      for (let image_id in snapshot.val()) {
        this.external_images.push({
          id: image_id,
          tags: snapshot.val()[image_id].tags || [], 
          url: snapshot.val()[image_id].url
        });
      }
      this.search_images();
      this.spinner = false;
    });
  },
  data: function () {
    return {
      spinner: true,
      new_tag: '',
      search_request: '',
      image_url: '',
      image_id: '',
      image_tags: [],
      external_images: [],
      search_results: [],
      db_images_ref: null,
      storage_ref: null
    };
  },
  methods: {
    erase: async function () {
      if (this.image_id !== '') {
        await this.storage_ref.child(this.image_id).delete();
        this.db_images_ref.child(this.image_id).remove();

        for (let i = 0; i < this.external_images.length; ++i) {
          if (this.external_images[i].id === this.image_id) {
            this.external_images.splice(i, 1);
            break;
          }
        }
        this.search_images();
      }
      this.image_id = '';
      this.image_url = '';
      this.$set(this, 'image_tags', []);
    },
    save: async function () {
      if (this.image_id !== '') {
        await this.db_images_ref.child(this.image_id).update({
          tags: this.image_tags
        });
      }
      this.image_id = '';
      this.image_url = '';
      this.$set(this, 'image_tags', []);
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
    select_image: function (index) {
      this.image_id = this.external_images[index].id;
      this.$set(this, 'image_tags', this.external_images[index].tags);
      this.image_url = this.external_images[index].url;
    },
    search_images: function () {
      this.$set(this, 'search_results', []);
      for (let i = 0; i < this.external_images.length; ++i) {
        let image = this.external_images[i];
        if (image.tags.length === 0) {
          if (this.search_request === '' || this.search_request === ':notags') {
            this.search_results.push(i);
          }
        } else {
          for (let j = 0; j < image.tags.length; ++j) {
            if (image.tags[j].toLowerCase().includes(this.search_request.toLowerCase())) {
              this.search_results.push(i);
              break;
            }
          }
        }
      }
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
    "r s e" 50px
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

#erase {
  grid-area: r;
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

.img {
  width: 250px;
  height: 250px;
}

.preview {
  display: block;
  width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
