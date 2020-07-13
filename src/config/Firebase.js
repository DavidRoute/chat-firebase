import firebase from "firebase";

const config = {
  apiKey: "AIzaSyC3g7WkKYLYfqT_OIawv895FZyHk0SohZQ",
  authDomain: "test-4a415.firebaseapp.com",
  databaseURL: "https://test-4a415.firebaseio.com",
  projectId: "test-4a415",
  storageBucket: "test-4a415.appspot.com",
  messagingSenderId: "955059417480",
  appId: "1:955059417480:web:b4b8168d051583b4b64a3d",
};
firebase.initializeApp(config);

export const db = firebase.firestore();
export const storage = firebase.storage();
