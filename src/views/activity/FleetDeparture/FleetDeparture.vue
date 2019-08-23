<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12" class="mt-1">
        <div class="dispatch-table">
          <b-card>
            <div slot="header">
              <span>Fleet Departure</span>
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
            <b-row>
              <b-col md="3" class="my-1">
                <!--                <b-progress height="2px" :value="progressCap" variant="primary" class="mt-2"></b-progress>-->

                <br />
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
              head-variant="light"
              :busy.sync="isBusy"
              :items="items"
              :fields="fields"
              :per-page="perPage"
              :filter="filter"
            >
              <template slot="action_button" slot-scope="data">
                <router-link
                  tag="button"
                  :to="'/Activity/2017060610325948/departure-setup/' + data.item.fleetregistryId"
                  class="btn btn-primary btn-sm"
                >
                  <i class="fa fa-pencil-square-o"></i>
                  &nbsp;Departure
                </router-link>&nbsp;
              </template>
              <template slot="arrivaldatetime" slot-scope="data">
                <div>
                  <span>{{data.item.arrivaldatetime | moment("dddd, MMMM Do YYYY, h:mm:ss a") }}</span>
                </div>
              </template>
            </b-table>
          </b-card>
        </div>

        <div class="dispatch-list">
          <b-list-group v-for="(item,index) in items" :key="`dynlist-${index}`" class="shadow">
            <b-list-group-item class="flex-column align-items-start">
              <div class="list-field">
                <span class="mb-1 dis">Plateno:{{item.plateno}}</span>
              </div>
              <div class="list-field">
                <span>Licenseno:{{item.licenseno}}</span>
              </div>
              <div class="list-field">
                <span>ADT: {{item.arrivaldatetime | moment("dddd, MMMM Do YYYY, h:mm:ss a") }}</span>
              </div>
              <div class="row">
                <div class="col">
                  <div style="text-align:center;">
                    <router-link
                      tag="button"
                      :to="'/Activity/2017060610325948/departure-setup/' + item.fleetregistryId"
                      class="btn btn-primary btn-sm btn-block"
                    >
                      <i class="fa fa-pencil-square-o"></i>
                      Departure
                    </router-link>
                  </div>
                </div>
              </div>
            </b-list-group-item>
          </b-list-group>
        </div>
        <b-modal title="System Message" v-model="deleteModal" @ok="onDeleteItem">
          Are you sure you want to remove
          <strong>{{selectedItemLabel}} ?</strong>
        </b-modal>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import api from "../../../services/api";
import JSONToCSVConvertor from "../../../services/JSONToCSVConvertor.js";
export default {
  data: function() {
    return {
      progressCap: null,
      deleteModal: false,
      selectedItem: {},
      selectedItemLabel: "",
      selectedfile: null,
      perPage: this.$store.getters.perPage,
      totalItem: 0,
      currentPage: 1,
      isBusy: false,
      filter: null,
      fields: {
        action_button: {
          label: "Action",
          class: "action-button"
        },
        fleetregistryId: {
          label: "ID",
          sortable: true
        },
        plateno: {
          label: "Plate Number",
          sortable: true
        },
        licenseno: {
          label: "License Number",
          sortable: true
        },
        lanetype: {
          label: "Trans Type",
          sortable: true
        },
        scancode: {
          label: "Barcode",
          sortable: true
        },
        refdocument: {
          label: "Document",
          sortable: true
        },
        arrivaldatetime: {
          label: "ADT",
          sortable: true
        },
        laneno: {
          label: "Laneno",
          sortable: true
        },
        remarks: {
          label: "Remarks",
          sortable: true
        }
      },
      items: []
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
      JSONToCSVConvertor(this.items, "Fleet Departure", true);
    },
    onfileselected(event) {
      this.selectedfile = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(this.selectedfile);
      reader.onload = function() {
        console.log(reader.result.split(",")[1]);
      };
      reader.onerror = function(error) {
        console.log("Error: ", error);
      };
    },

    onUpload() {
      const imageToUri = require("image-to-uri");
      var imageAsBase64 = imageToUri(this.selectedfile);
      const evt = new FormData();
      evt.append("image", imageAsBase64);
      evt.append("origfilename", this.selectedfile.name);
      evt.append("extension", ".png");
      api.instance
        .post("wfms/UploadCustomerImage", evt, {
          onUploadProgress: uploadEvent => {
            this.progressCap = Math.round(
              (uploadEvent.loaded / uploadEvent.total) * 100
            );
          }
        })
        .then(res => {
          console.log(res);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    initTable() {
      // Here we don't set isBusy prop, so busy state will be handled by table itself
      this.isBusy = true;
      let self = this;
      self.$store.commit("setLoading", true);
      let promise = api.instance.get(
        "wfms/get-fleet-registry-arrival?brancode=" +
          self.$store.getters.selectedWarehouse
      );

      return promise
        .then(resp => {
          self.items = resp.data;
          self.totalItem = resp.data.totalItem;
          self.$store.commit("setLoading", false);
          // Here we could override the busy state, setting isBusy to false
          self.isBusy = false;
          //   return items;
        })
        .catch(error => {
          // Here we could override the busy state, setting isBusy to false
          self.isBusy = false;
          self.$store.commit("setLoading", false);
          // Returning an empty array, allows table to correctly handle busy state in case of error
          return [];
        });
    },
    onPageSelect(page) {
      this.isBusy = true;

      let self = this;
      self.$store.commit("setLoading", true);
      let promise = api.instance.get(
        "wfms/get-fleet-registry-arrival?brancode=" +
          self.$store.getters.selectedWarehouse
      );

      return promise
        .then(resp => {
          self.items = resp.data;
          self.totalItem = resp.data.totalItem;
          self.$store.commit("setLoading", false);
          // Here we could override the busy state, setting isBusy to false
          self.isBusy = false;
        })
        .catch(error => {
          // Here we could override the busy state, setting isBusy to false
          self.isBusy = false;
          self.$store.commit("setLoading", false);
          // Returning an empty array, allows table to correctly handle busy state in case of error
          return [];
        });
    },
    onSelecteItemToDelete: function(param) {
      this.selectedItem = param;
      this.selectedItemLabel = this.selectedItem.fleetregistryId;
      this.deleteModal = true;
    },
    onDeleteItem: function() {
      this.$store.commit("setLoading", true);
      api.instance
        .delete(
          "wfms/remove-fleet-registry?fleetregistryId=" +
            this.selectedItem.fleetregistryId
        )
        .then(resp => {
          this.initTable();
          this.deleteModal = false;
          this.$store.commit("setLoading", false);
        })
        .catch(error => {
          this.$store.commit("setLoading", false);
        });
    }
  },
  created: function() {
    this.initTable();
  }
};
</script>
