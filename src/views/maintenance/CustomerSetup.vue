<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <div class="dispatch-list row">
          <b-button variant="none" @click="back">
            <i class="fa fa-chevron-left"></i>
            Back
          </b-button>
        </div>
        <b-card :header="appendtext +' Customer Setup'" class="mt-1">
          <b-alert :show="isShowAlert" variant="success" isShowAlert="false">
            <p>
              Successfully {{appendtext}}
              <b-button v-show="buttonishow" variant="primary" @click="reload" size="sm">
                <i class="fa fa-plus-circle"></i>&nbsp;Customer
              </b-button>
            </p>
          </b-alert>

          <b-form @submit="onSubmit" v-if="!isShowAlert" autocomplete="off">
            <b-alert :show="errors.length > 0" variant="danger">
              <h6 class="alert-heading">Please fill in all required field!</h6>
              <ul>
                <li v-for="(error,i) in errors" :key="`error-${i}`">{{ error }}</li>
              </ul>
            </b-alert>
            <b-form-group id="exampleInputGroup1" label="Customer Code*">
              <!-- <v-select v-model.trim="selectedtrucker" :options="truckoption" label="ownername"></v-select> -->
              <input
                type="Text"
                class="form-control"
                v-model.trim="form.custcode"
                placeholder="Customer Code"
              />
            </b-form-group>

            <div class="form-group">
              <label>Parent code</label>
              <input
                type="text"
                v-model.trim="form.parentcode"
                class="form-control"
                placeholder="Parentcode"
              />
            </div>

            <div class="form-group">
              <label>Customer Name*</label>
              <input
                type="text"
                placeholder="Customer Name"
                v-model.trim="form.custname"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label>Address*</label>
              <input
                type="text"
                placeholder="Address"
                v-model.trim="form.address"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label>Contact #*</label>
              <input
                type="number"
                id="mobile"
                maxlength="11"
                placeholder="Contact"
                v-model.trim="form.contact"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Ship code*</label>
              <input
                type="text"
                placeholder="Shiptocode"
                v-model.trim="form.shiptocode"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Ship address*</label>
              <input
                type="text"
                placeholder="Shiptoaddress"
                v-model.trim="form.shiptoaddress"
                class="form-control"
              />
            </div>

            <b-form-group id="exampleGroup4">
              <b-form-checkbox-group id="exampleChecks">
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
  data: function() {
    return {
      errors: [],
      buttonishow: this.$route.params.id == undefined ? true : false,
      appendtext: this.$route.params.id == undefined ? "Create" : "Update",
      isDisabled: this.$route.params.id == undefined ? false : true,
      isShowAlert: false,
      CustomerItem: [],

      checked: true,
      form: {
        id: this.$route.params.id == undefined ? "" : this.$route.params.id,
        brancode: this.$store.getters.selectedWarehouse,
        custcode: "",
        parentcode: "",
        custname: "",
        address: "",
        contact: "",
        shiptocode: "",
        shiptoaddress: "",
        isactive: "",
        createby:
          this.$store.getters.user.firstname +
          " " +
          this.$store.getters.user.lastname,
        createdate: "",
        modifyby:
          this.$store.getters.user.firstname +
          " " +
          this.$store.getters.user.lastname,
        modifydate: ""
      }
    };
  },
  methods: {
    checkForm: function(e) {
      if (
        this.form.custcode &&
        this.form.custname &&
        this.form.address &&
        this.form.contact &&
        this.form.shiptocode &&
        this.form.shiptoaddress
      ) {
        return true;
      }

      this.errors = [];
      if (!this.form.custcode) {
        this.errors.push("Customer Code required.");
      }
      if (!this.form.custname) {
        this.errors.push("Customer Name required.");
      }
      if (!this.form.address) {
        this.errors.push("Address required.");
      }
      if (!this.form.contact) {
        this.errors.push("Contact # required.");
      }
      if (!this.form.shiptocode) {
        this.errors.push("Ship code required.");
      }
      if (!this.form.shiptoaddress) {
        this.errors.push("Ship Address required.");
      }
    },
    onSubmit: function(evt) {
      evt.preventDefault();
      if (!this.checkForm()) {
        return;
      }
      this.$store.commit("setLoading", true);
      if (this.appendtext == "Create") {
        api.instance
          .post("wfms/addcustomer", this.form)
          .then(resp => {
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
          .put("wfms/modify-customer", this.form)
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
    back: function() {
      this.$router.push("/Maintenance/636977056989346870/");
    },
    reload: function() {
      this.$router.go(this.$router.currentRoute);
    },
    getInitdata: function() {
      let self = this;
      if (self.appendtext == "Update") {
        if (self.$route.params.id !== undefined) {
          self.$store.commit("setLoading", true);
          api.instance
            .get("wfms/select-customer?id=" + self.$route.params.id)
            .then(resp => {
              self.form = resp.data;

              self.truckingowner = resp.data.truckID;

              self.$store.commit("setLoading", false);
              if (self.form.isactive === true) {
                self.checked = true;
              } else {
                self.checked = false;
              }
              self.$store.commit("setLoading", false);
            })
            .catch(err => {
              api.httpMsg(self, err.status, err.data);
              self.$store.commit("setLoading", false);
            });
        }
      }
    }
  },
  created: function() {
    this.getInitdata();
  },
  watch: {
    checked: function(val) {
      if (val) {
        this.form.isactive = true;
      } else {
        this.form.isactive = false;
      }
    }
  }
};
</script>
