import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

export default (function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCXNUJn8-NqjOHYCnJzutNuN1f0NIapXvw",
    authDomain: "savefolder-v2.firebaseapp.com",
    databaseURL: "https://savefolder-v2.firebaseio.com",
    projectId: "savefolder-v2",
    storageBucket: "savefolder-v2.appspot.com",
    messagingSenderId: "36935907485"
  };
  firebase.initializeApp(config);

  return firebase;
})();
  