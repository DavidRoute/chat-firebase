<template>
  <div>
    <h3>Please Login with your google account to continue.</h3>

    <button @click="login">Login with Google</button>
  </div>
</template>

<script>
import firebase from "firebase";
import { db } from "@/config/Firebase";

export default {
  methods: {
    login() {
      var provider = new firebase.auth.GoogleAuthProvider();

      firebase
        .auth()
        .signInWithPopup(provider)
        .then(async (result) => {
          let user = result.user;

          if (user) {
            const result = await db
              .collection("users")
              .where("id", "==", user.uid)
              .get();

            if (result.docs.length === 0) {
              // Set new data since this is a new user
              db.collection("users")
                .doc(user.uid)
                .set({
                  id: user.uid,
                  nickname: user.displayName,
                  avatar: user.photoURL,
                })
                .then(() => {
                  localStorage.setItem("authUserId", user.uid);
                });
            }
          }

          this.$router.push("/chat");
        })
        .catch(function(error) {
          console.log(error);
        });
    },
  },
};
</script>
