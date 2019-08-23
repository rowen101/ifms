<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <div class="dispatch-list row">
          <b-button variant="none" @click="back">
            <i class="fa fa-chevron-left"></i>
          </b-button>
          <span>Fleet Checklist Setup</span>
        </div>
        <form-wizard
          @on-complete="onComplete"
          @on-change="onChange"
          title
          subtitle
          finish-button-text="Done"
          step-size="sm"
          color="#2196f3"
        >
          <tab-content title="Checklist" :before-change="beforeTabSwitch">
            <div class="dispatch-table">
              <b-card header="Fleet Checklist" class="mt-1">
                <input
                  ref="imageinput"
                  style="display:none;"
                  type="file"
                  @change="onfileselected"
                  multiple
                  id="fileinput"
                  accept="image/*"
                />
                <table class="table table-sm border">
                  <thead>
                    <th>Checklist</th>
                    <th>Action</th>
                    <th>Attachment</th>
                  </thead>
                  <tbody>
                    <tr v-for="(item,index) in checklist" :key="index">
                      <td>{{ index + 1}}. {{item.description}}</td>
                      <td>
                        <input-checklist
                          :valuedatatype="item.valuedatatype"
                          v-model.trim="item.checklistvalue"
                        />
                      </td>
                      <td>
                        <button
                          class="btn-sm"
                          :class="item.attachrequired ? 'btn-danger' : 'btn-primary'"
                          @click="onSelectImage(item)"
                        >
                          <i class="fa fa-paperclip"></i> View Attachment
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </b-card>
            </div>
            <div class="dispatch-list">
              <b-list-group v-for="(item,index) in checklist" :key="index" class="shadow">
                <b-list-group-item class="flex-column align-items-start">
                  <div class="list-field">
                    <span class="dis">
                      {{item.description}}&nbsp;
                      <input-checklist
                        :valuedatatype="item.valuedatatype"
                        :value="item.checklistvalue"
                        v-model="item.checklistvalue"
                      />
                    </span>
                    <hr />
                    <div class="row">
                      <div class="col mb-3">
                        <div style="text-align:center;">
                          <router-link
                            tag="button"
                            :to="'/Activity/636892437634740910/attactment/' + item.checklistransactionId"
                            class="btn btn-sm btn-block"
                            :class="item.attachrequired ? 'btn btn-danger' : 'btn btn-primary'"
                          >
                            <i class="fa fa-paperclip"></i>&nbsp;Attachment
                          </router-link>
                        </div>
                      </div>
                    </div>
                  </div>

                  <b-col>
                    <div class="list-field float-right"></div>
                  </b-col>
                </b-list-group-item>
              </b-list-group>
            </div>
          </tab-content>
          <tab-content title="Departure">
            <div class="col-12 mt-2">
              <b-alert :show="isShowSigAlert" variant="success" isShowSigAlert="false">
                <p>
                  The signature has successfully save.
                  <b-button variant="primary" size="sm" @click="back">Go back</b-button>
                </p>
              </b-alert>
              <b-row md="2">
                <VueSignaturePad
                  id="signature"
                  width="100%"
                  height="200px"
                  ref="signaturePad"
                  v-if="!isShowSigAlert"
                />
              </b-row>

              <b-row style="margin-top:5px;">
                <b-col class="col-sm-9" style="text-align:center;">
                  <h4>signature</h4>
                </b-col>
                <b-col>
                  <div style="float:right;">
                    <b-button @click="onSigClear" size="sm" variant="secondary">clear</b-button>&nbsp;
                  </div>
                </b-col>
              </b-row>
            </div>
          </tab-content>
        </form-wizard>
      </b-col>
    </b-row>
    <!-- <pre>{{$data |JSON}}</pre> -->
    <b-modal title="View Attachment" v-model="modalAttach" no-close-on-backdrop hide-footer>
      <span>{{selected.description}}</span>
      <b-tabs>
        <b-tab active>
          <template slot="title">
            <strong>Browse File</strong>
          </template>
          <b-alert :show="isShowAlert" variant="success">Upload Complete...</b-alert>
          <button
            type="button"
            class="btn btn-secondary mb-2"
            variant="outline-secondary"
            @click="onBrownserImage"
          >
            <i class="fa fa-file-image-o"></i>
            Browse Image
          </button>
          <div style="height:50vh; overflow-x:auto;" v-show="uploadCounter !=100 ? true : false">
            <div v-for="(file,index) in imglistselected" :key="file.img">
              <div class="box">
                <button type="button" class="delete" @click.prevent="onDeleteAttachmenttemp(file)">
                  <span>
                    <i style="color:#20a8d8;" class="fa fa-times-circle fa-lg"></i>
                  </span>
                </button>
                <div class="image">
                  <img
                    class="img-thumbnail"
                    v-bind:ref="'img-' + index"
                    :src="'data:image/png;base64,'+ file.img"
                    style="width: 100px; height: 100px;"
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
          <div class="row" style="height:50vh; overflow-x:auto;">
            <div v-for="(file,index) in uploadedImage" :key="index">
              <div class="box" v-if="!file.isdelete">
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
                    class="img-thumbnail"
                    :id="'img-' + index"
                    :src="file.img"
                    style="width: 100px; height: 100px;"
                  />
                </div>
              </div>
            </div>
          </div>
        </b-tab>
      </b-tabs>
    </b-modal>
  </div>
</template>

<script>
import api from "../../../services/api";
import InputChecklist from "../../../components/InputChecklist";
import miniToastr from "mini-toastr";

miniToastr.init();
export default {
  data: function() {
    return {
      isShowSigAlert: false,
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
      fleetregistryId:
        this.$route.params.id == undefined ? "" : this.$route.params.id
    };
  },

  components: {
    "input-checklist": InputChecklist
  },
  methods: {
    back: function() {
      this.$router.push("/Activity/636892437634740910");
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
    onDeleteAttachmenttemp(index) {
      this.imglistselected.splice(index, 1);
    },
    onUpload() {
      let self = this;
      var i = 0;
      for (var value of this.imglistselected) {
        const evt = new FormData();
        evt.append("image", value.img);
        evt.append("extension", value.extension);
        evt.append("origfilename", value.filename);
        evt.append(
          "checklistransactionId",
          this.selected.checklistransactionId
        );
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
            if (self.uploadCounter == 100) {
              this.imglistselected = [];
            }
          })
          .catch(function(error) {
            miniToastr.error(error);
          });
        i++;
      }
    },
    onSelectImage: function(param) {
      this.selected = param;
      this.modalAttach = true;
      this.imglistselected = [];
      this.uploadedImage = [];
      this.uploadCounter = 0;
      this.onGetChecklistAttachment(param.checklistransactionId);
    },
    onViewUploaded: function() {
      this.onGetChecklistAttachment(this.selected.checklistransactionId);
    },
    onGetChecklistAttachment: function(checklistTransId) {
      let self = this;
      self.$store.commit("setLoading", true);
      api.instance
        .get("wfms/get-checklist-attachment/" + checklistTransId)
        .then(resp => {
          self.uploadedImage = resp.data;
          self.$store.commit("setLoading", false);
        })
        .catch(err => {
          miniToastr.error(err);
        });
    },
    onBrownserImage: function() {
      this.isShowAlert = false;
      this.uploadCounter = 0;
      this.$refs.imageinput.click();
      this.files = null;
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
    initTable: function() {
      this.checklist = [];
      // Here we don't set isBusy prop, so busy state will be handled by table itself
      this.isBusy = true;
      let self = this;
      self.$store.commit("setLoading", true);
      let promise = api.instance.get(
        "wfms/get-checklist-indicator/" + self.fleetregistryId
      );

      return promise
        .then(resp => {
          self.$store.commit("setLoading", false);
          self.checklist = resp.data;
          // Here we could override the busy state, setting isBusy to false
          self.isBusy = false;
          //   return items;
        })
        .catch(error => {
          // Here we could override the busy state, setting isBusy to false
          self.isBusy = false;
          self.$store.commit("setLoading", false);
          // Returning an empty array, allows table to correctly handle busy state in case of error
          miniToastr.error(error);
          return [];
        });
    },
    beforeTabSwitch: function() {
      var jData = [];

      for (var key in this.checklist) {
        jData.push({
          checklistransactionId: this.checklist[key].checklistransactionId,
          checklistvalue: this.checklist[key].checklistvalue
        });
      }

      api.instance
        .post("wfms/post-updated-checklist", jData)
        .then(resp => {})
        .catch(error => {
          miniToastr.error(error);
        });
      return true;
    },
    onComplete: function() {
      this.$store.commit("setLoading", true);
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      if (!isEmpty) {
        const evt = new FormData();
        evt.append("image", data.split(",")[1]);
        evt.append("transactionId", this.fleetregistryId);
        evt.append("created_by", this.created_by);
        api.instance
          .post("wfms/UploadFleetSignature", evt)
          .then(res => {
            this.$store.commit("setLoading", false);
            this.isShowSigAlert = true;
          })
          .catch(function(error) {
            this.$store.commit("setLoading", false);
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
      // canvas.width = canvas.offsetWidth * ratio;
      // canvas.height = canvas.offsetHeight * ratio;
      // canvas.getContext("2d").scale(ratio, ratio);
    }
  },
  created: function() {
    this.initTable();
  }
};
</script>

<style>
#signature {
  border: 1px solid;
}
</style>

