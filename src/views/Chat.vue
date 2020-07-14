<template>
  <div class="container">
    <h3 class="text-center">Messaging</h3>
    <div class="messaging">
      <div class="inbox_msg">
        <div class="inbox_people">
          <div class="headind_srch">
            <div class="recent_heading">
              <h4>Recent</h4>
            </div>
            <div class="srch_bar">
              <div class="stylish-input-group">
                <input type="text" class="search-bar" placeholder="Search" />
                <span class="input-group-addon">
                  <button type="button">
                    <i class="fa fa-search" aria-hidden="true"></i>
                  </button>
                </span>
              </div>
            </div>
          </div>

          <div class="inbox_chat">
            <div
              v-for="user in users"
              :key="user.id"
              class="chat_list"
              :class="[user == currentPeerUser ? 'active_chat' : '']"
            >
              <div class="chat_people" style="cursor: pointer;">
                <a @click="selectUser(user)">
                  <div class="chat_img">
                    <img :src="user.avatar" alt="sunil" />
                  </div>
                  <div class="chat_ib">
                    <h5>
                      {{ user.nickname }}
                      <span class="chat_date">Dec 25</span>
                    </h5>
                    <p>
                      Test, which is a new approach to have all solutions
                      astrology under one roof.
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentPeerUser">
          <Message :currentPeerUser="currentPeerUser" />
        </div>

        <div v-else class="mesgs">
          <h1>Welcome Chat</h1>
        </div>
      </div>

      <p class="text-center top_spac">
        Design by
        <a target="_blank" href="#">Sunil Rajput</a>
      </p>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import { db } from "@/config/Firebase.js";
import Message from "@/components/Message.vue";

export default {
  components: { Message },

  data() {
    return {
      authUser: {},
      users: [],
      currentPeerUser: null
    };
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          console.log(user);
          next();
        } else {
          vm.$router.push("/login");
        }
      });
    });
  },

  created() {
    this.authUser = firebase.auth().currentUser;

    this.fetchUsers();
  },

  methods: {
    selectUser(user) {
      this.currentPeerUser = user;
    },

    async fetchUsers() {
      let result = await db.collection("users").get();

      if (result.docs.length > 0) {
        this.users = result.docs.map(doc => doc.data());
      }
    }
  }
};
</script>

<style>
.container {
  max-width: 1170px;
  margin: auto;
}
img {
  max-width: 100%;
}
.inbox_people {
  background: #f8f8f8 none repeat scroll 0 0;
  float: left;
  overflow: hidden;
  width: 40%;
  border-right: 1px solid #c4c4c4;
}
.inbox_msg {
  border: 1px solid #c4c4c4;
  clear: both;
  overflow: hidden;
}
.top_spac {
  margin: 20px 0 0;
}

.recent_heading {
  float: left;
  width: 40%;
}
.srch_bar {
  display: inline-block;
  text-align: right;
  width: 60%;
}
.headind_srch {
  padding: 10px 29px 10px 20px;
  overflow: hidden;
  border-bottom: 1px solid #c4c4c4;
}

.recent_heading h4 {
  color: #05728f;
  font-size: 21px;
  margin: auto;
}
.srch_bar input {
  border: 1px solid #cdcdcd;
  border-width: 0 0 1px 0;
  width: 80%;
  padding: 2px 0 4px 6px;
  background: none;
}
.srch_bar .input-group-addon button {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  padding: 0;
  color: #707070;
  font-size: 18px;
}
.srch_bar .input-group-addon {
  margin: 0 0 0 -27px;
}

.chat_ib h5 {
  font-size: 15px;
  color: #464646;
  margin: 0 0 8px 0;
  text-align: left;
}
.chat_ib h5 span {
  font-size: 13px;
  float: right;
}
.chat_ib p {
  font-size: 14px;
  color: #989898;
  margin: auto;
  text-align: justify;
}
.chat_img {
  float: left;
  width: 11%;
  border-radius: 50%;
  height: 11%;
  display: block;
  position: relative;
  border: 1px solid #545b62;
  overflow: hidden;
}
.chat_ib {
  float: left;
  padding: 0 0 0 15px;
  width: 88%;
}

.chat_people {
  overflow: hidden;
  clear: both;
}
.chat_list {
  border-bottom: 1px solid #c4c4c4;
  margin: 0;
  padding: 18px 16px 10px;
}
.inbox_chat {
  height: 550px;
  overflow-y: scroll;
}

.active_chat {
  background: #ebebeb;
}

.incoming_msg_img {
  overflow: hidden;
  display: inline-block;
  width: 6%;
  height: 6%;
  border-radius: 50%;
  box-shadow: 1px 0px 3px #00000078;
}
.received_msg {
  display: inline-block;
  padding: 0 0 0 10px;
  vertical-align: top;
  width: 92%;
}
.received_withd_msg p {
  background: #ebebeb none repeat scroll 0 0;
  border-radius: 3px;
  color: #646464;
  font-size: 14px;
  margin: 0;
  padding: 5px 10px 5px 12px;
  display: inline-block;
  text-align: left;
}
.time_date {
  color: #747474;
  display: block;
  font-size: 12px;
  margin: 8px 0 0;
}
.received_withd_msg {
  width: 57%;
  text-align: left;
}
.mesgs {
  float: left;
  padding: 30px 15px 0 25px;
  width: 60%;
}

.sent_msg p {
  background: #05728f none repeat scroll 0 0;
  border-radius: 3px;
  font-size: 14px;
  margin: 0;
  color: #fff;
  padding: 5px 10px 5px 12px;
  display: inline-block;
  text-align: left;
}
.outgoing_msg {
  overflow: hidden;
  margin: 26px 0 26px;
}
.sent_msg {
  float: right;
  width: 46%;
}
.input_msg_write input {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  color: #4c4c4c;
  font-size: 15px;
  min-height: 48px;
  width: 100%;
  padding-left: 20px;
}

.type_msg {
  border-top: 1px solid #c4c4c4;
  position: relative;
}
.msg_send_btn {
  background: #05728f none repeat scroll 0 0;
  border: medium none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  font-size: 17px;
  height: 33px;
  position: absolute;
  right: 0;
  top: 11px;
  width: 33px;
}

.img_send_btn {
  background: #05728f none repeat scroll 0 0;
  border: medium none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  font-size: 17px;
  height: 33px;
  position: absolute;
  left: -20px;
  top: 11px;
  width: 33px;
}

.view_input_gallery {
  opacity: 0;
  position: absolute;
  z-index: -1;
}

.messaging {
  padding: 0 0 50px 0;
}
.msg_history {
  height: 516px;
  overflow-y: auto;
}

i.fa.fa-picture-o {
  margin-top: 8px;
}
</style>
