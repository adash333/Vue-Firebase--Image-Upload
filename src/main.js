// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.css";
// import VueFire from "vuefire";
import firebase from "firebase";
//import "firebase/firestore";
//Vue.use(VueFire);
import { firestorePlugin } from "vuefire";

Vue.use(firestorePlugin);
Vue.use(Vuetify);

Vue.config.productionTip = false;

firebase.initializeApp({
  databaseURL: "https://image-upload-62ed7.firebaseio.com",
  projectId: "image-upload-62ed7"
});

const firestore = firebase.firestore();
const settings = { /* your settings... */ timestampsInSnapshots: true };
firestore.settings(settings);

export const db = firebase.firestore();
//const vuetifyOptions = {};

/* eslint-disable no-new */
new Vue({
  el: "#app",
  components: { App },
  template: "<App/>",
  //vuetify: new Vuetify(vuetifyOptions)
  vuetify: new Vuetify()
});
