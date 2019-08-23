<template>
  <div class="animated fadeIn">
    <div class="dispatch-list row">
      <b-button variant="none" @click="back">
        <i class="fa fa-chevron-left"></i> Back
      </b-button>
    </div>
    <b-card no-body>
      <div slot="header">
        <span>Checklist Report</span>
        <a
          href="#"
          class="btn btn-sm btn-info float-right ml-1"
          id="printpagebutton"
          @click="onPrint"
        >
          <i class="fa fa-print"></i> Print
        </a>
        <button id="printexport" class="btn btn-sm btn-info float-right" @click="onexport">Export</button>
      </div>
      <b-card-body>
        <div>
          Fleet Registry:
          <strong>{{this.fleetregistryId}}</strong>
        </div>
        <b-row class="mb-1">
          <b-col sm="8" class="mb-1" v-for="(item,index) in items" :key="index">
            <div>
              Plate no:
              <strong>{{item.plateno}}</strong>
            </div>
            <div>Vehicletype: {{item.vehicletype}}</div>
          </b-col>

          <b-col sm="4" v-for="(item,index) in transmas" :key="index">
            <div>
              Arrival Date:
              <strong>{{item.arrivaldatetime | moment("dddd, MMMM Do YYYY, h:mm a") }}</strong>
            </div>
            <div>
              Departure Date:
              <strong>{{item.departuredatetime | moment("dddd, MMMM Do YYYY, h:mm a" )}}</strong>
            </div>
          </b-col>
        </b-row>
        <b-table
          show-empty
          stacked="md"
          fixed
          small
          :busy.sync="isBusy"
          :items="checkTrans"
          :fields="fields"
          :filter="filter"
        >
          <template slot="action_button" slot-scope="row">
            <b-button
              class="btn btn-primary btn-sm"
              size="sm"
              variant="btn-primary"
              @click="row.toggleDetails"
            >{{ row.detailsShowing ? 'Hide' : 'Show' }} Attachment</b-button>
          </template>

          <template slot="row-details" slot-scope="data">
            <b-card style="border:none;">
              <div class="col-12 sm-4 md-2">
                <div class="box" v-for="(item,index) in data.item.attachment" :key="index">
                  <div class="image">
                    <img class="img-thumbnail" :src="item.img" style="width: 100px; height: 100px;" />
                  </div>
                </div>
              </div>
            </b-card>
          </template>
        </b-table>
      </b-card-body>
    </b-card>
    <b-row>
      <b-col v-for="(item,index) in signature" :key="index">
        <img style="width:175px;height:95px;" :src="item.img" />
      </b-col>
    </b-row>
    <b-row class="ml-2 mb-5">
      <b-col>
        <u v-for="(item,index) in transmas" :key="index">
          <strong>{{item.firstname +" "+item.middlename +" "+item.lastname}}</strong>
        </u>
        <div>Driver</div>
      </b-col>
      <b-col sm="4">
        <u v-for="(item,index) in items" :key="index">
          <strong>{{item.created_by}}</strong>
        </u>
        <div>Prepared by</div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import api from "../../services/api";
import JSONToCSVConvertor from "./../../services/JSONToCSVConvertor.js";
export default {
  data: function() {
    return {
      isBusy: false,
      filter: null,
      fields: {
        checklistalias: {
          label: "Checklistalias",
          sortable: true
        },
        shortname: {
          label: "Shortname",
          sortable: true
        },
        description: {
          label: "Description",
          sortable: true
        },
        action_button: {
          label: "Action",
          class: "action-button"
        }
      },
      items: [],
      transmas: [],
      checkTrans: [],
      signature: [],
      fleetregistryId:
        this.$route.params.id == undefined ? "" : this.$route.params.id
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
      JSONToCSVConvertor(this.items, "Checklist Report", true);
    },
    initTable() {
      // Here we don't set isBusy prop, so busy state will be handled by table itself
      this.isBusy = true;
      let self = this;
      self.$store.commit("setLoading", true);
      let promise = api.instance.get(
        "wfms/get-fleet-reg-report?id=" + this.$route.params.id
      );

      return promise
        .then(resp => {
          self.items = resp.data.fleetreg;
          self.transmas = resp.data.transmas;
          self.transmas = resp.data.transmas;
          self.checkTrans = resp.data.checkTrans;
          self.signature = resp.data.signature;

          // Here we could override the busy state, setting isBusy to false
          self.isBusy = false;
          self.$store.commit("setLoading", false);
          api.httpMsg(self, err.status, err.data);
          //   return items;
        })
        .catch(error => {
          // Here we could override the busy state, setting isBusy to false
          self.isBusy = false;
          self.$store.commit("setLoading", false);
          api.httpMsg(self, err.status, err.data);

          // Returning an empty array, allows table to correctly handle busy state in case of error
          return [];
        });
    },
    back: function() {
      this.$router.push("/Report/636427046438810000");
    }
  },
  created: function() {
    this.initTable();
  }
};
</script>
