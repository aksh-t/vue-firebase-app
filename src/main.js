import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import firebase from 'firebase'

Vue.config.productionTip = false;

var firebaseConfig = {
  apiKey: "AIzaSyD-mktsdvfvBzbR7JYU2z_A1qc7FACJMkw",
  authDomain: "hotate-6f260.firebaseapp.com",
  databaseURL: "https://hotate-6f260.firebaseio.com",
  projectId: "hotate-6f260",
  storageBucket: "hotate-6f260.appspot.com",
  messagingSenderId: "1039979808855",
  appId: "1:1039979808855:web:3819386dd736a878"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
