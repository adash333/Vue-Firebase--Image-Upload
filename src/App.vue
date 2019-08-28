<template>
  <div id="app">
    <v-app-bar app color="indigo" dark>
      <v-toolbar-title>Vue Firebase Image Upload</v-toolbar-title>
    </v-app-bar>
    <v-app id="inspire">
      <v-content>
        <v-container fluid>
          <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
              <img :src="imageUrl" height="150" v-if="imageUrl">
              <v-text-field
                label="Select Image"
                @click="pickFile"
                v-model="imageName"
                prepend-icon="attach_file"
              ></v-text-field>
              <input
                type="file"
                style="display: none"
                ref="image"
                accept="image/*"
                @change="onFilePicked"
              >

              <v-btn color="primary" @click="upload">アップロード</v-btn>
            </v-flex>
          </v-layout>

          <br>

          <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
              <div v-for="i in imgUrls">
                <br>
                <img :src="i.downloadUrl" height="150">
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import { db } from "./main";

export default {
  name: "App",
  data() {
    return {
      photo: null,
      photo_url: null,
      dialog: false,
      imageName: "",
      imageUrl: "",
      imageFile: "",
      //image_src: require("imageUrl"),
      imgUrls: []
    };
  },
  created() {
    this.getImages();
    //const bucketName = "image-upload-62ed7.appspot.com";
    /*
    var docRef = db.collection("images");
    var imgUrls = [];
    docRef
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          console.log(doc.data().downloadUrl);
          //this.imgUrls.push("doc.data().downloadUrl");
          //this.imgUrls.push("doc.data().downloadUrl");
          //var imgUrls = [];
          imgUrls.push(doc.data().downloadUrl);
          console.log(imgUrls);
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
    //console.log(imgUrls);
    */
  },
  methods: {
    getImages: function() {
      db.collection("images")
        .get()
        .then(snap => {
          const array = [];
          snap.forEach(doc => {
            array.push(doc.data());
          });
          this.imgUrls = array;
        });

      this.imageName = "";
      this.imageFile = "";
      this.imageUrl = "";
    },

    pickFile() {
      this.$refs.image.click();
    },

    onFilePicked(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        this.imageName = files[0].name;
        if (this.imageName.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.imageUrl = fr.result;
          //console.log("imageUrl");
          this.imageFile = files[0]; // this is an image file that can be sent to server...
          //this.getImages();
        });
      } else {
        this.imageName = "";
        this.imageFile = "";
        this.imageUrl = "";
      }
    },

    // 画像アップロード処理
    upload: function() {
      //var me = this;
      /*
      const timestamp = snapshot.get("created_at");
      const date = timestamp.toDate();
      const fsTimestamp =
        "" +
        date.getFullYear() +
        ("0" + date.getMonth() + 1).slice(-2) +
        ("0" + date.getDate()).slice(-2) +
        ("0" + date.getHours()).slice(-2) +
        ("0" + date.getMinutes()).slice(-2) +
        ("0" + date.getSeconds()).slice(-2);
*/
      // ストレージオブジェクト作成
      var storageRef = firebase.storage().ref();
      // ファイルのパスを設定
      var mountainsRef = storageRef.child(`images/${this.imageName}`);
      // ファイルを適用してファイルアップロード開始
      mountainsRef.put(this.imageFile).then(snapshot => {
        snapshot.ref.getDownloadURL().then(downloadURL => {
          this.imageUrl = downloadURL;
          const bucketName = "image-upload-62ed7.appspot.com";
          const filePath = this.imageName;
          db.collection("images").add({
            downloadURL,
            downloadUrl:
              `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/images` +
              "%2F" +
              `${encodeURIComponent(filePath)}?alt=media`,
            timestamp: Date.now()
          });
          this.getImages();
        });
      });
      //this.getImages();
    }
  },
  components: {}
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
