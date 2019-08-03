<template>
  <div id="app">
    <header class="header">
      <h1>Chat</h1>
      <!-- ログイン時にはフォームとログアウトボタンを表示 -->
      <div v-if="user.uid" key="login">
        <img :src="user.photoURL" style="width: 50px; height: 50px;" />
        <input type="text" v-model="user.displayName" />
        <button type="button" @click="updateName">名前更新</button>
        <button type="button" @click="doLogout">ログアウト</button>
      </div>
      <!-- 未ログイン時にはログインボタンを表示 -->
      <div v-else key="logout">
        <button type="button" @click="doLogin">ログイン</button>
      </div>
    </header>

    <!-- Firebase から取得したリストを描画（トランジション付き） -->
    <transition-group name="chat" tag="div" class="list content">
      <section
        v-for="{ key, name, image, message } in chat"
        :key="key"
        class="item"
      >
        <div class="item-image">
          <img :src="image" width="40" height="40" />
        </div>
        <div class="item-detail">
          <div class="item-name">{{ name }}</div>
          <div class="item-message">
            <nl2br tag="div" :text="message" />
          </div>
        </div>
      </section>
    </transition-group>

    <!-- 入力フォーム -->
    <form action @submit.prevent="doSend" class="form">
      <textarea
        v-model="input"
        :disabled="!user.uid"
        @keydown.enter.exact.prevent="doSend"
      ></textarea>
      <button type="submit" :disabled="!user.uid" class="send-button">
        Send
      </button>
    </form>
  </div>
</template>

<script>
// firebase モジュール
import firebase from "firebase";
import firestore from "firebase";
// 改行を <br> タグに変換するモジュール
import Nl2br from "vue-nl2br";
export default {
  name: "Chat",
  components: { Nl2br },
  data() {
    return {
      user: {}, // ユーザー情報
      chat: [], // 取得したメッセージを入れる配列
      input: "", // 入力したメッセージ
      db: {}
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      // Initialize Cloud Firestore through Firebase
      this.db = firebase.firestore();

      this.user = user ? user : {};

      if (user) {
        this.chat = [];
        const childAdded = this.childAdded;

        this.db.collection("messages").onSnapshot(function(snapshot) {
          snapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
              console.log("New message: ", change.doc.data());
              childAdded(change.doc);
            }
          });
        });
      }
    });
  },
  methods: {
    // ログイン処理
    doLogin() {
      const provider = new firebase.auth.GithubAuthProvider();
      firebase.auth().signInWithPopup(provider);
    },
    // ログアウト処理
    doLogout() {
      firebase.auth().signOut();
    },
    // ログアウト処理
    updateName() {
      this.user.updateProfile({ displayName: this.user.displayName });
    },
    // スクロール位置を一番下に移動
    scrollBottom() {
      this.$nextTick(() => {
        window.scrollTo(0, document.body.clientHeight);
      });
    },
    // 受け取ったメッセージをchatに追加
    // データベースに新しい要素が追加されると随時呼び出される
    childAdded(doc) {
      const message = doc.data();
      this.chat.push({
        key: doc.id,
        name: message.name,
        image: message.image,
        message: message.message
      });
      this.scrollBottom();
    },
    doSend() {
      if (this.user.uid && this.input.length) {
        const self = this;
        this.db
          .collection("messages")
          .add({
            message: this.input,
            name: this.user.displayName,
            image: this.user.photoURL
          })
          .then(function(docRef) {
            self.input = "";
            console.log("Document written with ID: ", docRef.id);
          })
          .catch(function(error) {
            console.error("Error adding document: ", error);
          });
      }
    }
  }
};
</script>
<style scoped src="./chat.css" />
