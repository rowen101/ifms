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
        <b-card :header="appendtext +' Warehouse Activity'" class="mt-1">
          <b-alert :show="isShowAlert" variant="success" isShowAlert="false">
            <p>
              Successfully {{appendtext}}
              <b-button v-show="buttonishow" variant="primary" @click="reload" size="sm">
                <i class="fa fa-plus-circle"></i>&nbsp;Warehouse Activity
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
            <div class="form-group">
              <label>SEQID</label>
              <input type="teXt" placeholder="Auto generate " class="form-control" readonly />
            </div>
            <div class="form-group">
              <label>Fleet</label>
              <input
                type="teXt"
                placeholder="Fleet"
                class="form-control bg-white"
                readonly
                @click="onTagFleet"
                v-model="FleetDescription"
              />
              <!-- <small class="text-muted">Trucker Name&nbsp;-&nbsp;Plate no</small> -->
            </div>
            <div class="form-group">
              <label>Customer*</label>
              <input
                type="teXt"
                placeholder="Customer"
                class="form-control bg-white"
                readonly
                @click="onModalCustCode"
                v-model="CustomerName"
              />
            </div>
            <div class="form-group">
              <label>Request No.*</label>
              <input
                type="teXt"
                placeholder="Request No"
                class="form-control"
                v-model.trim="form.requestno"
              />
            </div>
            <div class="form-group">
              <label>Picklist No*</label>
              <input
                type="teXt"
                placeholder="Picklist No"
                class="form-control"
                v-model.trim="form.picklistno"
              />
            </div>
            <div class="form-group">
              <label>Shipment No*</label>
              <input
                type="teXt"
                placeholder="Shipment No"
                class="form-control"
                v-model.trim="form.shipmentno"
              />
            </div>
            <b-form-group label="Delivery Date*">
              <b-input-group>
                <vue-ctk-date-time-picker no-header v-model="form.deliverydate"></vue-ctk-date-time-picker>
              </b-input-group>
            </b-form-group>
            <div class="form-group">
              <label>Remark</label>
              <input type="teXt" placeholder="Remark" class="form-control" v-model="form.remarks" />
            </div>

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
    <!-- modal Customer -->
    <b-modal v-model="CustomerModal" title="Select Customer" @ok="onSelectedCustcode">
      <form class="form">
        <div style="height:50vh; overflow-x:auto;">
          <input
            type="text"
            class="form-control mb-2"
            v-model="SearchCustcode"
            placeholder="Search Customer"
          />
          <span v-if="fileterCustcode.length == 0">No available Customer.</span>
          <b-list-group-item v-for="(item,index) in fileterCustcode" :key="index">
            <b-form-radio
              v-model="CustCodeModel"
              name="some-radios"
              :value="item"
              @change="onSelectCustCode"
            >{{item.custname}}</b-form-radio>
          </b-list-group-item>
        </div>
      </form>
    </b-modal>
    <!-- modal Fleet -->
    <b-modal title="Fleet" v-model="TagFleetModal" @ok="onAddFleet">
      <form class="form">
        <div style="height:50vh; overflow-x:auto;">
          <input
            type="text"
            class="form-control mb-2"
            v-model="SearchFleet"
            placeholder="Search Fleet"
          />
          <span v-if="filterfleet.length == 0">No available Fleet.</span>
          <b-list-group-item v-for="item in filterfleet" :key="item.licenseno">
            <b-form-radio
              v-model="LaneModel"
              name="some-radios"
              :value="item"
              @change="SelectFleet"
            >
              <!-- <span class="mr-2">FleetID:&nbsp;{{item.fleetregistryId}}</span> -->
              <span class="mr-2">Trucker:&nbsp;{{item.ownername}} -</span>
              <span class="mr-2">Plate no:&nbsp;{{item.plateno}}</span>
            </b-form-radio>
          </b-list-group-item>
        </div>
      </form>
    </b-modal>
  </div>
</template>

  <script>
import api from "../../../services/api";
import VueCtkDateTimePicker from "vue-ctk-date-time-picker";
import "vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css";
export default {
  components: {
    "vue-ctk-date-time-picker": VueCtkDateTimePicker
  },
  data() {
    return {
      errors: [],
      buttonishow: this.$route.params.id == undefined ? true : false,
      appendtext: this.$route.params.id == undefined ? "Create" : "Update",
      isDisabled: this.$route.params.id == undefined ? false : true,
      isShowAlert: false,
      customerlist: [],
      fleetList: [],
      SearchFleet: "",
      TagFleetModal: false,
      FleetDescription: "",
      SearchCustcode: "",
      CustomerModal: false,
      CustCodeModel: "",
      CustomerName: "",
      form: {
        seqid: "",
        custcode: "",
        remarks: "",
        shipmentno: "",
        picklistno: "",
        requestno: "",
        deliverydate: "",
        brancode: this.$store.getters.selectedWarehouse,
        createby:
          this.$store.getters.user.firstname +
          " " +
          this.$store.getters.user.lastname,
        createdate: "",
        fleetregistryId: ""
      }
    };
  },
  computed: {
    fileterCustcode: function() {
      var self = this;
      return self.customerlist.filter(function(cust) {
        return (
          cust.custname
            .toLowerCase()
            .indexOf(self.SearchCustcode.toLowerCase()) >= 0
        );
      });
    },
    filterfleet: function() {
      var self = this;
      return this.fleetList.filter(function(cust) {
        return (
          cust.plateno.toLowerCase().indexOf(self.SearchFleet.toLowerCase()) >=
          0
        );
      });
    }
  },
  methods: {
    checkForm: function(e) {
      if (
        this.form.custcode &&
        this.form.shipmentno &&
        this.form.picklistno &&
        this.form.requestno &&
        this.form.deliverydate
      ) {
        return true;
      }

      this.errors = [];

      if (!this.form.custcode) {
        this.errors.push("Custcode required.");
      }
      if (!this.form.requestno) {
        this.errors.push("Requestno required");
      }
      if (!this.form.picklistno) {
        this.errors.push("Picklistno required.");
      }
      if (!this.form.shipmentno) {
        this.errors.push("Shipmentno required.");
      }
      if (!this.form.deliverydate) {
        this.errors.push("Delivery Date required.");
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
          .post("wfms/addwarehouse", this.form)
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
          .put("wfms/update-warehouse", this.form)
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
    onSelectCustCode(val) {
      this.form.custcode = val.custcode;
      this.CustomerName = val.custname;
    },
    onSelectedCustcode: function() {},
    back: function() {
      this.$router.push("/Activity/636977057383879632");
    },
    reload: function() {
      this.$router.go(this.$router.currentRoute);
    },
    SelectFleet: function(val) {
      this.FleetDescription = val.ownername;
      this.form.fleetregistryId = val.fleetregistryId;
    },
    onAddFleet: function() {},
    onTagFleet: function(param) {
      let self = this;
      self.$store.commit("setLoading", true);
      self.fleetList = [];
      api.instance
        .get(
          "wfms/get-fleetregistry?brancode=" +
            self.$store.getters.selectedWarehouse
        )
        .then(resp => {
          resp.data.forEach(element => {
            self.fleetList.push({
              fleetregistryId: element.fleetregistryId,
              brancode: element.brancode,
              plateno: element.plateno,
              licenseno: element.licenseno,
              regtype: element.regtype,
              scancode: element.scancode,
              refdocument: element.refdocument,
              vehicletype: element.vehicletype,
              ownername: element.ownername
            });
          });

          self.$store.commit("setLoading", false);

          self.TagFleetModal = true;
        })
        .catch(function(err) {
          self.$store.commit("setLoading", false);
          api.httpMsg(self, err.status, err.data);
        });
    },
    onModalCustCode: function() {
      this.$store.commit("setLoading", true);
      this.customerlist = [];
      api.instance
        .get(
          "wfms/get-custcode?brancode=" + this.$store.getters.selectedWarehouse
        )
        .then(resp => {
          resp.data.forEach(element => {
            this.customerlist.push({
              custcode: element.custcode,
              custname: element.custname,
              address: element.address,
              contact: element.contact,
              shiptocode: element.shiptocode,
              shiptoaddress: element.shiptoaddress
            });
          });
          this.$store.commit("setLoading", false);
          this.CustomerModal = true;
        })
        .catch(function(err) {
          api.httpMsg(this, err.status, err.data);
          console.log(err);
          this.$store.commit("setLoading", false);
        });
    },
    //select warehouse activity by id
    getInitdata: function() {
      let self = this;
      if (self.appendtext == "Update") {
        if (self.$route.params.id !== undefined) {
          self.$store.commit("setLoading", true);
          api.instance
            .get(
              "wfms/get-wrehouse-sqid?brancode=" +
                self.$store.getters.selectedWarehouse +
                "&sqid=" +
                self.$route.params.id
            )
            .then(resp => {
              self.form = resp.data;

              self.CustomerName = resp.data.custname;
              self.FleetDescription = resp.data.ownername;

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
  }
};
</script>
