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
        <p>Caution: only the latest 1000 images from your album will be uploaded</p>
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
              <p>Uploading album "{{ album.title }}", please wait...</p>
            </template>
          </li>
        </template>
      </ul>
    </template>
  </div>
</template>

<script>
import jsonp from 'jsonp'

function parse_hash_params(hash) {
  let entries = hash.split('&').map(s => s.replace('#', '').split('='));
  return entries.reduce((prev, cur) => {
    prev[cur[0]] = cur[1];
    return prev;
  }, {});
}

function get_vk_request(method, params, access_token) {
  let request = `https://api.vk.com/method/${method}?access_token=${access_token}&v=5.95`;
  for (let key in params) {
    request += `&${key}=${params[key]}`
  }
  return request;
}

export default {
  data: function () {
    return {
      album_list: [],
      uploading: [],
      uploaded: []
    }
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
      }
      const request = get_vk_request(method, params, this.access_token);

      jsonp(request, (err, data) => {
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
            })
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
        count: Math.min(1000, album.size)
      }
      const request = get_vk_request(method, params, this.access_token);

      jsonp(request, (err, data) => {
        console.log(data);

        

        this.uploading.splice(this.uploading.indexOf(album.id), 1);
        this.uploaded.push(album.id);
      });
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
}
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

