firebase.initializeApp(config); // from firebase-config.js

var storage = firebase.storage();
var storageRef = storage.ref();
var imagesRef = storageRef.child("image");

var db = firebase.firestore();
var dbTags = db.collection("tags");
var dbImages = db.collection("images");

function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

var vue = new Vue({
    el: "#content",
    data: {
        newTag: "",
        search: "",
        image: null,
        tags: [],
        allTags: [],
        imageTags: []
    },
    methods: {
        addImageTag: function(tag) {
            console.log("add");
            if (!vue.imageTags.includes(tag)) {
                vue.imageTags.push(tag);
            }
            vue.newTag = "";
        },
        deleteImageTag: function(tag) {
            console.log("delete");
            let index = vue.imageTags.indexOf(tag);
            if (index > -1) {
                vue.imageTags.splice(index, 1);
            }
        },
        save: function() {
            console.log("save");

            if (vue.image !== null) {
                let imageId = uuidv4() + "." + vue.image.name;
                let ref = imagesRef.child(imageId);
                ref.putString(vue.image.data, "data_url").then(function(snapshot) {
                    console.log("Uploaded image to storage");
                });

                dbImages.add({
                    imageId: imageId,
                    tags: vue.imageTags
                }).then(function() {
                    console.log("Commited images collection changes");
                });
            }
            let batch = db.batch();
            for (var i in vue.imageTags) {
                if (!vue.allTags.includes(vue.imageTags[i])) {
                    batch.set(dbTags.doc(), {
                        tag: vue.imageTags[i]
                    });
                }
            }
            batch.commit().then(function() {
                console.log("Commited tags collection changes");
                updateAllTags();
            });

        },
        uploadImage: function() {
            console.log("upload");
            if (vue.$refs.input.files && vue.$refs.input.files[0]) {
                let reader = new FileReader();
                reader.onload = function(event) {
                    vue.image = {
                        name: vue.$refs.input.files[0].name,
                        data: event.target.result
                    };
                };
                reader.readAsDataURL(vue.$refs.input.files[0])
            }
        },
        searchTags: function() {
            console.log("search");
            vue.tags = [];
            let size = vue.allTags.length;
            for (let i = 0; i < size; ++i) {
                if (vue.allTags[i].toLowerCase().includes(vue.search.toLowerCase())) {
                    vue.tags.push(vue.allTags[i]);
                }
            }
        }
    },
    computed: {

    }
})

function updateAllTags() {
    dbTags.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(document) {
            vue.allTags.push(document.data().tag);
        });
        vue.allTags.sort();
        vue.tags = vue.allTags;
    });
}

updateAllTags();