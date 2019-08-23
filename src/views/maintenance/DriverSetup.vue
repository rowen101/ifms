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
        <b-card :header="appendtext +' Driver Setup'" class="mt-1">
          <b-alert :show="isShowAlert" variant="success" isShowAlert="false">
            <p>
              Successfully {{appendtext}}
              <b-button v-show="buttonishow" variant="primary" @click="reload" size="sm">
                <i class="fa fa-plus-circle"></i>&nbsp;Driver
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
            <b-form-group id="exampleInputGroup1" label="Trucker*">
              <!-- <v-select v-model.trim="selectedtrucker" :options="truckoption" label="ownername"></v-select> -->
              <input
                type="Text"
                class="form-control bg-white"
                @click="onGetTruckerID"
                v-model="truckingowner"
                readonly
              />
            </b-form-group>

            <div class="form-group">
              <label>License No*</label>
              <input
                type="text"
                v-model.trim="form.licenseno"
                class="form-control text-uppercase"
                placeholder="License No"
                :disabled="isDisabled == 1 ? true : false"
              />
            </div>

            <div class="form-group">
              <label>First Name*</label>
              <input
                type="text"
                placeholder="First Name"
                v-model.trim="form.firstname"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label>Last Name*</label>
              <input
                type="text"
                placeholder="Last Name"
                v-model.trim="form.lastname"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label>Middle Name*</label>
              <input
                type="teXt"
                placeholder="Middle Name"
                v-model.trim="form.middlename"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Nickname*</label>
              <input
                type="teXt"
                placeholder="Nickname"
                v-model.trim="form.nickname"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Email</label>
              <input
                type="text"
                placeholder="Email"
                v-model.trim="form.emailadd"
                class="form-control"
              />
              <!-- <div :class="['input-group', isEmailValid()]">
                <span class="input-group-addon" id="basic-addon1">
                  <span class="fa fa-envelope"></span>
                </span>
                <input
                  type="email"
                  class="form-control"
                  placeholder="Email Address"
                  v-model="form.emailadd"
                />
              </div>-->
            </div>

            <div class="form-group">
              <label>Contact*</label>
              <input
                type="number"
                id="mobile"
                placeholder="Contact"
                maxlength="11"
                v-model.trim="form.contactno"
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
    <!-- modal Trucker -->
    <b-modal v-model.trim="Truckerlistmodal" title="Select Trucker" @ok="onSelectedTruck">
      <form class="form">
        <div style="height:50vh; overflow-x:auto;">
          <input
            type="text"
            class="form-control mb-2"
            v-model.trim="SearchTrucking"
            placeholder="Search Trucker"
          />
          <span v-if="filterTrucking.length == 0">No available Trucker.</span>
          <b-list-group-item v-for="(item,index) in filterTrucking" :key="index">
            <b-form-radio
              v-model.trim="truckModel"
              name="some-radios"
              :value="item"
              @change="onSelectTruck"
            >{{item.ownername}}</b-form-radio>
          </b-list-group-item>
        </div>
      </form>
    </b-modal>
    <!-- <pre>{{$data|JSON}}</pre> -->
  </div>
</template>

  <script>
import api from "../../services/api";
import miniToastr from "mini-toastr";
export default {
  data() {
    return {
      errors: [],
      buttonishow: this.$route.params.id == undefined ? true : false,
      appendtext: this.$route.params.id == undefined ? "Create" : "Update",
      isDisabled: this.$route.params.id == undefined ? false : true,
      isShowAlert: false,
      truckoption: [],
      // selectedtrucker: {},
      truckingowner: "",
      SearchTrucking: "",
      Truckerlistmodal: false,
      truckModel: "",
      checked: true,
      reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      form: {
        truckercode: "",
        licenseno:
          this.$route.params.id == undefined ? "" : this.$route.params.id,
        firstname: "",
        middlename: "",
        lastname: "",
        nickname: "",
        contactno: "",
        emailadd: "",
        status: "A",

        created_by:
          this.$store.getters.user.firstname +
          " " +
          this.$store.getters.user.lastname,
        create_date: "2017-05-11T14:35:31"
      }
    };
  },
  computed: {
    filterTrucking: function() {
      var self = this;
      return self.truckoption.filter(function(cust) {
        return (
          cust.ownername
            .toLowerCase()
            .indexOf(self.SearchTrucking.toLowerCase()) >= 0
        );
      });
    }
  },
  methods: {
    isEmailValid: function() {
      return this.email == ""
        ? ""
        : this.reg.test(this.email)
        ? "has-success"
        : "has-error";
    },
    checkForm: function(e) {
      if (
        this.form.licenseno &&
        this.form.truckercode &&
        this.form.firstname &&
        this.form.middlename &&
        this.form.lastname &&
        this.form.nickname &&
        this.form.contactno
      ) {
        return true;
      }

      this.errors = [];
      if (!this.form.truckercode) {
        this.errors.push("Trucker required.");
      }
      if (!this.form.licenseno) {
        this.errors.push("Licenseno required");
      }
      if (!this.form.firstname) {
        this.errors.push("Firstname required.");
      }
      if (!this.form.lastname) {
        this.errors.push("Lastname required.");
      }
      if (!this.form.middlename) {
        this.errors.push("Middlename required.");
      }
      if (!this.form.nickname) {
        this.errors.push("Nickname required.");
      }

      if (!this.form.contactno) {
        this.errors.push("Contactno required.");
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
          .post("wfms/add-driver", this.form)
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
          .put("wfms/edit-driver", this.form)
          .then(() => {
            this.isShowAlert = true;
            this.$store.commit("setLoading", false);
          })
          .catch(function(err) {
            api.httpMsg(this, err.status, err.data);
            this.$store.commit("setLoading", false);
          });
      }
    },
    onSelectTruck(val) {
      this.form.truckercode = val.fleetownerId;
      this.truckingowner = val.ownername;
    },
    onSelectedTruck: function() {},
    back: function() {
      this.$router.push("/Maintenance/2017041905404978");
    },
    reload: function() {
      this.$router.go(this.$router.currentRoute);
    },
    onGetTruckerID: function() {
      this.$store.commit("setLoading", true);
      this.truckoption = [];
      api.instance
        .get(
          "wfms/get-active-trucker?brancode=" +
            this.$store.getters.selectedWarehouse +
            "&appname=WFMS"
        )
        .then(resp => {
          resp.data.forEach(element => {
            this.truckoption.push({
              ownername: element.ownername,
              ownertype: element.ownertype,
              fleetownerId: element.fleetownerId,
              branch: element.branch,
              contactperson: element.contactperson
            });
          });
          this.$store.commit("setLoading", false);
          this.Truckerlistmodal = true;
        })
        .catch(function(err) {
          api.httpMsg(this, err.status, err.data);
          console.log(err);
          this.$store.commit("setLoading", false);
        });
    },
    getInitdata: function() {
      let self = this;
      if (this.appendtext == "Update") {
        if (this.$route.params.id !== undefined) {
          api.instance
            .get("wfms/get-driver-by-id?licenseno=" + this.$route.params.id)
            .then(resp => {
              self.form = resp.data;

              self.truckingowner = resp.data.truckID;

              self.$store.commit("setLoading", false);
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
    // selectedtrucker: function(param) {
    //   this.form.branfleetownerId = param.id;
    // }
  },
  created: function() {
    this.getInitdata();
  }
};
</script>
