<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="6" md="12">
        <div class="dispatch-list row">
          <b-button variant="none" @click="back">
            <i class="fa fa-chevron-left"></i> Back
          </b-button>
        </div>
        <b-card :header="appendtext+' Trucker Setup'" class="mt-1">
          <b-alert :show="isShowAlert" variant="success" isShowAlert="false">
            <p>
              Successfully {{appendtext}}
              <b-button v-show="buttonishow" variant="primary" @click="reload" size="sm">
                <i class="fa fa-plus-circle"></i>&nbsp;Trucker
              </b-button>
            </p>
          </b-alert>

          <b-form @submit="onSubmit" v-if="!isShowAlert">
            <b-alert :show="errors.length > 0" variant="danger">
              <h6 class="alert-heading">Please fill in all required field!</h6>
              <ul>
                <li v-for="(error,i) in errors" :key="`error-${i}`">{{ error }}</li>
              </ul>
            </b-alert>
            <b-form-group id="exampleInputGroup1" label="Trucker ID*" label-for="exampleInput1">
              <b-form-input
                id="exampleInput1"
                type="text"
                v-model.trim="form.fleetownerId"
                placeholder="Trucker ID"
                :disabled="isDisabled == 1 ? true : false"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="exampleInputGroup2" label="Owner Name*" label-for="exampleInput2">
              <b-form-input
                id="exampleInput2"
                type="text"
                v-model.trim="form.ownername"
                placeholder="Owner name"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="exampleInputGroup3" label="Contact Person*" label-for="exampleInput3">
              <b-form-input
                id="exampleInput3"
                type="text"
                v-model.trim="form.contactperson"
                placeholder="Contact Person"
              ></b-form-input>
            </b-form-group>

            <b-form-group>
              <label>Tel*</label>
              <b-input-group>
                <b-form-input
                  type="number"
                  id="tel"
                  v-model.trim="form.telephoneno"
                  placeholder="Telephone"
                ></b-form-input>
              </b-input-group>
            </b-form-group>

            <b-form-group>
              <label>Mobile*</label>
              <b-input-group prepend="+63">
                <b-form-input
                  type="number"
                  id="mobile"
                  max:11
                  v-model.trim="form.celphoneno"
                  placeholder="Mobile"
                ></b-form-input>
              </b-input-group>
            </b-form-group>

            <b-form-group>
              <label>Email*</label>
              <b-form-input type="email" v-model.trim="form.emailadd" placeholder="Enter Email"></b-form-input>
            </b-form-group>

            <b-form-group>
              <label>Address*</label>
              <b-form-textarea
                type="text"
                id="address"
                v-model.trim="form.address"
                placeholder="Enter Address"
                :rows="3"
                :max-rows="6"
              ></b-form-textarea>
            </b-form-group>

            <b-form-group>
              <label>Remarks</label>
              <b-form-input
                type="text"
                id="remarks"
                v-model.trim="form.remarks"
                placeholder="Enter Remarks"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="exampleGroup4">
              <b-form-checkbox-group
                stacked
                id="basicCustomCheckboxes"
                class="form-group col-md-12"
              >
                <div class="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id="isactive"
                    value="1"
                    v-model="checked"
                  />
                  <label class="custom-control-label" for="isactive">is Active</label>
                </div>
              </b-form-checkbox-group>
            </b-form-group>
            <div class="dispatch-table">
              <b-button type="submit" variant="primary">
                <i class="fa fa-save"></i>
                {{appendtext}}
              </b-button>
            </div>
            <div class="dispatch-list">
              <b-button type="submit" variant="primary" class="btn btn-primary btn-sm btn-block">
                <i class="fa fa-save"></i>
                {{appendtext}}
              </b-button>
            </div>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import api from "../../services/api";
import miniToastr from "mini-toastr";

miniToastr.init();
export default {
  data() {
    return {
      errors: [],
      isShowAlert: false,
      buttonishow: this.$route.params.id == undefined ? true : false,
      appendtext: this.$route.params.id == undefined ? "Create" : "Update",
      isDisabled: this.$route.params.id == undefined ? 0 : 1,
      checked: true,
      form: {
        fleetownerId:
          this.$route.params.id == undefined ? "" : this.$route.params.id,
        ownername: "",
        ownertype: "TRUCKER",
        contactperson: "",
        telephoneno: "",
        celphoneno: "",
        emailadd: "",
        address: "",
        remarks: "",
        status: "",
        appname: "WFMS",
        branch: this.$store.getters.selectedWarehouse,
        appname: "wfms",
        created_by:
          this.$store.getters.user.firstname +
          " " +
          this.$store.getters.user.lastname,
        create_date: ""
      }
    };
  },
  methods: {
    checkForm: function(e) {
      if (
        this.form.fleetownerId &&
        this.form.contactperson &&
        this.form.ownername &&
        this.form.telephoneno &&
        this.form.celphoneno &&
        this.form.emailadd &&
        this.form.address
      ) {
        return true;
      }

      this.errors = [];

      if (!this.form.fleetownerId) {
        this.errors.push("Truck ID required");
      }

      if (!this.form.ownername) {
        this.errors.push("Owner required.");
      }
      if (!this.form.contactperson) {
        this.errors.push("Contact person required.");
      }
      if (!this.form.telephoneno) {
        this.errors.push("Tel # required.");
      }
      if (!this.form.celphoneno) {
        this.errors.push("Mobile required.");
      }
      if (!this.form.emailadd) {
        this.errors.push("Email required.");
      }
      if (!this.form.address) {
        this.errors.push("Address required.");
      }

      //e.preventDefault();
    },

    onSubmit: function(evt) {
      evt.preventDefault();
      if (!this.checkForm()) {
        return;
      }

      this.$store.commit("setLoading", true);
      if (this.appendtext == "Create") {
        api.instance
          .post("wfms/add-fleet-owner", this.form)
          .then(() => {
            this.isShowAlert = true;
            this.$store.commit("setLoading", false);
          })
          .catch(err => {
            if (err.response.data === "") {
              api.httpMsg(this, err.status, err.data);
            } else {
              miniToastr.error(err.response.data);
            }
            this.$store.commit("setLoading", false);
          });
      } else if (this.appendtext == "Update") {
        api.instance
          .put("wfms/edit-fleet-owner", this.form)
          .then(() => {
            this.isShowAlert = true;
            this.$store.commit("setLoading", false);
          })
          .catch(err => {
            if (err.response.data === "") {
              api.httpMsg(this, err.status, err.data);
            } else {
              miniToastr.error(err.response.data);
            }
            this.$store.commit("setLoading", false);
          });
      }
    },
    reload: function() {
      this.$router.go(this.$router.currentRoute);
    },
    back: function() {
      this.$router.push("/Maintenance/2017041901085014");
    },
    countDownChanged: function(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert: function() {
      this.dismissCountDown = this.dismissSecs;
    },
    getData: function() {
      let self = this;
      if (this.$route.params.id !== undefined) {
        self.$store.commit("setLoading", true);
        api.instance
          .get("wfms/get-fleet-owner-by-id/" + this.$route.params.id)
          .then(resp => {
            self.form = resp.data;

            if (self.form.status === "A") {
              self.checked = true;
            } else {
              self.checked = false;
            }
            self.$store.commit("setLoading", false);
          })
          .catch(err => {
            api.httpMsg(this, err.status, err.data);
            self.$store.commit("setLoading", false);
          });
      }
    }
  },
  watch: {
    checked: function(val) {
      if (val) {
        this.form.status = "A";
      } else {
        this.form.status = "I";
      }
    }
  },
  created: function() {
    this.getData();
  }
};
</script>
