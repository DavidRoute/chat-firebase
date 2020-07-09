import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "firebase";

// Required for side-effects
require("firebase/firestore");

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyC3g7WkKYLYfqT_OIawv895FZyHk0SohZQ",
  authDomain: "test-4a415.firebaseapp.com",
  databaseURL: "https://test-4a415.firebaseio.com",
  projectId: "test-4a415",
  storageBucket: "test-4a415.appspot.com",
  messagingSenderId: "955059417480",
  appId: "1:955059417480:web:b4b8168d051583b4b64a3d",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
window.db = db;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
