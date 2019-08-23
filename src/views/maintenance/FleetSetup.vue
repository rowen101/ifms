<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <div class="dispatch-list row">
          <b-button variant="none" @click="back">
            <i class="fa fa-chevron-left"></i> Back
          </b-button>
        </div>
        <b-card :header="appendtext+' Vehicles Setup'" class="mt-1">
          <b-alert :show="isShowAlert" variant="success" isShowAlert="false">
            <p>
              Successfully {{appendtext}}
              <b-button v-show="buttonishow" variant="primary" @click="reload" size="sm">
                <i class="fa fa-plus-circle"></i>&nbsp;Vehicles
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
            <b-form-group id="exampleInputGroup1" label="Owner ID*">
              <input
                type="Text"
                class="form-control bg-white"
                @click="onGetTruckerID"
                v-model="truckingowner"
                readonly
              />
            </b-form-group>

            <b-form-group id="exampleInputGroup2" label="plateno*">
              <b-form-input
                id="plateno"
                type="text"
                v-model.trim="form.plateno"
                placeholder="plateno"
                :disabled="isDisabled == 1 ? true : false"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="exampleInputGroup2" label="Vehicletype*">
              <input
                type="text"
                id="fleetype"
                v-model="vehiclediscription"
                placeholder="Vehicle Type"
                readonly
                @click="onVehicletype"
                class="form-control bg-white"
              />
            </b-form-group>
            <b-form-group label="Description*">
              <b-form-textarea
                id="textarea1"
                v-model.trim="form.description"
                placeholder="Enter Description"
                :rows="3"
                :max-rows="6"
              ></b-form-textarea>
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
    <!-- modal Trucker -->
    <b-modal v-model="Truckerlistmodal" title="Select Owner">
      <form class="form">
        <div style="height:50vh; overflow-x:auto;">
          <input
            type="text"
            class="form-control mb-2"
            v-model="SearchTrucking"
            placeholder="Search Trucker"
          />
          <span v-if="filterTrucking.length == 0">No available Owner.</span>
          <b-list-group-item v-for="(item,index) in filterTrucking" :key="index">
            <b-form-radio
              v-model="truckModel"
              name="some-radios"
              :value="item"
              @change="onSelectTruck"
            >{{item.ownername}}</b-form-radio>
          </b-list-group-item>
        </div>
      </form>
    </b-modal>
    <!-- modal VEHICLE -->
    <b-modal v-model="Vehiclelistmodal" title="Select Vehicle Type">
      <form class="form">
        <div style="height:50vh; overflow-x:auto;">
          <input
            type="text"
            class="form-control mb-2"
            v-model="SearchVehicle"
            placeholder="Search Vehicle Type"
          />
          <span v-if="filterVehicle.length == 0">No available Vehicle.</span>
          <b-list-group-item v-for="(item,index) in filterVehicle" :key="index">
            <b-form-radio
              v-model="vehicleModel"
              name="some-radios"
              :value="item"
              @change="vehiclestype"
            >{{item.drpdisplay}}</b-form-radio>
          </b-list-group-item>
        </div>
      </form>
    </b-modal>
    <!-- <pre>{{$data.form|JSON}}</pre> -->
  </div>
</template>

<script>
import api from "../../services/api";
import miniToastr from "mini-toastr";
miniToastr.init();
export default {
  data() {
    return {
      selectedtrucker: {},
      truckoption: [],
      truckingowner: "",
      errors: [],
      isShowAlert: false,
      buttonishow: this.$route.params.id == undefined ? true : false,
      vehicletypelist: [],
      options: [],
      driveroptions: [],
      truckoption: [],
      Vehiclelistmodal: false,
      vehiclediscription: "",
      SearchVehicle: "",
      vehicleModel: "",
      Truckerlistmodal: false,
      SearchTrucking: "",

      truckModel: "",
      checked: true,
      appendtext: this.$route.params.id == undefined ? "Create" : "Update",
      isDisabled: this.$route.params.id == undefined ? 0 : 1,
      form: {
        fleetownerId: "",
        plateno: "",
        vehicletype: "",
        description: "",
        checklistId: 0,
        status: "",

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
      return this.truckoption.filter(function(cust) {
        return (
          cust.ownername
            .toLowerCase()
            .indexOf(self.SearchTrucking.toLowerCase()) >= 0
        );
      });
    },
    filterVehicle: function() {
      var self = this;
      return this.vehicletypelist.filter(function(cust) {
        return (
          cust.drpdisplay
            .toLowerCase()
            .indexOf(self.SearchVehicle.toLowerCase()) >= 0
        );
      });
    }
  },
  methods: {
    checkForm: function(e) {
      if (
        this.form.fleetownerId &&
        this.form.plateno &&
        this.form.vehicletype &&
        this.form.description
      ) {
        return true;
      }

      this.errors = [];
      if (!this.form.fleetownerId) {
        this.errors.push("Owner required.");
      }
      if (!this.form.plateno) {
        this.errors.push("Plateno required.");
      }
      if (!this.form.vehicletype) {
        this.errors.push("Vehicletype required.");
      }
      if (!this.form.description) {
        this.errors.push("Description required.");
      }

      // e.preventDefault();
    },
    onSubmit: function(evt) {
      evt.preventDefault();
      if (!this.checkForm()) {
        return;
      }
      this.$store.commit("setLoading", true);
      if (this.appendtext == "Create") {
        this.form.checklistId = 0;
        api.instance
          .post("wfms/add-fleet", this.form)
          .then(() => {
            this.isShowAlert = true;
            this.$store.commit("setLoading", false);
          })
          .catch(function(err) {
            api.httpMsg(this, err.status, err.data);
            this.$store.commit("setLoading", false);
          });
      } else if (this.appendtext == "Update") {
        api.instance
          .put("wfms/edit-fleet", this.form)
          .then(() => {
            this.$store.commit("setLoading", false);
            this.isShowAlert = true;
          })
          .catch(function(err) {
            api.httpMsg(this, err.status, err.data);
            this.$store.commit("setLoading", false);
          });
      }
    },
    vehiclestype: function(val) {
      this.form.vehicletype = val.drpdata;
      this.vehiclediscription = val.drpdisplay;
    },
    onVehicletype: function() {
      this.$store.commit("setLoading", true);
      this.vehicletypelist = [];
      api.instance
        .get("wfms/get-select-vehicletype?drpids=VEHICLE")
        .then(resp => {
          resp.data.forEach(element => {
            this.vehicletypelist.push({
              id: element.id,
              dropid: element.dropid,
              drpdata: element.drpdata,
              drpdisplay: element.drpdisplay
            });
          });
          this.Vehiclelistmodal = true;
          this.$store.commit("setLoading", false);
        })
        .catch(function(err) {
          api.httpMsg(this, err.status, err.data);
          this.$store.commit("setLoading", false);
        });
    },
    onSelectVehicle: function() {
      this.form.vehicletype = this.vehicleModel;
    },
    onSelectedTruck() {},
    onSelectTruck(val) {
      this.form.fleetownerId = val.fleetownerId;
      this.truckingowner = val.ownername;
    },
    reload: function() {
      this.$router.go(this.$router.currentRoute);
    },

    back: function() {
      this.$router.push("/Maintenance/2017041905420722");
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
              fleetownerId: element.fleetownerId,
              id: element.id,
              ownername: element.ownername
            });
          });
          this.Truckerlistmodal = true;
          this.$store.commit("setLoading", false);
        })
        .catch(function(err) {
          api.httpMsg(this, err.status, err.data);
          this.$store.commit("setLoading", false);
        });
    },
    onGetActiveDriver: function(val) {
      let self = this;
      self.$store.commit("setLoading", true);
      api.instance
        .get("wfms/get-active-owner-drivers?fleetownerId=" + val)
        .then(function(resp) {
          self.driveroptions = resp.data;
          self.$store.commit("setLoading", false);
        })
        .catch(function(err) {
          api.httpMsg(self, err.status, err.data);
          self.$store.commit("setLoading", false);
        });
    },

    getData: function() {
      let self = this;
      if (this.$route.params.id !== undefined) {
        self.$store.commit("setLoading", true);
        api.instance
          .get("wfms/get-fleet-by-id?plateno=" + this.$route.params.id)
          .then(resp => {
            self.form = resp.data;
            self.truckingowner = resp.data.fleetdescription;
            self.vehiclediscription = resp.data.VehiclesDesciption;

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
    },
    selectedtrucker: function(param) {
      this.form.truckercode = param.fleetownerId;
    }
  },
  created: function() {
    this.getData();
  }
};
</script>
