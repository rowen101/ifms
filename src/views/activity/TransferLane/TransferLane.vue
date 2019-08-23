<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <div class="dispatch-table">
          <b-card>
            <div slot="header">
              <span>Transfer Lane</span>
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
              <template slot="action_button" slot-scope="data">
                <b-button
                  size="sm"
                  variant="primary"
                  class="btn btn-primary btn-sm"
                  @click="onSelecteItemToMove(data.item)"
                >Move</b-button>
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
              <template slot="arrivaldatetime" slot-scope="data">
                <div>
                  <span>{{data.item.arrivaldatetime | moment("dddd, MMMM Do YYYY, h:mm:ss a") }}</span>
                </div>
              </template>
              <template slot="status" slot-scope="data">
                <i
                  :class="data.item.status == 1 ?  'activeStatus icon-check active_icon' : 'inactiveStatus icon-close inactive_icon'"
                ></i>
              </template>
              <template slot="isoccupied" slot-scope="data">
                <i
                  :class="data.item.isoccupied == 1 ?  'activeStatus icon-check active_icon' : 'inactiveStatus icon-close inactive_icon'"
                ></i>
              </template>
            </b-table>
          </b-card>
        </div>
        <div class="dispatch-list">
          <div>
            <p>Transfer Lane</p>
          </div>

          <b-list-group v-for="(item,index) in items" :key="`dynlist-${index}`" class="shadow">
            <b-list-group-item class="flex-column align-items-start">
              <div class="list-field">
                <span class="mb-1 dis">Plate Number:&nbsp;{{item.plateno}}</span>
              </div>
              <div class="list-field">
                <span>License Number:&nbsp;{{item.licenseno}}</span>
              </div>
              <div class="list-field">
                <span>Lane NO:</span>
                <span>{{item.parkinglane}}</span>
              </div>
              <div class="list-field">
                <span>Lane Description:&nbsp;{{item.laneDescription}}</span>
              </div>

              <div class="list-field">
                <span>Lane Type:&nbsp;{{item.lanetype}}</span>
              </div>

              <div class="list-field">
                <span>ADT: {{item.arrivaldatetime | moment("dddd, MMMM Do YYYY, h:mm:ss a") }}</span>
              </div>
              <hr />
              <div class="row">
                <div class="col">
                  <b-button
                    variant="primary"
                    class="btn btn-primary btnsm btn-block"
                    @click="onSelecteItemToMove(item)"
                  >Move</b-button>
                </div>
              </div>
            </b-list-group-item>
          </b-list-group>
        </div>
        <b-modal title="System Message" v-model="translaneModal" @ok="onTransfer">
          <b-row>
            <b-col md="12">
              <b-form>
                <label class="mr-sm-2" for="inline-form-custom-select-pref">From</label>
                <input
                  type="text"
                  class="form-control bg-white"
                  readonly
                  :value="selectedItemLabel"
                />
              </b-form>
              <small class="text-muted">Lane - Parking - Transtype</small>
              <br />
              <b-form>
                <label class="mr-sm-2" for="inline-form-custom-select-pref">To Loading Lane</label>
                <b-form-select v-model="SelectLaneType" class="mb-3">
                  <option
                    v-for="(selectOption, indexOpt) in laneTypes"
                    :key="indexOpt"
                    :value="selectOption"
                  >{{selectOption.laneno +" - "+selectOption.laneDesplay+" - "+selectOption.Transtype }}</option>
                </b-form-select>
              </b-form>
            </b-col>
          </b-row>
        </b-modal>
      </b-col>
      <!-- <pre>{{$data.form|JSON}}</pre> -->
    </b-row>
  </div>
</template>
<script>
import api from "../../../services/api";
import JSONToCSVConvertor from "../../../services/JSONToCSVConvertor";
import miniToastr from "mini-toastr";
export default {
  data: function() {
    return {
      translaneModal: false,
      selectedItem: {},
      selectedItemLabel: "",
      laneTypes: [],
      SelectLaneType: {},
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
        laneno: {
          label: "Laneno",
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

        remarks: {
          label: "Remarks",
          sortable: true
        }
      },
      items: [],
      form: {
        fleetregistryId: "",
        brancode: this.$store.getters.selectedWarehouse,
        parkinglane: "",
        regtype: "",
        created_by:
          this.$store.getters.user.firstname +
          " " +
          this.$store.getters.user.lastname,
        create_date: ""
      }
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
      JSONToCSVConvertor(this.items, "Lane Master", true);
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

    onSelecteItemToMove: function(param) {
      let self = this;
      self.selectedItem = param;
      self.selectedItemLabel =
        self.selectedItem.laneno +
        " - " +
        self.selectedItem.laneDescription +
        " - " +
        self.selectedItem.lanetype;
      self.form.fleetregistryId = self.selectedItem.fleetregistryId;

      self.$store.commit("setLoading", true);
      api.instance
        .get(
          "wfms/get-select-parkinglane?&laneid=" + self.selectedItem.parkinglane
        )
        .then(function(resp) {
          self.laneTypes = resp.data;

          self.translaneModal = true;
          self.$store.commit("setLoading", false);
        })
        .catch(function(err) {
          api.httpMsg(self, err.status, err.data);
          self.$store.commit("setLoading", false);
        });
    },
    onTransfer() {
      let self = this;
      self.$store.commit("setLoading", true);
      api.instance
        .put("wfms/move-lane", self.form)
        .then(function(resp) {
          miniToastr.success("Move complete successfully.");
          self.initTable();
          self.$store.commit("setLoading", false);
        })
        .catch(function(err) {
          api.httpMsg(self, err.status, err.data);
          self.$store.commit("setLoading", false);
        });
    }
  },
  created: function() {
    this.initTable();
  },
  watch: {
    SelectLaneType(param) {
      let self = this;
      self.form.parkinglane = param.id;
      self.form.regtype = param.trantype;
    }
  }
};
</script>
