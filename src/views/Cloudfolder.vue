<template>
  <div>
    <template v-if="access_token === undefined">
      <button v-on:click="authorize">Authorize</button>
      <p>No access token found, please authorize to proceed.</p>
    </template>
    <template v-else>
      <p>Your current access token: {{ access_token }}</p>
      <button v-on:click="update_albums">Update albums</button>
      <template v-if="album_list.length > 0">
        <p>Click on album you wish to upload</p>
        <p>Caution: only the latest {{ max_latest }} images from your album will be uploaded</p>
        <p>Album list:</p>
      </template>
      <ul>
        <template v-for="album in album_list">
          <li v-bind:key="album.id">
            <template v-if="!uploading.includes(album.id)">
              <template v-if="!uploaded.includes(album.id)">
                <button v-on:click="upload_album(album)">{{ album.title }}</button>
                - containing {{ album.size }} image<template v-if="album.size > 1">s</template>
              </template>
              <template v-else>
                <p>Successfully uploaded album "{{ album.title }}"</p>
              </template>
            </template>
            <template v-else>
              <p>Uploading album "{{ album.title }}", please wait...   Uploaded {{ upload_percentage(album.id) }} %</p>
            </template>
          </li>
        </template>
      </ul>
    </template>
  </div>
</template>

<script>
import jsonp from 'jsonp';
import firebase from '../firebase';

let auth = firebase.auth();

function parse_hash_params (hash) {
  let entries = hash.split('&').map(s => s.replace('#', '').split('='));
  return entries.reduce((prev, cur) => {
    prev[cur[0]] = cur[1];
    return prev;
  }, {});
}

function get_vk_request (method, params, access_token) {
  let request = `https://api.vk.com/method/${method}?access_token=${access_token}&v=5.95`;
  for (let key in params) {
    request += `&${key}=${params[key]}`;
  }
  return request;
}

function vk_photo_type_compare (a, b) {
  // returns result of comparison: a < b
  const order = ['s', 'm', 'x', 'y', 'z', 'w'];
  const cut = ['o', 'p', 'q', 'r'];

  if (order.includes(a)) {
    if (order.includes(b)) {
      return order.indexOf(a) < order.indexOf(b);
    } else {
      return false;
    }
  } else {
    if (order.includes(b)) {
      return true;
    } else {
      return cut.indexOf(a) < cut.indexOf(b);
    }
  }
}

export default {
  created: function () {
    let db = firebase.database();
    let storage = firebase.storage();

    this.db_images_ref = db.ref('images/');
    this.storage_ref = storage.ref('images/');
  },
  data: function () {
    return {
      db_images_ref: null,
      storage_ref: null,
      album_list: [],
      uploading: [],
      uploaded: [],
      max_latest: 100,
      uploaded_count: {},
      total_uploading: {}
    };
  },
  methods: {
    authorize: function () {
      window.location = 'https://oauth.vk.com/authorize?' +
        'client_id=6948463&' +
        'display=popup&' +
        'redirect_uri=https://savefolder-v2.firebaseapp.com/cloudfolder&' +
        'scope=photos&' +
        'response_type=token&' +
        'v=5.95&';
    },
    update_albums: function () {
      const method = 'photos.getAlbums';
      const params = {
        owner_id: this.user_id,
        need_system: true
      };
      const request = get_vk_request(method, params, this.access_token);

      jsonp(request, (err, data) => {
        if (err) {
          console.log(err);
        }
        if (data.error) {
          console.log(data.error.error_msg);
        }
        if (data.response) {
          this.$set(this, 'album_list', []);
          let items = data.response.items;
          for (let i = 0; i < items.length; ++i) {
            this.album_list.push({
              id: items[i].id,
              title: items[i].title,
              size: items[i].size
            });
          }
        }
      });
    },
    upload_album: function (album) {
      this.uploading.push(album.id);
      const method = 'photos.get';
      const params = {
        owner_id: this.user_id,
        album_id: album.id,
        rev: 1,
        count: Math.min(this.max_latest, album.size)
      };
      const request = get_vk_request(method, params, this.access_token);
      
      this.$set(this.total_uploading, `${album.id}`, Math.min(this.max_latest, album.size));
      this.$set(this.uploaded_count, `${album.id}`, 0);

      jsonp(request, async (err, data) => {
        if (err) {
          console.log(err);
        }
        if (data.error) {
          console.log(data.error.error_msg);
        }
        if (data.response) {
          let items = data.response.items;

          for (let i = 0; i < items.length; ++i) {
            let sizes = items[i].sizes;
            if (sizes.length < 1) {
              continue;
            }
            let best_size_index = 0;
            for (let j = 1; j < sizes.length; ++j) {
              if (vk_photo_type_compare(sizes[best_size_index].type, sizes[j].type)) {
                best_size_index = j;
              }
            }

            let url = sizes[best_size_index].url;

            let response = await fetch(url);
            let blob = await response.blob();

            let db_image_ref = this.db_images_ref.push();
            await this.storage_ref.child(db_image_ref.key).put(blob);
            db_image_ref.set({
              created_by: auth.currentUser.uid,
              tags: [],
              url: await this.storage_ref.child(db_image_ref.key).getDownloadURL()
            });

            this.$set(this.uploaded_count, `${album.id}`, this.uploaded_count[album.id] + 1);
          }

          this.uploading.splice(this.uploading.indexOf(album.id), 1);
          this.uploaded.push(album.id);
        }
      });
    },
    upload_percentage: function (id) {
      return Math.floor(100 * this.uploaded_count[id] / this.total_uploading[id]);
    }
  },
  computed: {
    hash_params: function () {
      return parse_hash_params(this.$route.hash);
    },
    access_token: function () {
      return this.hash_params.access_token;
    },
    user_id: function () {
      return this.hash_params.user_id;
    }
  }
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
}

p {
  padding: 10px;
}

ul {
  margin-left: 50px;
}

li {
  margin: 10px;
}
</style>
