<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <div class="dispatch-list row">
          <b-button variant="none" @click="back">
            <i class="fa fa-chevron-left"></i>
          </b-button>
          <span>Fleet Departure</span>
        </div>
        <div class="col-12 mt-2">
          <b-alert :show="isShowAlert" variant="success" @dismissed="isShowAlert=false">
            <p>Thank you the transaction has been save.</p>
          </b-alert>
          <b-row md="2">
            <VueSignaturePad
              id="signature"
              width="100%"
              height="200px"
              ref="signaturePad"
              v-if="!isShowAlert"
            />
          </b-row>

          <b-row style="margin-top:5px;" v-if="!isShowAlert">
            <b-col>
              <div style="float:right;">
                <b-button @click="onSigClear" variant="secondary">Clear</b-button>&nbsp;
                <b-button @click="onDepartureItem" variant="primary">Save</b-button>
              </div>
            </b-col>
          </b-row>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import api from "../../../services/api";

export default {
  data: function() {
    return {
      isShowAlert: false,
      form: {
        fleetregistryId:
          this.$route.params.id == undefined ? "" : this.$route.params.id,
        departuredatetime: "",
        created_by:
          this.$store.getters.user.firstname +
          " " +
          this.$store.getters.user.lastname
      }
    };
  },
  methods: {
    back: function() {
      this.$router.push("/Activity/2017060610325948");
    },
    initData: function() {
      this.isBusy = true;
      let self = this;
      self.$store.commit("setLoading", true);
      if (this.$route.params.id !== undefined) {
        api.instance
          .get(
            "wfms/get-fleet-registry-By-id?fleetregistryId=" +
              this.$route.params.id
          )
          .then(resp => {
            self.form = resp.data;

            self.$store.commit("setLoading", false);
            self.isBusy = false;
          })
          .catch(err => {
            // Here we could override the busy state, setting isBusy to false
            self.isBusy = false;
            self.$store.commit("setLoading", false);
            api.httpMsg(self, err.status, err.data);
            // Returning an empty array, allows table to correctly handle busy state in case of error
            return [];
          });
      }
    },
    onDepartureItem: function(evt) {
      // evt.preventDefault();
      // api.instance
      //   .put(
      //     this.$store.getters.apiName + "/api/wfms/add-departuretimedate",
      //     this.form
      //   )
      //   .then(() => {
      //     this.isShowAlert = true;
      //     this.$store.commit("setLoading", false);
      //   })
      //   .catch(function(error) {
      //     console.log(error);
      //     this.$store.commit("setLoading", false);
      //   });

      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      if (!isEmpty) {
        const evt = new FormData();

        evt.append("image", data.split(",")[1]);
        evt.append("transactionId", this.fleetregistryId);
        evt.append("created_by", this.created_by);
        api.instance
          .post(
            "wfms/UploadFleetSignaturedepart?fleetregistryid=" +
              this.form.fleetregistryId,
            evt
          )
          .then(res => {
            this.isShowAlert = true;
            miniToastr.success("Fleet has successfully departed.");
          })
          .catch(function(err) {
            // api.httpMsg(this, err.status, err.data);

            miniToastr.error(err);
          });
      } else {
        miniToastr.error("Please provide signature!");
      }
    },
    onComplete: function() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      console.log(data);
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
  },
  created: function() {
    this.initData();
  }
};
</script>

<style>
#signature {
  border: 1px solid;
}
</style>

