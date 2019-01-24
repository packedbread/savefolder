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
        page: "savefolder",
        newTag: "",
        search: "",
        image: null,
        searchImages: [],
        allImages: [],
        tags: [],
        searchTags: [],
        allTags: [],
    },
    methods: {
        addImageTag: function(tag) {
            console.log("add");
            if (!vue.tags.includes(tag)) {
                vue.tags.push(tag);
            }
            vue.newTag = "";
        },
        deleteImageTag: function(tag) {
            console.log("delete");
            let index = vue.tags.indexOf(tag);
            if (index > -1) {
                vue.tags.splice(index, 1);
            }
        },
        save: function() {
            console.log("save");

            if (vue.image !== null) {
                if (vue.image.imageId) {
                    dbImages.set({
                        imageId: vue.image.imageId,
                        tags: vue.tags
                    }).then(function() {
                        console.log("Commited images collection updates");
                    });
                } else {
                    let imageId = uuidv4() + "." + vue.image.name;
                    let ref = imagesRef.child(imageId);
                    ref.putString(vue.image.data, "data_url").then(function(snapshot) {
                        console.log("Uploaded image to storage");
                    });

                    dbImages.add({
                        imageId: imageId,
                        tags: vue.tags
                    }).then(function() {
                        console.log("Commited images collection changes");
                    });
                }
            }
            let batch = db.batch();
            for (var i in vue.tags) {
                if (!vue.allTags.includes(vue.tags[i])) {
                    batch.set(dbTags.doc(), {
                        tag: vue.tags[i]
                    });
                }
            }
            batch.commit().then(function() {
                console.log("Commited tags collection changes");
                updateAllTags();
            });
            resetTempVue();
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
        searchForTags: function() {
            console.log("search");
            vue.searchTags = [];
            let size = vue.allTags.length;
            for (let i = 0; i < size; ++i) {
                if (vue.allTags[i].toLowerCase().includes(vue.search.toLowerCase())) {
                    vue.searchTags.push(vue.allTags[i]);
                }
            }
        },
        switchPage: function(newPage) {
            resetTempVue();
            vue.page = newPage;
        },
        erase: function() {
            console.log("erase");

            // todo
        },
        searchForImages: function() {
            console.log("searchImages");
            vue.searchImages = [];

            for (let i = 0; i < vue.allImages.length; ++i) {
                let contained = false;
                for (let j = 0; j < vue.allImages[i].tags.length; ++j)
                if (vue.allImages[i].tags[j].toLowerCase().includes(vue.search.toLowerCase())) {
                    contained = true;
                    break;
                }

                if (contained) {
                    vue.searchImages.push(vue.allImages[i]);
                }
            }
        },
        selectImage: function(image) {
            console.log("selectImage");

            vue.image = image;
            vue.tags = image.tags;
        }
    }
})

function resetTempVue() {
    vue.newTag = "";
    vue.searchTags = vue.allTags;
    vue.search = "";
    vue.image = null;
    vue.tags = [];
    vue.searchImages = vue.allImages;
}

function updateAllTags() {
    vue.allTags = [];
    dbTags.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(document) {
            vue.allTags.push(document.data().tag);
        });
        vue.allTags.sort();
        vue.searchTags = vue.allTags;
    });
}

updateAllTags();

function updateAllImages() {
    vue.allImages = [];
    dbImages.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(document) {
            let imageId = document.data().imageId;
            let ref = imagesRef.child(imageId);
            ref.getDownloadURL().then(function(url) {
                vue.allImages.push({
                    imageId: imageId,
                    url: url,
                    tags: document.data().tags
                });

                vue.allImages.sort();
                vue.searchImages = vue.allImages;
            });
        });
    });
}

updateAllImages();
