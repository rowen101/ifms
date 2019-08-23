<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <div class="dispatch-table">
          <b-card>
            <div slot="header">
              <span>Branch Trucker</span>
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
              <b-button variant="primary" @click="onGetAvailableTrucker">
                <i class="fa fa-plus-circle"></i>&nbsp;Select Branch Trucker
              </b-button>
            </div>
            <b-row>
              <b-col md="4" class="my-1">
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
              responsive="sm"
              show-empty
              stacked="md"
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
              <template slot="action_button" slot-scope="data">
                <b-button
                  size="sm"
                  variant="danger"
                  class="btn btn-danger btn-sm"
                  @click="onSelecteItemToDelete(data.item)"
                >
                  <i class="fa fa-trash-o"></i>
                </b-button>
              </template>
              <template slot="status" slot-scope="data">
                <i
                  :class="data.item.status == 'A' ?  'activeStatus icon-check active_icon' : 'inactiveStatus icon-close inactive_icon'"
                ></i>
              </template>
            </b-table>
          </b-card>
        </div>
        <div class="dispatch-list">
          <di class="row">
            <small>Branch Trucker List</small>
          </di>
          <div class="newButton">
            <b-button variant="primary" @click="onGetAvailableTrucker">
              <i class="fa fa-plus-circle"></i>&nbsp;Select Branch Trucker
            </b-button>
          </div>
          <b-list-group v-for="(item,index) in items" :key="`dynlist-${index}`" class="shadow">
            <b-list-group-item class="flex-column align-items-start">
              <div class="list-field">
                <span class="mb-1 dis">Owner ID:{{item.fleetownerId}}</span>
              </div>

              <div class="list-field">
                <span>Owner:{{item.ownername}}</span>
              </div>
              <div class="list-field">
                <span>Mobile:{{item.celphoneno}}</span>
              </div>
              <div class="list-field">
                <span>
                  Status:&nbsp;
                  <i
                    :class="item.status == 'A' ?  'activeStatus icon-check active_icon' : 'inactiveStatus icon-close inactive_icon'"
                  ></i>
                </span>
              </div>
              <div class="row">
                <div class="col">
                  <div style="text-align:center;">
                    <b-button
                      class="btn btn-danger btn-sm btn-block"
                      @click="onSelecteItemToDelete(item)"
                    >
                      <i class="fa fa-trash-o"></i>
                      Remove
                    </b-button>
                  </div>
                </div>
              </div>
            </b-list-group-item>
          </b-list-group>
        </div>
      </b-col>
      <b-modal title="System Message" v-model="deleteModal" @ok="onDeleteItem">
        Are you sure you want to remove
        <strong>{{selectedItemLabel}} ?</strong>
      </b-modal>
    </b-row>
    <b-modal
      v-model="availableModal"
      title="Select Available Trucker"
      ok-title="Save"
      @ok="onSaveBranchTrucker"
    >
      <span v-if="availableTrucker.length == 0">No available trucker.</span>
      <form class="form">
        <div style="height:50vh; overflow-x:auto;">
          <b-list-group>
            <b-list-group-item
              button
              v-for="(item,index) in availableTrucker"
              :key="index"
              @click="item.isSelect=!item.isSelect"
            >
              <input type="checkbox" v-model="item.isSelect" />
              {{item.fleetownerId}}
              <small>{{item.ownername}}</small>
            </b-list-group-item>
          </b-list-group>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import JSONToCSVConvertor from "./../../services/JSONToCSVConvertor.js";
import miniToastr from "mini-toastr";
export default {
  data: function() {
    return {
      filter: "",
      deleteModal: false,
      selectedItem: {},
      selectedItemLabel: "",
      perPage: this.$store.getters.perPage,
      totalItem: 0,
      currentPage: 1,
      isBusy: false,
      fields: {
        action_button: {
          label: "Action"
        },
        fleetownerId: {
          label: "Owner ID",
          sortable: true
        },
        ownername: {
          label: "Owner",
          sortable: true
        },
        contactperson: {
          label: "Contact Person",
          sortable: true
        },
        telephoneno: {
          label: "Tel"
        },
        celphoneno: {
          label: "Mobile"
        },
        emailadd: {
          label: "Email"
        },
        address: {
          label: "Address",
          sortable: true
        },
        status: {
          label: "Status",
          sortable: true
        }
      },
      items: [],
      availableTrucker: [],
      availableModal: false
    };
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
      JSONToCSVConvertor(this.items, "Branch Trucker List", true);
    },
    initTable: function() {
      // Here we don't set isBusy prop, so busy state will be handled by table itself
      this.isBusy = true;
      let self = this;
      self.$store.commit("setLoading", true);
      self.items = [];
      let promise = axios.get(
        this.$store.getters.apiName +
          "/api/wfms/getBranchTrucker?brancode=" +
          this.$store.getters.selectedWarehouse
      );

      return promise
        .then(resp => {
          resp.data.forEach(element => {
            self.items.push({
              id: element.id,
              address: element.wfms_fleetowner.address,
              celphoneno: element.wfms_fleetowner.celphoneno,
              contactperson: element.wfms_fleetowner.contactperson,
              create_date: element.wfms_fleetowner.create_date,
              created_by: element.wfms_fleetowner.created_by,
              emailadd: element.wfms_fleetowner.emailadd,
              fleetownerId: element.wfms_fleetowner.fleetownerId,
              imgfilename: element.wfms_fleetowner.imgfilename,
              ownername: element.wfms_fleetowner.ownername,
              ownertype: element.wfms_fleetowner.ownertype,
              remarks: element.wfms_fleetowner.remarks,
              status: element.wfms_fleetowner.status,
              telephoneno: element.wfms_fleetowner.telephoneno
            });
          });

          self.$store.commit("setLoading", false);
          // Here we could override the busy state, setting isBusy to false
          self.isBusy = false;
          //   return items;
        })
        .catch(err => {
          // Here we could override the busy state, setting isBusy to false
          self.isBusy = false;
          self.$store.commit("setLoading", false);
          api.httpMsg(self, err.status, err.data);
          // Returning an empty array, allows table to correctly handle busy state in case of error
          return [];
        });
    },
    onSelecteItemToDelete: function(param) {
      this.selectedItem = param;
      this.selectedItemLabel = this.selectedItem.fleetownerId;
      this.deleteModal = true;
    },
    onDeleteItem: function() {
      this.$store.commit("setLoading", true);
      axios
        .delete(
          this.$store.getters.apiName +
            "/api/wfms/deleteBranchTrucker/" +
            this.selectedItem.id
        )
        .then(resp => {
          this.initTable();
          this.deleteModal = false;
          miniToastr.success(resp.data);
          this.$store.commit("setLoading", false);
        })
        .catch(err => {
          miniToastr.success(err.response.data);
          api.httpMsg(this, err.status, err.data);
          this.$store.commit("setLoading", false);
        });
    },
    onGetAvailableTrucker: function() {
      this.availableTrucker = [];
      this.$store.commit("setLoading", true);
      axios
        .get(
          this.$store.getters.apiName +
            "/api/wfms/getFleetOwnerNotInBranTrucker?brancode=" +
            this.$store.getters.selectedWarehouse
        )
        .then(resp => {
          resp.data.forEach(element => {
            this.availableTrucker.push({
              isSelect: false,
              fleetownerId: element.fleetownerId,
              ownername: element.ownername,
              ownertype: element.ownertype,
              contactperson: element.contactperson,
              telephoneno: element.telephoneno,
              celphoneno: element.celphoneno,
              emailadd: element.emailadd,
              address: element.address,
              remarks: element.remarks,
              status: element.status,
              imgfilename: element.imgfilename,
              created_by: element.created_by,
              create_date: element.create_date
            });
          });

          this.$store.commit("setLoading", false);
          this.availableModal = true;
        })
        .catch(err => {
          api.httpMsg(this, err.status, err.data);
          this.$store.commit("setLoading", false);
        });
    },
    onSaveBranchTrucker: function() {
      this.$store.commit("setLoading", true);

      let payloadData = [];

      this.availableTrucker.forEach(element => {
        if (element.isSelect) {
          payloadData.push({
            fleetownerId: element.fleetownerId,
            brancode: this.$store.getters.selectedWarehouse,
            isActive: "A"
          });
        }
      });

      axios
        .post(
          this.$store.getters.apiName + "/api/wfms/postBranchTrucker",
          payloadData
        )
        .then(resp => {
          this.$store.commit("setLoading", false);
          miniToastr.success("Save Complete");

          this.initTable();
        })
        .catch(function(err) {
          api.httpMsg(this, err.status, err.data);
          this.$store.commit("setLoading", false);
        });
    }
  },
  created: function() {
    this.initTable();
  }
};
</script>

