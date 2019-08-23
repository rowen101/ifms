<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <div class="dispatch-table">
          <b-card>
            <div slot="header">
              <span>Indicator List</span>
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
                @click="$router.push('/Maintenance/636917825011241771/new/indicator')"
              >
                <i class="fa fa-plus-circle"></i>&nbsp;New Indicator
              </b-button>
            </div>
            <b-row>
              <b-col md="4" class="my-1">
                <b-form-group label-cols-sm="1" class="mb-0">
                  <b-input-group>
                    <b-form-input v-model="filter" placeholder="Type to Search" />
                    <b-input-group-append>
                      <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
            </b-row>&nbsp;
            <b-table
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
              :per-page="perPage"
              :filter="filter"
            >
              <template slot="action_button" slot-scope="data">
                <router-link
                  tag="button"
                  class="btn btn-primary btn-sm"
                  :to="'/Maintenance/636917825011241771/modify/indicator/' + data.item.indicatorId"
                >
                  <i class="fa fa-pencil-square-o"></i>
                </router-link>&nbsp;
                <b-button
                  size="sm"
                  variant="danger"
                  class="btn btn-danger btn-sm"
                  @click="onSelecteItemToDelete(data.item)"
                >
                  <i class="fa fa-trash-o"></i>
                </b-button>
              </template>
              <template slot="description" slot-scope="data">
                <div class="ellipsis">
                  <span>{{ data.item.description}}</span>
                </div>
              </template>
              <template slot="status" slot-scope="data">
                <i
                  :class="data.item.status == 'A' ?  'activeStatus icon-check active_icon' : 'inactiveStatus icon-close inactive_icon'"
                ></i>
              </template>
            </b-table>
          </b-card>
          <div style="margin-top:5px;">
            <b-pagination
              size="sm"
              :total-rows="totalItem"
              v-model="currentPage"
              :per-page="perPage"
              @input="onPageSelect"
            ></b-pagination>
          </div>
        </div>
        <div class="dispatch-list">
          <div>
            <p>Indicator List</p>
          </div>
          <div class="newButton">
            <b-button
              variant="primary"
              class="btnsm"
              @click="$router.push('/Maintenance/636917825011241771/new/indicator')"
            >
              <i class="fa fa-plus-circle"></i>&nbsp;New Indicator
            </b-button>
          </div>
          <b-list-group v-for="(item,index) in items" :key="`dynlist-${index}`" class="shadow">
            <b-list-group-item class="flex-column align-items-start">
              <div class="list-field">
                <span class="mb-1 dis">shortname:{{item.shortname}}</span>
              </div>

              <div class="list-field">
                <span class="mb-1 dis">description:</span>
                <div class="ellipsis">
                  <span>{{ item.description}}</span>
                </div>
              </div>
              <div class="list-field">
                <span class="mb-1 dis">attachrequired:</span>
                <span>{{item.attachrequired}}</span>
              </div>
              <div class="list-field">
                <span class="mb-1 dis">groupcode:</span>
                <span>{{item.groupcode}}</span>
              </div>
              <div class="list-field">
                <span class="mb-1 dis">valuedatatype:</span>
                <span>{{item.valuedatatype}}</span>
              </div>
              <hr />
              <div class="row">
                <div class="col">
                  <router-link
                    tag="button"
                    :to="'/Maintenance/636917825011241771/modify/indicator/' + item.indicatorId"
                    class="btn btnsm btn-primary btn-block"
                  >
                    <span class="text-light">
                      <i class="fa fa-pencil-square-o"></i>
                      Edit
                    </span>
                  </router-link>

                  <b-button
                    class="btn btnsm btn-danger btn-block"
                    @click="onSelecteItemToDelete(item)"
                  >
                    <span class="text-light">
                      <i class="fa fa-trash-o"></i>
                      Remove
                    </span>
                  </b-button>
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
import api from "../../services/api";
import JSONToCSVConvertor from "./../../services/JSONToCSVConvertor.js";
import miniToastr from "mini-toastr";
export default {
  data: function() {
    return {
      deleteModal: false,
      selectedItem: {},
      selectedItemLabel: "",

      perPage: this.$store.getters.perPage,
      totalItem: 0,
      currentPage: 1,
      filter: null,
      sortOptions: [],
      isBusy: false,
      fields: {
        action_button: {
          label: "Action",
          class: "action-button"
        },
        indicatorId: {
          label: "ID",
          sortable: true
        },
        shortname: {
          label: "Shortname",
          sortable: true
        },
        description: {
          label: "Description",
          sortable: false
        },
        attachrequired: {
          Label: "Attachrequired",
          sortable: true
        },

        valuedatatype: {
          label: "Valuedatatype"
        },
        status: {
          label: "Status"
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
      JSONToCSVConvertor(this.items, "Indicator List", true);
    },
    initTable() {
      // Here we don't set isBusy prop, so busy state will be handled by table itself
      this.isBusy = true;
      let self = this;
      self.$store.commit("setLoading", true);
      let promise = api.instance.get(
        "itsek/get-indicator-list?param=&tk=" +
          self.perPage +
          "&pg=" +
          self.currentPage
      );

      return promise
        .then(resp => {
          self.items = resp.data.indicators;
          self.totalItem = resp.data.totalItem;
          self.$store.commit("setLoading", false);
          // Here we could override the busy state, setting isBusy to false
          self.isBusy = false;
          //   return items;
        })
        .catch(err => {
          // Here we could override the busy state, setting isBusy to false
          self.isBusy = false;
          api.httpMsg(self, err.status, err.data);
          self.$store.commit("setLoading", false);
          // Returning an empty array, allows table to correctly handle busy state in case of error
          return [];
        });
    },

    onPageSelect(page) {
      this.isBusy = true;
      let self = this;
      self.$store.commit("setLoading", false);
      let promise = api.instance.get(
        "itsek/get-indicator-list?param=&tk=" + self.perPage + "&pg=" + page
      );

      return promise
        .then(resp => {
          self.items = resp.data.indicators;
          self.totalItem = resp.data.totalItem;
          self.$store.commit("setLoading", false);
          // Here we could override the busy state, setting isBusy to false
          self.isBusy = false;
        })
        .catch(err => {
          // Here we could override the busy state, setting isBusy to false
          self.isBusy = false;
          api.httpMsg(self, err.status, err.data);
          self.$store.commit("setLoading", false);
          // Returning an empty array, allows table to correctly handle busy state in case of error
          return [];
        });
    },
    onSelecteItemToDelete: function(param) {
      this.selectedItem = param;
      this.selectedItemLabel = this.selectedItem.indicatorId;
      this.deleteModal = true;
    },
    onDeleteItem: function() {
      this.$store.commit("setLoading", true);
      api.instance
        .delete(
          "itsek/remove-indicator?indicatorId=" + this.selectedItem.indicatorId
        )
        .then(resp => {
          this.initTable();
          this.deleteModal = false;
          miniToastr.success(resp.data);
          this.$store.commit("setLoading", false);
        })
        .catch(err => {
          miniToastr.error(err.response.data);
          api.httpMsg(self, err.status, err.data);
          this.$store.commit("setLoading", false);
        });
    }
  },
  created: function() {
    this.initTable();
  }
  // computed() {
  //   sortOptions()
  //     .filter(f => f.sortable)
  //     .map(f => {
  //       return;
  //     });
  // }
};
</script>
