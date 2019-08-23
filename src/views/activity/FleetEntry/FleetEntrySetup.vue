<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <div class="dispatch-list row">
          <b-button variant="none" @click="back">
            <i class="fa fa-chevron-left"></i> Back
          </b-button>
        </div>
        <b-card :header="appendtext +' Registrar Setup'" class="mt-1">
          <b-alert :show="isShowAlert" variant="success" isShowAlert="false">
            <p>
              Successfully {{appendtext}}
              <b-button v-show="buttonishow" variant="primary" @click="reload" size="sm">
                <i class="fa fa-plus-circle"></i>&nbsp;Registrar
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
              <!-- <v-select v-model="selectedtrucker" :options="truckerList" label="ownername"></v-select> -->

              <input
                type="Text"
                class="form-control bg-white"
                @click="onTruckerlist"
                v-model="fleetownername"
                readonly
              />
            </b-form-group>

            <b-form-group label="Transtype*">
              <!-- <v-select v-model="stranstype" :options="transTypeList" label="description"></v-select> -->
              <input
                type="Text"
                class="form-control bg-white"
                @click="onGetFleetregisterType"
                v-model="registertype"
                readonly
              />
            </b-form-group>

            <b-form-group label="Plate no*">
              <!-- <v-select v-model="selectedPlateno" :options="plateoption" label="plateno"></v-select> -->
              <input
                type="Text"
                class="form-control bg-white"
                @click="onPlatelist"
                v-model="PlateDescription"
                readonly
              />
            </b-form-group>

            <b-form-group label="License no.*">
              <!-- <v-select v-model="selectedLicenseno" :options="driveroptions" label="driverinfo"></v-select> -->
              <input
                type="Text"
                class="form-control bg-white"
                @click="onLicenseNo"
                v-model="licensedescription"
                readonly
              />
            </b-form-group>

            <b-form-group label="Parking Lane*">
              <!-- <v-select v-model="sparkinglane" :options="parkinglaneoption" label="laneOccupaid"></v-select> -->
              <input
                type="Text"
                class="form-control bg-white"
                @click="onParkinglane"
                v-model="Parkinglane"
                readonly
              />
            </b-form-group>
            <b-form-group label="Arrival Date Time*">
              <b-input-group>
                <vue-ctk-date-time-picker no-header v-model="form.arrivaldatetime"></vue-ctk-date-time-picker>
              </b-input-group>
            </b-form-group>
            <b-form-group label="Scan Code">
              <b-input-group>
                <b-form-input disabled placeholder="Auto generated " v-model.trim="form.scancode"></b-form-input>
                <b-input-group-append></b-input-group-append>
              </b-input-group>
            </b-form-group>
            <b-form-group label="Document / Reference No*">
              <b-input-group>
                <b-form-input v-model.trim="form.refdocument"></b-form-input>
                <b-input-group-append></b-input-group-append>
              </b-input-group>
            </b-form-group>
            <b-form-group label="Remark">
              <b-form-textarea
                id="textarea1"
                placeholder="Enter something"
                :rows="3"
                :max-rows="6"
                v-model.trim="form.remarks"
              ></b-form-textarea>
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
    <!-- modal for trucker -->
    <b-modal v-model="Truckerlistmodal" title="Select Trucker" @ok="onOkModalTrucker">
      <form class="form">
        <div style="height:50vh; overflow-x:auto;">
          <b-form-group>
            <input
              type="text"
              class="form-control mb-2"
              v-model="SearchTrucking"
              placeholder="Search Trucker"
            />
            <span v-if="filterTrucking.length == 0">No available trucker.</span>
            <b-list-group-item v-for="(item,index) in filterTrucking" :key="index">
              <b-form-radio
                name="trucker"
                :value="item"
                v-model="selectedTrucker"
                @change="onSelectedTrucker"
              >{{item.ownername}}</b-form-radio>
            </b-list-group-item>
          </b-form-group>
        </div>
      </form>
    </b-modal>
    <!-- modal for Plate no -->
    <b-modal v-model="Platelistmodal" title="Select Plate No" @ok="onSelecPlateno">
      <form class="form">
        <div style="height:50vh; overflow-x:auto;">
          <b-form-group>
            <input
              type="text"
              class="form-control mb-2"
              v-model="SearchPlateNo"
              placeholder="Search Plate No."
            />
            <span v-if="filterPlateno.length == 0">No available Plate No.</span>
            <b-list-group-item v-for="(item,index) in filterPlateno" :key="index">
              <b-form-radio
                v-model="platenoselect"
                name="some-radios"
                :value="item"
                @change="onSelectedPlateno"
              >{{item.plateno + " - "+ item.description}}</b-form-radio>
            </b-list-group-item>
          </b-form-group>
        </div>
      </form>
    </b-modal>
    <!-- modal for License -->
    <b-modal v-model="Licenselistmodal" title="Select License No." @ok="onSelectedLicense">
      <form class="form">
        <div style="height:50vh; overflow-x:auto;">
          <input
            type="text"
            class="form-control mb-2"
            v-model="SearchLicense"
            placeholder="Search Plate No."
          />
          <span v-if="filterLicense.length == 0">No available Driver.</span>
          <b-list-group-item v-for="item in filterLicense" :key="item.licenseno">
            <b-form-radio
              v-model="LicenseModel"
              name="some-radios"
              :value="item"
              @change="onSelectDriver"
            >{{item.licenseno + " - " +item.firstname +" "+item.lastname+" "+item.middlename }}</b-form-radio>
          </b-list-group-item>
        </div>
      </form>
    </b-modal>
    <!-- modal for transtype -->
    <b-modal v-model="Transtypemodal" title="Select Transtype.">
      <form class="form">
        <div style="height:50vh; overflow-x:auto;">
          <input
            type="text"
            class="form-control mb-2"
            v-model="SearchTranstype"
            placeholder="Search Transtype"
          />
          <span v-if="filterTranstype.length == 0">No available Transtype.</span>
          <b-list-group-item v-for="item in filterTranstype" :key="item.licenseno">
            <b-form-radio
              v-model="TranstypeModel"
              name="some-radios"
              :value="item"
              @change="SelectTranstype"
            >{{item.description}}</b-form-radio>
          </b-list-group-item>
        </div>
      </form>
    </b-modal>
    <!-- modal for Lane -->
    <b-modal v-model="LaneModal" title="Select Parking Lane.">
      <form class="form">
        <div style="height:50vh; overflow-x:auto;">
          <input
            type="text"
            class="form-control mb-2"
            v-model="SearchLane"
            placeholder="Search Parking Lane"
          />
          <span v-if="filterLane.length == 0">No available Parking Lane.</span>
          <b-list-group-item v-for="item in filterLane" :key="item.licenseno">
            <b-form-radio
              v-model="LaneModel"
              name="some-radios"
              :value="item"
              @change="SelectLane"
            >{{item.laneno}}</b-form-radio>
          </b-list-group-item>
        </div>
      </form>
    </b-modal>
    <!-- <pre>{{$data|JSON}}</pre> -->
  </div>
</template>
<script>
import api from "../../../services/api";
import VueCtkDateTimePicker from "vue-ctk-date-time-picker";
import "vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css";
import { watch } from "fs";
import miniToastr from "mini-toastr";
export default {
  components: {
    "vue-ctk-date-time-picker": VueCtkDateTimePicker
  },
  data() {
    return {
      SearchTrucking: "",
      SearchPlateNo: "",
      SearchLicense: "",

      appendtext: this.$route.params.id == undefined ? "Create" : "Update",
      buttonishow: this.$route.params.id == undefined ? true : false,
      errors: [],
      isShowAlert: false,
      SearchTranstype: "",
      fleetownername: "",
      truckerList: [],
      Transtypemodal: false,
      TranstypeModel: "",
      LicenseModel: {},
      licensedescription: "",
      SearchLane: "",
      Truckerlistmodal: false,
      LaneModal: false,
      LaneModel: "",
      registertype: "",
      PlateDescription: "",
      Platelistmodal: false,
      platenoselect: {},
      Licenselistmodal: false,
      radioplateno: "",
      transTypeList: [],
      plateoption: [],
      DriverItem: [],
      parkinglaneoption: [],
      Parkinglane: "",

      stranstype: {},
      sparkinglane: "",
      selectedTrucker: "",
      selectedPlateno: "",
      selectedLicenseno: "",

      form: {
        fleetregistryId:
          this.$route.params.id == undefined ? "" : this.$route.params.id,

        branfleetownerId: "",
        regtype: "",
        plateno: "",

        licenseno: "",
        parkinglane: "",
        arrivaldatetime: "",
        scancode: "",

        refdocument: "",
        remarks: "",
        ismailed: 0,
        brancode: this.$store.getters.selectedWarehouse,
        created_by:
          this.$store.getters.user.firstname +
          " " +
          this.$store.getters.user.lastname,
        create_date: ""
      }
    };
  },
  computed: {
    filterTrucking: function() {
      var self = this;
      return this.truckerList.filter(function(cust) {
        return (
          cust.ownername
            .toLowerCase()
            .indexOf(self.SearchTrucking.toLowerCase()) >= 0
        );
      });
    },
    filterPlateno: function() {
      var self = this;
      return this.plateoption.filter(function(cust) {
        return (
          cust.vehicletype
            .toLowerCase()
            .indexOf(self.SearchPlateNo.toLowerCase()) >= 0
        );
      });
    },
    filterTranstype: function() {
      var self = this;
      return this.transTypeList.filter(function(cust) {
        return (
          cust.description
            .toLowerCase()
            .indexOf(self.SearchTranstype.toLowerCase()) >= 0
        );
      });
    },
    filterLicense: function() {
      var self = this;
      return self.DriverItem.filter(function(cust) {
        return (
          cust.firstname
            .toLowerCase()
            .indexOf(self.SearchLicense.toLowerCase()) >= 0 ||
          cust.lastname
            .toLowerCase()
            .indexOf(self.SearchLicense.toLowerCase()) >= 0 ||
          cust.middlename
            .toLowerCase()
            .indexOf(self.SearchLicense.toLowerCase()) >= 0
        );
      });
    },
    filterLane: function() {
      var self = this;
      return this.parkinglaneoption.filter(function(cust) {
        return (
          cust.laneno.toLowerCase().indexOf(self.SearchLane.toLowerCase()) >= 0
        );
      });
    }
  },
  methods: {
    onSelectedLicense: function() {},

    onSelectDriver(val) {
      this.licensedescription =
        val.licenseno +
        " - " +
        val.firstname +
        " " +
        val.lastname +
        " " +
        val.middlename;
      this.form.licenseno = val.licenseno;
    },

    onOkModalTrucker: function() {},
    onSelectedTrucker(val) {
      this.form.branfleetownerId = val.fleetownerId;
      this.fleetownername = val.ownername;
      this.PlateDescription = "";
      this.form.plateno = "";
      this.form.licenseno = "";
      this.licensedescription = "";
    },

    checkForm: function(e) {
      if (
        this.form.regtype &&
        this.form.plateno &&
        this.form.licenseno &&
        this.form.parkinglane &&
        this.form.arrivaldatetime &&
        this.form.refdocument
      ) {
        return true;
      }

      this.errors = [];

      if (!this.form.regtype) {
        this.errors.push("Trans type required");
      }
      if (!this.form.plateno) {
        this.errors.push("Plate no required.");
      }

      if (!this.form.licenseno) {
        this.errors.push("License no required.");
      }
      if (!this.form.parkinglane) {
        this.errors.push("Parking lane required.");
      }
      if (!this.form.arrivalDateTime) {
        this.errors.push("Arrival Date Time required.");
      }
      if (!this.form.refdocument) {
        this.errors.push("Document / Reference no required.");
      }

      //e.preventDefault();
    },
    onSubmit: function(evt) {
      if (!this.checkForm()) {
        return;
      }
      this.$store.commit("setLoading", true);
      if (this.appendtext == "Create") {
        evt.preventDefault();

        api.instance
          .post("wfms/add-fleet-registry", this.form)
          .then(() => {
            this.isShowAlert = true;
            this.$store.commit("setLoading", false);
          })
          .catch(function(err) {
            this.$store.commit("setLoading", false);
            api.httpMsg(this, err.status, err.data);
          });
      } else if (this.appendtext == "Update") {
        evt.preventDefault();

        api.instance
          .put("wfms/edit-fleet-registry", this.form)
          .then(() => {
            this.isShowAlert = true;
            this.$store.commit("setLoading", false);
          })
          .catch(function(err) {
            this.$store.commit("setLoading", false);
            api.httpMsg(this, err.status, err.data);
          });
      }
    },

    onTruckerlist: function() {
      this.$store.commit("setLoading", true);
      this.truckerList = [];
      let self = this;
      api.instance
        .get(
          "wfms/get-active-trucker?brancode=" +
            self.$store.getters.selectedWarehouse +
            "&appname=WFMS"
        )
        .then(resp => {
          resp.data.forEach(element => {
            self.truckerList.push({
              fleetownerId: element.fleetownerId,
              id: element.id,
              ownername: element.ownername
            });
          });

          self.$store.commit("setLoading", false);
          self.Truckerlistmodal = true;
        })
        .catch(function(err) {
          self.$store.commit("setLoading", false);
          api.httpMsg(self, err.status, err.data);
        });
    },

    onPlatelist: function() {
      this.$store.commit("setLoading", true);
      this.plateoption = [];
      api.instance
        .get("wfms/get-plate-no?param=" + this.form.branfleetownerId)
        .then(resp => {
          resp.data.forEach(element => {
            this.plateoption.push({
              branfleetownerId: element.branfleetownerId,
              checklistId: element.checklistId,
              create_date: element.create_date,
              created_by: element.created_by,
              description: element.description,
              plateno: element.plateno,
              status: element.status,
              vehicletype: element.vehicletype
            });
          });

          this.$store.commit("setLoading", false);
          this.Platelistmodal = true;
        })
        .catch(function(err) {
          this.$store.commit("setLoading", false);
          api.httpMsg(this, err.status, err.data);
          miniToastr.error(err.data);
        });
    },
    onSelectedPlateno(val) {
      this.form.plateno = val.plateno;
      this.PlateDescription = val.plateno + " - (" + val.vehicletype + ")";
    },
    onSelecPlateno: function() {},
    reload: function() {
      this.$router.go(this.$router.currentRoute);
    },
    back: function() {
      this.$router.push("/Activity/2017060404262345");
    },
    onGetActiveFleetOwner: function() {
      let self = this;
      self.$store.commit("setLoading", true);
      api.instance
        .get(
          "wfms/get-active-trucker?brancode=" +
            self.$store.getters.selectedWarehouse +
            "&appname=WFMS"
        )
        .then(function(resp) {
          self.truckerList = resp.data;
          self.$store.commit("setLoading", false);
        })
        .catch(function(err) {
          self.$store.commit("setLoading", false);
          api.httpMsg(self, err.status, err.data);
        });
    },
    SelectTranstype(val) {
      this.registertype = val.description;
      this.form.regtype = val.regtype;
      this.Parkinglane = "";
    },
    onGetFleetregisterType() {
      //get type reigster inbound or outbound
      let self = this;
      self.transTypeList = [];
      self.$store.commit("setLoading", true);
      api.instance
        .get("wfms/get-registry-type")
        .then(function(resp) {
          resp.data.forEach(element => {
            self.transTypeList.push({
              description: element.description,
              regtype: element.regtype
            });
          });
          self.$store.commit("setLoading", false);
          self.Transtypemodal = true;
        })
        .catch(function(err) {
          api.httpMsg(self, err.status, err.data);
          self.$store.commit("setLoading", false);
        });
    },

    onParkinglane: function() {
      let self = this;
      self.parkinglaneoption = [];
      self.$store.commit("setLoading", true);
      api.instance
        .get(
          "wfms/get-select-fleetparkinglane?brancode=" +
            self.$store.getters.selectedWarehouse +
            "&trantype=" +
            self.form.regtype
        )
        .then(function(resp) {
          resp.data.forEach(element => {
            self.parkinglaneoption.push({
              id: element.id,
              laneno: element.laneno,
              laneOccupaid: element.laneOccupaid
            });
          });
          self.$store.commit("setLoading", false);
          self.LaneModal = true;
        })
        .catch(function(err) {
          self.$store.commit("setLoading", false);
          api.httpMsg(self, err.status, err.data);
        });
    },
    SelectLane(val) {
      this.form.parkinglane = val.id;
      this.Parkinglane = val.laneno;
    },
    onLicenseNo: function() {
      let self = this;
      self.DriverItem = [];
      self.$store.commit("setLoading", true);
      api.instance
        .get("wfms/get-driver-by-truckercode?val=" + this.form.branfleetownerId)
        .then(function(resp) {
          resp.data.forEach(element => {
            self.DriverItem.push({
              licenseno: element.licenseno,
              truckercode: element.truckercode,
              lastname: element.lastname,
              firstname: element.firstname,
              middlename: element.middlename,
              nickname: element.nickname,
              emailadd: element.emailadd,
              contactno: element.contactno,
              status: element.status
            });
          });
          self.$store.commit("setLoading", false);
          self.Licenselistmodal = true;
        })
        .catch(function(err) {
          api.httpMsg(self, err.status, err.data);
          self.$store.commit("setLoading", false);
        });
    },
    getData: function() {
      this.onGetActiveFleetOwner();

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
            self.registertype = resp.data.Transtype;
            self.Parkinglane = resp.data.lanedescription;
            self.licensedescription = resp.data.licensedescription;
            self.PlateDescription = resp.data.PlateDescription;
            self.fleetownername = resp.data.truckdes;
          })
          .catch(err => {
            api.httpMsg(self, err.status, err.data);
            self.$store.commit("setLoading", false);
          });
      }
    }
  },
  watch: {},
  created: function() {
    this.getData();
  }
};
</script>
