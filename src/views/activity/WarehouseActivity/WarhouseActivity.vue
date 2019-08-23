<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <div class="dispatch-table">
          <b-card>
            <div slot="header">
              <span>Warehouse Activity List</span>
              <a
                href="#"
                class="btn btn-sm btn-info float-right ml-1"
                id="printpagebutton"
                @click="onPrint"
              >
                <i class="fa fa-print"></i> Print
              </a>
              <button
                id="printexport"
                class="btn btn-sm btn-info float-right"
                @click="onexport"
              >Export</button>
            </div>

            <div class="newButton">
              <b-button
                variant="primary"
                @click="$router.push('/Activity/636977057383879632/new-activity')"
              >
                <i class="fa fa-plus-circle"></i>&nbsp;New Warehouse Activity
              </b-button>
            </div>
            <b-row>
              <b-col md="3" class="my-1">
                <b-form-group label-cols-sm="1" class="mb-0">
                  <b-input-group>
                    <b-form-input v-model="filter" placeholder="Search.." />
                    <b-input-group-append>
                      <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
            </b-row>&nbsp;
            <b-table
              class="mb-0 table-outline"
              responsive="sm"
              hover
              small
              striped
              fixed
              head-variant="light"
              :busy.sync="isBusy"
              :items="items"
              :fields="fields"
              :filter="filter"
            >
              <template slot="card_button" slot-scope="data">
                <b-button
                  size="sm"
                  variant="success"
                  class="btn btn-primary btn-sm mb-1"
                  @click="$router.push('/Activity/636977057383879632/sqid/' + data.item.seqid)"
                >ViewCard</b-button>
              </template>
              <template slot="action_button" slot-scope="data">
                <router-link
                  tag="button"
                  :to="'/Activity/636977057383879632/modify/' + data.item.seqid"
                  class="btn btn-primary btn-sm mb-1"
                >
                  <i class="fa fa-pencil-square-o"></i>&nbsp;Edit
                </router-link>&nbsp;
                <b-button
                  size="sm"
                  variant="primary"
                  class="btn btn-primary btn-sm mb-1"
                  @click="onTagFleet(data.item)"
                >TagFleet</b-button>
              </template>
              <template slot="isactive" slot-scope="data">
                <i
                  :class="data.item.isactive == 1 ?  'activeStatus icon-check active_icon' : 'inactiveStatus icon-close inactive_icon'"
                ></i>
              </template>
            </b-table>
          </b-card>
        </div>
        <div class="dispatch-list">
          <div>
            <p>Warehouse Activity List</p>
          </div>
          <div class="newButton">
            <b-button
              variant="primary"
              class="btnsm"
              @click="$router.push('/Activity/636977057383879632/new-activity')"
            >
              <i class="fa fa-plus-circle"></i>&nbsp;New Warehouse Activity
            </b-button>
          </div>
          <b-list-group v-for="(item,index) in items" :key="`dynlist-${index}`" class="shadow">
            <b-list-group-item class="flex-column align-items-start">
              <div class="list-field">
                <span class="mb-1 dis">Customer code: {{item.custcode}}</span>
              </div>

              <div class="list-field">
                <span>Shipment ID: {{item.shipmentno}}</span>
              </div>
              <div class="list-field">
                <span>Picklist ID: {{item.picklistno}}</span>
              </div>
              <div class="list-field">
                <span>Request ID: {{item.requestno}}</span>
              </div>
              <div class="list-field">
                <span>Remark: {{item.remarks}}</span>
              </div>
              <div class="list-field">
                <span>Owner Name: {{item.ownername}}</span>
              </div>
              <div class="list-field">
                <span>Plate #: {{item.plateno}}</span>
              </div>
              <div class="row">
                <div class="col">
                  <router-link
                    tag="button"
                    :to="'/Activity/636977057383879632/modify/' + item.seqid"
                    class="btn btn-primary btn-sm btn-block"
                  >
                    <i class="fa fa-pencil-square-o"></i>&nbsp;Idit
                  </router-link>

                  <b-button
                    size="sm"
                    variant="primary"
                    class="btn btn-primary btn-sm mr-2 btn-block"
                    @click="onTagFleet(item)"
                  >TagFleet</b-button>

                  <b-button
                    variant="success"
                    class="btn btnsm btn-block"
                    @click="$router.push('/Activity/636977057383879632/sqid/' + item.seqid)"
                  >View Card</b-button>
                </div>
              </div>
            </b-list-group-item>
          </b-list-group>
        </div>

        <b-modal title="Tag Fleet" v-model="TagFleetModal" @ok="onAddFleet">
          <form class="form">
            <div style="height:50vh; overflow-x:auto;">
              <input
                type="text"
                class="form-control mb-2"
                v-model="SearchFleet"
                placeholder="Search Plate no"
              />
              <span v-if="filterfleet.length == 0">No available Fleet.</span>
              <b-list-group-item v-for="item in filterfleet" :key="item.licenseno">
                <b-form-radio
                  v-model="LaneModel"
                  name="some-radios"
                  :value="item"
                  @change="SelectFleet"
                >
                  <span class="mr-2">FleetID:&nbsp;{{item.fleetregistryId}}</span>
                  <span class="mr-2">Plate no.&nbsp;{{item.plateno}}</span>
                  <span class="mr-2">License no:&nbsp;{{item.licenseno}}</span>
                </b-form-radio>
              </b-list-group-item>
            </div>
          </form>
        </b-modal>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import api from "../../../services/api";
import JSONToCSVConvertor from "../../../services/JSONToCSVConvertor.js";
import miniToastr from "mini-toastr";
export default {
  data: function() {
    return {
      TagFleetModal: false,
      SearchFleet: "",

      selectedItem: {},
      selectedItemLabel: "",

      isBusy: false,
      filter: "",
      sortOptions: [],
      fleetList: [],
      fields: {
        action_button: {
          label: "Action",
          class: "action-button"
        },

        card_button: {
          label: "Card",
          class: "action-button"
        },
        seqid: {
          label: "SEQID",
          thClass: ["width-100"],
          sortable: true
        },
        custcode: {
          label: "Customer Code",
          sortable: true
        },
        shipmentno: {
          label: "Shipment ID",
          sortable: false
        },
        picklistno: {
          Label: "Picklist ID",
          sortable: true
        },

        requestno: {
          label: "Rquest ID"
        },
        remarks: {
          label: "Remarks"
        },
        ownername: {
          label: "Trucker"
        },
        plateno: {
          label: "Plate No"
        }
      },
      items: [],
      form: {
        seqid: "",
        custcode: "",
        remarks: "",
        shipmentno: "",
        picklistno: "",
        requestno: "",
        fleetregistryId: "",
        createby:
          this.$store.getters.user.firstname +
          " " +
          this.$store.getters.user.lastname,
        createdate: ""
      }
    };
  },
  computed: {
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
    onPrint: function() {
      // this.isHidden = true;
      var printButton = document.getElementById("printpagebutton");
      var printExport = document.getElementById("printexport");
      var breadView = document.getElementById("breadview");
      //Set the print button visibility to 'hidden'
      printButton.style.visibility = "hidden";
      printExport.style.visibility = "hidden";
      breadView.style.visibility = "hidden";
      //Print the page content
      window.print();
      printButton.style.visibility = "visible";
      printExport.style.visibility = "visible";
      breadView.style.visibility = "visible";
    },
    onexport: function() {
      JSONToCSVConvertor(this.items, "Warehouse Activity List", true);
    },
    initTable() {
      this.isBusy = true;
      let self = this;
      self.$store.commit("setLoading", true);
      let promise = api.instance.get(
        "wfms/get-whseactivity-list?brancode=" +
          self.$store.getters.selectedWarehouse
      );

      return promise
        .then(resp => {
          self.items = resp.data;
          self.$store.commit("setLoading", false);
          self.isBusy = false;
        })
        .catch(err => {
          self.isBusy = false;
          api.httpMsg(self, err.status, err.data);
          self.$store.commit("setLoading", false);

          return [];
        });
    },

    onTagFleet: function(param) {
      let self = this;
      self.$store.commit("setLoading", true);
      self.selectedItem = param;
      self.selectedItemLabel = self.selectedItem.seqid;
      self.form.seqid = self.selectedItem.seqid;
      self.form.fleetregistryId = self.selectedItem.fleetregistryId;

      self.fleetList = [];
      api.instance
        .get(
          "wfms/get-fleetregistry?brancode=" +
            self.$store.getters.selectedWarehouse +
            "&seqid=" +
            self.form.seqid
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
              refdocument: element.refdocument
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
    SelectFleet: function(param) {
      this.form.fleetregistryId = param.fleetregistryId;
    },
    onAddFleet: function() {
      this.$store.commit("setLoading", true);
      api.instance
        .put("wfms/update-warehouse-fleetregid", this.form)
        .then(resp => {
          this.initTable();
          this.TagFleetModal = false;
          miniToastr.success("Fleet Successfully Added");
          this.$store.commit("setLoading", false);
        })
        .catch(err => {
          this.$store.commit("setLoading", false);
          api.httpMsg(this, err.status, err.data);
        });
    }
  },
  created: function() {
    this.initTable();
  }
};
</script>
