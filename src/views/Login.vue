<template>
  <div>
    <h3>Please Login with your google account to continue.</h3>

    <button @click="login">Login with Google</button>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  methods: {
    login() {
      var provider = new firebase.auth.GoogleAuthProvider();

      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          console.log(result);
          //   var token = result.credential.accessToken;
          //   var user = result.user;

          this.$router.push("/chat");
        })
        .catch(function(error) {
          console.log(error);

          //   var errorCode = error.code;
          //   var errorMessage = error.message;
          //   var email = error.email;
          //   var credential = error.credential;
        });
    },
  },
};
</script>
