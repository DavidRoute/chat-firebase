<template>
  <div class="mesgs">
    <div class="msg_history">
      <div v-for="message in messages" :key="message.createdAt">
        <div v-if="authUser.uid != message.idFrom" class="incoming_msg">
          <div class="incoming_msg_img">
            <img :src="currentPeerUser.avatar" alt="sunil" />
          </div>
          <div class="received_msg">
            <div class="received_withd_msg">
              <p>{{ message.message }}</p>
              <span class="time_date">11:01 AM | June 9</span>
            </div>
          </div>
        </div>

        <div v-else class="outgoing_msg">
          <div class="sent_msg">
            <p>{{ message.message }}</p>
            <span class="time_date">11:01 AM | June 9</span>
          </div>
        </div>
      </div>
    </div>

    <div class="type_msg">
      <div class="input_msg_write">
        <input
          @keyup.enter="sendMessage"
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
import { db } from "@/config/Firebase.js";
import moment from "moment";

export default {
  props: {
    currentPeerUser: Object,
  },

  data() {
    return {
      authUser: {},
      message: null,
      messages: [],
      groupChatId: null,
    };
  },

  created() {
    this.authUser = firebase.auth().currentUser;

    this.fetchMessages();
  },

  watch: {
    currentPeerUser() {
      this.fetchMessages();
    },
  },

  methods: {
    scrollToBottom() {
      let box = document.querySelector(".msg_history");

      box.scrollTop = box.scrollHeight;
    },

    fetchMessages() {
      this.groupChatId = `${this.authUser.uid}-${this.currentPeerUser.id}`;
      console.log(this.groupChatId);

      db.collection("chat")
        .doc(this.groupChatId)
        .collection(this.groupChatId)
        .onSnapshot((querySnapshot) => {
          let allMessages = [];
          querySnapshot.forEach((doc) => {
            allMessages.push(doc.data());
          });

          this.messages = allMessages;

          setTimeout(() => {
            this.scrollToBottom();
          }, 100);
        });
    },

    sendMessage() {
      let timestamp = moment()
        .valueOf()
        .toString();

      //   console.log("TimeStamp", timestamp);
      //   console.log("Current Peer User", this.currentPeerUser.id);
      //   console.log("Chat group id", this.groupChatId);

      let data = {
        idFrom: this.authUser.uid,
        idTo: this.currentPeerUser.id,
        timestamp: timestamp,
        message: this.message.trim(),
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
  },
};
</script>
