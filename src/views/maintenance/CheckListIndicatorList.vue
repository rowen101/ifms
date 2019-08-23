<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <div class="dispatch-table">
          <b-card>
            <div slot="header">
              <span>CheckList Indicator</span>
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
                @click="$router.push('/Maintenance/636917825233527778/new/checklist-indicator')"
              >
                <i class="fa fa-plus-circle"></i>&nbsp;New Checklist Indicator
              </b-button>
            </div>
            <b-row>
              <b-col md="3" class="my-1">
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
              :per-page="perPage"
              :filter="filter"
            >
              <template slot="action_button" slot-scope="data">
                <router-link
                  tag="button"
                  :to="'/Maintenance/636917825233527778/modify/checklist-indicator/' + data.item.checklistindicatorId"
                  class="btn btn-primary btn-sm"
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
              <template slot="checklistdescription" slot-scope="data">
                <div class="ellipsis">
                  <span>{{ data.item.checklistdescription}}</span>
                </div>
              </template>
              <template slot="description" slot-scope="data">
                <div class="ellipsis">
                  <span>{{ data.item.description}}</span>
                </div>
              </template>
              <template slot="isrequired" slot-scope="data">
                <i
                  :class="data.item.isrequired == 1 ?  'activeStatus icon-check active_icon' : 'inactiveStatus icon-close inactive_icon'"
                ></i>
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
            <p>Checklist Indicator</p>
          </div>
          <div class="newButton">
            <b-button
              variant="primary"
              class="btnsm"
              @click="$router.push('/Maintenance/636917825233527778/new/checklist-indicator')"
            >
              <i class="fa fa-plus-circle"></i>&nbsp;New Checklist Indicator
            </b-button>
          </div>
          <b-list-group v-for="(item,index) in items" :key="`dynlist-${index}`" class="shadow">
            <b-list-group-item class="flex-column align-items-start">
              <div class="list-field">
                <span class="mb-1 dis">ID:{{item.checklistindicatorId}}</span>
              </div>

              <div class="list-field">
                <span class="mb-1 dis">Indicator Description:</span>
                <span>{{item.description}}</span>
              </div>
              <div class="list-field">
                <span class="mb-1 dis">Isrequired:</span>
                <i
                  :class="item.isrequired == true ?  'activeStatus icon-check active_icon' : 'inactiveStatus icon-close inactive_icon'"
                ></i>
              </div>
              <div class="list-field">
                <span class="mb-1 dis">Status:</span>
                <i
                  :class="item.status == 'A' ?  'activeStatus icon-check active_icon' : 'inactiveStatus icon-close inactive_icon'"
                ></i>
              </div>
              <hr />
              <div class="row">
                <div class="col">
                  <router-link
                    tag="button"
                    :to="'/Maintenance/636917825233527778/modify/checklist-indicator/' + item.checklistindicatorId"
                    class="btn btnsm btn-primary btn-block"
                  >
                    <span class="text-light">
                      <i class="fa fa-pencil-square-o"></i>
                      Edit
                    </span>
                  </router-link>

                  <b-button
                    class="btn btn-danger btnsm btn-block"
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
      isBusy: false,
      sortOptions: [],
      filter: null,
      fields: {
        action_button: {
          label: "Action",
          class: "action-button"
        },

        description: {
          label: "Checklist Discription",
          sortable: true
        },

        isrequired: {
          label: "Required",
          sortable: true
        },
        status: {
          label: "Status",
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
      JSONToCSVConvertor(this.items, "CheckList Indicator", true);
    },
    initTable() {
      // Here we don't set isBusy prop, so busy state will be handled by table itself
      this.isBusy = true;
      let self = this;
      self.$store.commit("setLoading", true);

      let promise = api.instance.get(
        "itsek/get-itsekchecklist-indicator?param=&tk=" +
          self.perPage +
          "&pg=" +
          self.currentPage
      );

      return promise
        .then(resp => {
          self.items = resp.data.listcheckindicator;
          self.totalItem = resp.data.totalItem;
          // Here we could override the busy state, setting isBusy to false
          self.isBusy = false;
          self.$store.commit("setLoading", false);

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
      let promise = api.instance.get(
        "itsek/get-itsekchecklist-indicator?param=&tk=" +
          self.perPage +
          "&pg=" +
          page
      );

      return promise
        .then(resp => {
          self.items = resp.data.listcheckindicator;
          self.totalItem = resp.data.totalItem;
          // Here we could override the busy state, setting isBusy to false
          self.isBusy = false;
          self.$store.commit("setLoading", false);
        })
        .catch(error => {
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
      this.selectedItemLabel = this.selectedItem.checklistId;
      this.deleteModal = true;
    },
    onDeleteItem: function() {
      this.$store.commit("setLoading", true);
      api.instance
        .delete(
          "itsek/remove-checklist-indicator?checklistId=" +
            this.selectedItem.checklistId
        )
        .then(resp => {
          this.initTable();
          this.deleteModal = false;
          miniToastr.success(resp.data);
          this.$store.commit("setLoading", false);
        })
        .catch(err => {
          miniToastr.error(err.response.data);
          api.httpMsg(this, err.status, err.data);
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

