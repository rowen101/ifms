<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <div class="dispatch-list">
          <di class="row">
            <small>Fleet Checklist Setup</small>
          </di>

          <div class="card" style="border:none;">
            <b-tabs>
              <b-tab active>
                <template slot="title">
                  <strong>Browse File</strong>
                </template>
                <b-alert :show="isShowAlert" variant="success">Upload Complete...</b-alert>
                <input
                  ref="imageinput"
                  style="display:none;"
                  type="file"
                  @change="onfileselected"
                  multiple
                  id="fileinput"
                  accept="image/*"
                />
                <b-button-toolbar class="btn-group mb-1" role="group">
                  <button type="button" class="btn btn-secondary" @click="onCapure">
                    <i class="fa fa-camera"></i> Camera
                  </button>
                  <button type="button" @click="onBrownserImage" class="btn btn-secondary">
                    <i class="fa fa-file-image-o"></i> Image
                  </button>
                </b-button-toolbar>

                <div class="row">
                  <div class="col-12 sm-4 md-2">
                    <div
                      class="mobile-thumnail"
                      v-for="(file,index) in imglistselected"
                      :key="index"
                    >
                      <button type="button" class="delete">
                        <span>
                          <i style="color:red" class="fa fa-times-circle fa-lg"></i>
                        </span>
                      </button>
                      <div class="image">
                        <img
                          class="img-thumbnail mobile-thum-size"
                          :id="'img-' + index"
                          :src="'data:image/png;base64,'+ file.img"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <b-card-footer>
                  <b-button
                    :disabled="imglistselected==0"
                    class="mt-3"
                    variant="outline-primary"
                    block
                    @click="onUpload"
                  >Upload</b-button>
                  <br />

                  <b-progress height="2px" :value="uploadCounter" :max="max"></b-progress>
                </b-card-footer>
              </b-tab>
              <b-tab @click="onViewUploaded">
                <template slot="title">
                  <strong>Uploaded</strong>
                </template>

                <div class="row">
                  <div class="col-12 sm-4 md-2">
                    <div
                      class="mobile-thumnail"
                      v-for="(file,index) in uploadedImage"
                      :key="index"
                      v-if="!file.isdelete"
                    >
                      <button type="button" class="delete">
                        <span>
                          <i
                            style="color:red"
                            class="fa fa-times-circle fa-lg"
                            @click="onDeleteAttachment(file)"
                          ></i>
                        </span>
                      </button>
                      <div class="image">
                        <img
                          class="img-thumbnail mobile-thum-size"
                          :id="'img-' + index"
                          :src="file.img"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </b-tab>
            </b-tabs>

            <br />

            <router-link
              class="btn btn-secondary btn-sm btn-block"
              v-if="$routerHistory.hasPrevious()"
              :to="{ path: $routerHistory.previous().path }"
            >GO BACK</router-link>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import api from "../../../services/api";
import InputChecklist from "../../../components/InputChecklist";
import miniToastr from "mini-toastr";

miniToastr.init();

document.addEventListener(
  "deviceready",
  () => {
    // it's only now that we are sure
    // the event has triggered
  },
  false
);
export default {
  data: function() {
    return {
      isShowAlert: false,
      created_by:
        this.$store.getters.user.firstname +
        " " +
        this.$store.getters.user.lastname,
      max: 100,
      uploadCounter: 0,
      modalAttach: false,
      files: [],
      selectedImg: [],
      checklist: [],
      selected: {},
      imglistselected: [],
      uploadedImage: [],
      checklistransactionId:
        this.$route.params.id == undefined ? "" : this.$route.params.id
    };
  },

  components: {
    "input-checklist": InputChecklist
  },
  methods: {
    getFileContentAsBase64(path, callback) {
      window.resolveLocalFileSystemURL(path, gotFile, fail);

      function fail(e) {
        alert("Cannot found requested file");
      }

      function gotFile(fileEntry) {
        fileEntry.file(function(file) {
          var reader = new FileReader();
          reader.onloadend = function(e) {
            var content = this.result;
            callback(content);
          };
          // The most important point, use the readAsDatURL Method from the file plugin
          reader.readAsDataURL(file);
        });
      }
    },
    captureSuccess(mediaFiles) {
      let self = this;
      var i, len;
      for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        console.log(mediaFiles[i]);
        this.getFileContentAsBase64(mediaFiles[i].fullPath, function(
          base64Image
        ) {
          //window.open(base64Image);
          console.log(base64Image);
          self.imglistselected.push({
            img: base64Image.split(",")[1],
            filename: "Mobile caputure",
            extension: "JPG"
          });
        });
      }
    },
    captureError(error) {
      var msg = "An error occurred during capture: " + error.code;
      navigator.notification.alert(msg, null, "Uh oh!");
    },
    onCapure: function() {
      let self = this;
      // navigator.camera.getPicture(
      //   data => {
      //     // on success
      //     console.log(data);
      //     self.imglistselected.push({
      //       img:data,
      //       filename: "Mobile caputure",
      //       extension: "JPG"
      //     });
      //     //  self.imageSrc = "data:image/jpeg;base64," + data;
      //     // self.imageSrc = `data:image/jpeg;base64,${data}`;
      //   },
      //   () => {
      //     // on fail
      //     miniToastr.error("Could not access device camera.");
      //   },
      //   {
      //     quality: 100,
      //     destinationType: Camera.DestinationType.DATA_URL,
      //     sourceType: Camera.PictureSourceType.CAMERA,
      //     mediaType: Camera.MediaType.PICTURE,
      //     encodingType: Camera.EncodingType.JPEG,
      //     cameraDirection: Camera.Direction.BACK,
      //     targetWidth: 720,
      //     targetHeight: 500
      //   }
      // );

      var options = {
        quality: 100,
        sourceType: Camera.PictureSourceType.CAMERA,
        mediaType: Camera.MediaType.PICTURE,
        encodingType: Camera.EncodingType.JPEG,
        cameraDirection: Camera.Direction.BACK,
        targetWidth: 720,
        targetHeight: 500,
        correctOrientation: true
      };
      navigator.device.capture.captureImage(
        this.captureSuccess,
        this.captureError,
        { limit: 2 },
        options
      );
    },
    onDeleteAttachment: function(val) {
      api.instance
        .delete("wfms/delete-checklist-attachment/" + val.attachId)
        .then(resp => {
          val.isdelete = true;
          miniToastr.success("Delete attachment complete.");
        })
        .catch(error => {
          miniToastr.error(error);
        });
    },
    onUpload() {
      let self = this;

      var i = 0;
      for (var value of this.imglistselected) {
        const evt = new FormData();
        evt.append("image", value.img);
        evt.append("extension", value.extension);
        evt.append("origfilename", value.filename);
        evt.append("checklistransactionId", this.checklistransactionId);
        evt.append("created_by", self.created_by);
        api.instance
          .post("wfms/UploadChecklist", evt, {
            onUploadProgress: uploadEvent => {
              console.log(
                "Upload Progress: " +
                  Math.round((uploadEvent.loaded / uploadEvent.total) * 100) +
                  "%"
              );
            }
          })
          .then(res => {
            self.uploadCounter = Math.round(
              (i / self.imglistselected.length) * 100
            );
            self.isShowAlert = true;
          })
          .catch(function(error) {
            miniToastr.error(error);
          });
        i++;
      }
    },

    onViewUploaded: function() {
      this.onGetChecklistAttachment(this.checklistransactionId);
    },
    onGetChecklistAttachment: function(checklistransactionId) {
      let self = this;
      self.$store.commit("setLoading", true);
      api.instance
        .get("wfms/get-checklist-attachment/" + checklistransactionId)
        .then(resp => {
          self.uploadedImage = resp.data;
          self.$store.commit("setLoading", false);
        })
        .catch(err => {
          miniToastr.error(err);
        });
    },
    onBrownserImage: function() {
      this.uploadCounter = 0;
      this.isShowAlert = false;
      this.$refs.imageinput.click();
      this.files = null;
      this.isShowAlert = false;
    },
    onfileselected: function(event) {
      for (var i = 0; i <= event.target.files.length - 1; i++) {
        this.selectedImg.push(event.target.files[i]);
        this.loadPicture(
          event.target.files[i],
          event.target.files[i].name,
          event.target.files[i].name
            .split(".")
            .pop()
            .toLowerCase()
        );
      }
    },
    loadPicture(img, filename, extension) {
      let self = this;
      //  let img = document.getElementById("img");
      var reader = new FileReader();
      reader.onload = function(e) {
        //self.src = e.target.result;
        //self.imglistselected.push(e.target.result);
        self.imglistselected.push({
          img: e.target.result.split(",")[1],
          filename: filename,
          extension: extension
        });
      };
      reader.readAsDataURL(img);
    },

    beforeTabSwitch: function() {
      alert("This is called before switchind tabs");
      return true;
    },
    onComplete: function() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      if (!isEmpty) {
        const evt = new FormData();
        evt.append("image", data.split(",")[1]);
        evt.append("transactionId", this.fleetregistryId);
        evt.append("created_by", self.created_by);
        api.instance
          .post("wfms/UploadFleetSignature", evt)
          .then(res => {
            miniToastr.success("Fleet has successfully departed.");
          })
          .catch(function(error) {
            miniToastr.error(error);
          });
      } else {
        miniToastr.error("Please provide signature!");
      }
    },
    onSigClear: function() {
      this.$refs.signaturePad.clearSignature();
    },
    onChange: function() {
      this.$nextTick(function() {
        this.$refs.signaturePad.resizeCanvas();
      });
    },
    resizeCanvas() {
      // When zoomed out to less than 100%, for some very strange reason,
      // some browsers report devicePixelRatio as less than 1
      // and only part of the canvas is cleared then.
      var ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d").scale(ratio, ratio);
    }
  }
};
</script>
