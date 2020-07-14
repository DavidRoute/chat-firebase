<template>
  <div class="mesgs">
    <div class="msg_history" @scroll="handleScroll">
      <div v-for="message in messages" :key="message.timestamp">
        <div v-if="authUser.uid != message.idFrom" class="incoming_msg">
          <div class="incoming_msg_img">
            <img :src="currentPeerUser.avatar" alt="sunil" />
          </div>
          <div class="received_msg">
            <div v-if="message.type == 0" class="received_withd_msg">
              <p>{{ message.content }}</p>
              <span class="time_date">11:01 AM | June 9</span>
            </div>

            <div v-else-if="message.type == 1" class="received_withd_msg">
              <img :src="message.content" alt="image" />
              <span class="time_date">11:01 AM | June 9</span>
            </div>
          </div>
        </div>

        <div v-else class="outgoing_msg">
          <div v-if="message.type == 0" class="sent_msg">
            <p>{{ message.content }}</p>
            <span class="time_date">11:01 AM | June 9</span>
          </div>

          <div v-else-if="message.type == 1" class="sent_msg">
            <img :src="message.content" alt="image" />
            <span class="time_date">11:01 AM | June 9</span>
          </div>
        </div>
      </div>
    </div>

    <div class="type_msg">
      <div class="input_msg_write">
        <label for="input-gallery" class="img_send_btn" type="button">
          <i class="fa fa-picture-o"></i>
        </label>

        <input
          @change="choosePhoto"
          type="file"
          id="input-gallery"
          class="view_input_gallery"
          accept="image/*"
        />

        <input
          @keyup.enter="onKeyboardPress"
          v-model="message"
          type="text"
          class="write_msg"
          placeholder="Type a message"
        />
        <button class="msg_send_btn" type="button">
          <i class="fa fa-paper-plane-o" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import { db, storage } from "@/config/Firebase.js";
import moment from "moment";

export default {
  props: {
    currentPeerUser: Object
  },

  data() {
    return {
      authUser: {},
      message: null,
      messages: [],
      groupChatId: null,
      currentPhotoFile: null,
      pageNo: 1,
      lastQuery: 0
    };
  },

  created() {
    this.authUser = firebase.auth().currentUser;

    this.fetchMessages();
  },

  watch: {
    currentPeerUser() {
      this.fetchMessages();
    }
  },

  methods: {
    scrollToBottom() {
      let box = document.querySelector(".msg_history");

      box.scrollTop = box.scrollHeight;
    },

    scrollToMiddle() {
      let box = document.querySelector(".msg_history");

      box.scrollTop = (box.scrollHeight / 3) * 1;
    },

    generateGroupChatId() {
      if (
        this.hashString(this.authUser.uid) <=
        this.hashString(this.currentPeerUser.id)
      ) {
        this.groupChatId = `${this.authUser.uid}-${this.currentPeerUser.id}`;
      } else {
        this.groupChatId = `${this.currentPeerUser.id}-${this.authUser.uid}`;
      }
    },

    handleScroll() {
      let box = document.querySelector(".msg_history");

      if (box.scrollTop == 0) {
        this.generateGroupChatId();

        db.collection("chat")
          .doc(this.groupChatId)
          .collection(this.groupChatId)
          .orderBy("timestamp", "desc")
          .startAfter(this.lastQuery)
          .limit(10)
          .onSnapshot(snapshot => {
            this.lastQuery = snapshot.docs[snapshot.docs.length - 1];
            console.log("last query", this.lastQuery.data());

            this.messages = [
              ...snapshot.docs.map(doc => doc.data()).reverse(),
              ...this.messages
            ];

            setTimeout(() => {
              this.scrollToMiddle();
            }, 300);
          });
      }
    },

    fetchMessages() {
      this.generateGroupChatId();

      db.collection("chat")
        .doc(this.groupChatId)
        .collection(this.groupChatId)
        .orderBy("timestamp", "desc")
        .limit(10)
        .onSnapshot(snapshot => {
          this.lastQuery = snapshot.docs[snapshot.docs.length - 1];

          this.messages = snapshot.docs.map(doc => doc.data()).reverse();

          setTimeout(() => {
            this.scrollToBottom();
          }, 500);
        });
    },

    onKeyboardPress() {
      this.sendMessage(this.message, 0);
    },

    sendMessage(content, type) {
      if (content.trim() === "") {
        return;
      }

      let timestamp = moment()
        .valueOf()
        .toString();

      let data = {
        idFrom: this.authUser.uid,
        idTo: this.currentPeerUser.id,
        timestamp: timestamp,
        content: content.trim(),
        type: type
      };

      db.collection("chat")
        .doc(this.groupChatId)
        .collection(this.groupChatId)
        .doc(timestamp)
        .set(data)
        .then(() => {
          this.scrollToBottom();
        });

      this.message = null;
    },

    choosePhoto(event) {
      if (event.target.files && event.target.files[0]) {
        this.currentPhotoFile = event.target.files[0];

        let prefixFiletype = event.target.files[0].type.toString();
        if (prefixFiletype.indexOf("image/") === 0) {
          this.uploadPhoto();
        }
      }
    },

    uploadPhoto() {
      if (this.currentPhotoFile) {
        let timestamp = moment()
          .valueOf()
          .toString();

        let uploadTask = storage
          .ref()
          .child(timestamp)
          .put(this.currentPhotoFile);

        uploadTask.on(
          "state_changed",
          null,
          error => {
            console.log("Upload Error Message", error.message);
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              this.sendMessage(downloadURL, 1);
            });
          }
        );
      }
    },

    hashString(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash += Math.pow(str.charCodeAt(i) * 31, str.length - i);
        hash = hash & hash; // Convert to 32bit integer
      }
      return hash;
    }
  }
};
</script>
