<template>
  <div class="animated fadeIn">
    <cardView :data="cardData" />

    <b-row>
      <b-col md="12">
        <b-card header="Order Status">
          <b-table
            show-empty
            stacked="md"
            responsive="sm"
            hover
            striped
            fixed
            dark="dark"
            borderless="borderless"
            :busy.sync="isBusy"
            :items="items"
            :fields="fields"
            :per-page="perPage"
            :filter="filter"
          ></b-table>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import api from "../services/api";
import Cardview from "./dashboard/MainDashboardCardView";
import CardLine1ChartExample from "./dashboard/CardLine1ChartExample";
import CardLine2ChartExample from "./dashboard/CardLine2ChartExample";
import CardLine3ChartExample from "./dashboard/CardLine3ChartExample";
import CardBarChartExample from "./dashboard/CardBarChartExample";
import MainChartExample from "./dashboard/MainChartExample";
import SocialBoxChartExample from "./dashboard/SocialBoxChartExample";
import CalloutChartExample from "./dashboard/CalloutChartExample";
import { Callout } from "@coreui/vue";

export default {
  name: "dashboard",
  components: {
    cardView: Cardview,
    Callout,
    CardLine1ChartExample,
    CardLine2ChartExample,
    CardLine3ChartExample,
    CardBarChartExample,
    MainChartExample,
    SocialBoxChartExample,
    CalloutChartExample
  },
  data: function() {
    return {
      perPage: this.$store.getters.perPage,
      totalItem: 0,
      currentPage: 1,
      isBusy: false,
      filter: null,
      fields: {
        shipname: {
          label: "Ship to Name",
          sortable: true
        },
        groupno: {
          label: "Group Number",
          sortable: true
        },
        rdd: {
          label: "RDD",
          sortable: true
        },
        truckername: {
          label: "Truck Name",
          sortable: true
        },
        staginlane: {
          label: "Stagin Lane",
          sortable: true
        },
        picked: {
          label: "Picked",
          sortable: true
        },
        checked: {
          label: "Checked",
          sortable: true
        },
        dispatched: {
          label: "Dispatched",
          sortable: true
        }
      },
      items: [
        {
          id: 1,
          shipname: "Talibon",
          groupno: "123",
          rdd: "",
          truckername: "AOD",
          staginlane: "AVB 5547",
          picked: "25%",
          checked: "50%",
          dispatched: "0%",
          _cellVariants: { picked: "danger", checked: "warning" }
        },
        {
          id: 3,
          shipname: "Bogo",
          groupno: "123",
          rdd: "",
          truckername: "AOD",
          staginlane: "SBA 2545",
          picked: "25%",
          checked: "100%",
          dispatched: "0%",
          _cellVariants: { picked: "danger", checked: "success" }
        },
        {
          id: 2,
          shipname: "Borongan",
          groupno: "123",
          rdd: "",
          truckername: "AOD",
          staginlane: "ASE 5547",
          picked: "25%",
          checked: "100%",
          dispatched: "100%",
          _cellVariants: {
            picked: "danger",
            checked: "success",
            dispatched: "success"
          }
        }
      ],
      selected: "Month",
      cardData: []
    };
  },
   methods: {
    initTable: function() {
      // Here we don't set isBusy prop, so busy state will be handled by table itself
      this.isBusy = true;
      let self = this;
      self.$store.commit("setLoading", true);
      let promise = api.instance.get("/wfms/dashboard?brancode=" + this.$store.getters.selectedWarehouse);

      return promise
        .then(resp => {
          self.$store.commit("setLoading", false);
          self.cardData = resp.data;

          // Here we could override the busy state, setting isBusy to false
          self.isBusy = false;

          //   return items;
        })
        .catch(error => {
          // Here we could override the busy state, setting isBusy to false
          self.isBusy = false;
          self.$store.commit("setLoading", false);
          // Returning an empty array, allows table to correctly handle busy state in case
          // of error
          return [];
        });
    },
    variant(value) {
      let $variant;
      if (value <= 25) {
        $variant = "info";
      } else if (value > 25 && value <= 50) {
        $variant = "success";
      } else if (value > 50 && value <= 75) {
        $variant = "warning";
      } else if (value > 75 && value <= 100) {
        $variant = "danger";
      }
      return $variant;
    },
    flag(value) {
      return "flag-icon flag-icon-" + value;
    }
  },
  created: function() {
    this.initTable();
  }
};
</script>

<style>
/* IE fix */
#card-chart-01,
#card-chart-02 {
  width: 100% !important;
}
</style>
