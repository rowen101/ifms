<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <div slot="header">
        <a
          href="#"
          class="btn btn-sm btn-info float-right ml-1"
          onclick="javascript:window.print();"
        >
          <i class="fa fa-print"></i> Print
        </a>
        <a href="#" class="btn btn-sm btn-info float-right">Export</a>
      </div>
      <b-card-body>
        <b-row class="mb-4">
          <b-col sm="8" class="mb-2">
            <div>
              Fleet Registry:
              <strong>1</strong>
            </div>
            <div>
              Plate no:
              <strong>00185</strong>
            </div>
            <div>Driver: Ronel Gonzales</div>
          </b-col>

          <b-col sm="3">
            <div>
              Arrival Date:
              <strong>Date</strong>
            </div>
            <div>
              Departure Date:
              <strong>Date</strong>
            </div>
          </b-col>
        </b-row>
        <div class="table-responsive-sm">
          <b-table
            class="mb-0 table-outline"
            responsive="sm"
            hover
            small
            autocomplete="off"
            striped
            fixed
            head-variant="light"
            :busy.sync="isBusy"
            :items="items"
            :fields="fields"
          >
            <template slot="action_button" slot-scope="data">
              <router-link
                tag="button"
                :to="'/2017041905404978/modify/driver/' + data.item.licenseno"
                class="btn btn-primary btn-sm btn-square"
              >
                <i class="fa fa-pencil-square-o"></i>
              </router-link>&nbsp;
              <b-button
                size="sm"
                variant="danger"
                class="btn btn-danger btn-sm btn-square"
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
        </div>
      </b-card-body>
    </b-card>
    <b-row class="ml-2">
      <b-col sm="8" class="mb-5">
        <u>
          <strong>Ronel Gonzales</strong>
        </u>
        <div class="underline">Prepared by</div>
      </b-col>

      <b-col sm="3">
        <u>
          <strong>Signature</strong>
        </u>
        <div>Driver</div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import api from "../../../services/api";

export default {
  data: function() {
    return {
      sortOptions: [],
      isBusy: false,
      fields: {
        checklistransactionId: {
          label: "ID",
          sortable: true
        },
        description: {
          label: "description",
          sortable: true
        },
        valuedatatype: {
          label: "DataType",
          sortable: true
        },
        Action: {
          label: "Attachment"
        }
      },
      items: []
    };
  },
  methods: {
    initTable: function() {
      // Here we don't set isBusy prop, so busy state will be handled by table itself
      this.isBusy = true;
      let self = this;
      self.$store.commit("setLoading", true);
      let promise = api.instance.get("wfms/get-fleet-reg-report/1");

      return promise
        .then(resp => {
          self.items = resp.data;
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
    onPageSelect: function(page) {
      this.isBusy = true;
      let self = this;
      self.$store.commit("setLoading", true);
      let promise = api.instance.get("wfms/get-fleet-reg-report/1");

      return promise
        .then(resp => {
          self.items = resp;

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
    }
  },

  created: function() {
    this.initTable();
  }
};
</script>
