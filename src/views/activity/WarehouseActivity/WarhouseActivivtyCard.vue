<template>
  <div class="animated fadeIn">
    <div class="dispatch-list">
      <div></div>
      <router-link :to="'/Activity/636977057383879632'" tag="button" class="btn btn-none btn-sm">
        <i class="fa fa-chevron-left"></i>&nbsp;Warehouse Ativity Card
      </router-link>
    </div>
    <b-row>
      <b-col
        sm="4"
        v-for="(item,index) in transActivityList"
        :key="`dynlist-${index}`"
        v-show="item.iscancel == 0"
        class="mt-1"
      >
        <div>
          <b-card
            :header=" item.transDescription"
            :class="item.transfinish!==null ? 'card-accent-success' : 'card-accent-primary'"
          >
            <b-row>
              <b-col sm="8" class="mb-2">
                <span v-show="item.transtart != null">
                  Start Date:
                  {{item.transtart | moment("dddd, MMMM Do YYYY") }}
                </span>
                <span v-show="item.transtart != null">
                  Start Time:
                  {{item.transtart | moment(" h:mm:ss a") }}
                </span>
              </b-col>
              <b-col sm="8" class="mb-2">
                <span v-show="item.transfinish != null">
                  Finished Date:&nbsp;
                  {{item.transfinish | moment("dddd, MMMM Do YYYY") }}
                </span>
                <span v-show="item.transfinish != null">
                  Finished Time:&nbsp;
                  {{item.transfinish | moment("h:mm:ss a") }}
                </span>
              </b-col>
            </b-row>

            <b-row class="margin-top">
              <b-col mb="1" :class="item.transtart == null ? 'iscardshow':'iscardhide' +''">
                <b-button variant="danger" block @click="onSelecteItemToCancel(item)">Cancel</b-button>
                <br />
              </b-col>
              <b-col mb="1" :class="item.transtart == null ? 'iscardshow':'iscardhide' +''">
                <b-button variant="primary" block @click="onSelecteItemToStart(item)">Start</b-button>
              </b-col>
            </b-row>
            <b-row
              :class="item.transtart == null ? 'iscardhide':'iscardshow' +''"
              v-if="item.transfinish==null"
            >
              <b-col mb="1">
                <b-button variant="success" block @click="onSelecteItemToFinish(item)">Finish</b-button>
              </b-col>
            </b-row>
            <br />
            <div v-if="item.transfinish==null" v-show="item.transfinish == null">
              <b-list-group-item
                class="d-flex justify-content-between align-items-center"
                v-if="item.transtart!==null"
              >
                Time:
                <timer :params="item" ref="timeref"></timer>
              </b-list-group-item>
            </div>
          </b-card>
        </div>
      </b-col>
    </b-row>

    <b-modal title="System Message" v-model="AlertModal" @ok="onCancelItem">
      Are you sure you want to cancel
      <strong>{{selectedItemLabel}} ?</strong>
    </b-modal>

    <b-modal title="System Message" v-model="AlertModalStart" @ok="onStartItem">
      Are you sure you want to Start
      <strong>{{selectedItemLabel}} ?</strong>
    </b-modal>
    <b-modal title="System Message" v-model="AlertModalFinish" @ok="onFinishItem">
      Do you want to Finish
      <strong>{{selectedItemLabel}} ?</strong>
    </b-modal>
  </div>
</template>


<script>
import api from "../../../services/api";
import timer from "../../../components/Timers";
export default {
  data: function() {
    return {
      AlertModal: false,
      AlertModalStart: false,
      AlertModalFinish: false,
      selectedItem: {},
      selectedItemLabel: "",

      transActivityList: [],
      wherhosecard: [],
      form: {
        id: "",
        iscancel: null,
        transtart: ""
      }
    };
  },
  methods: {
    initData: function() {
      this.isBusy = true;
      let self = this;
      self.$store.commit("setLoading", true);
      if (self.$route.params.id !== undefined) {
        api.instance
          .get(
            "wfms/get-whrhousecard?seqid=" +
              self.$route.params.id +
              "&brancode=" +
              self.$store.getters.selectedWarehouse +
              "&createdby=" +
              self.$store.getters.user.firstname +
              " " +
              self.$store.getters.user.lastname
          )
          .then(resp => {
            self.transActivityList = resp.data.trans;
            self.wherhosecard = resp.data.wherhosecard;
            self.$store.commit("setLoading", false);
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
      }
    },
    //start modal
    onSelecteItemToStart: function(param) {
      this.selectedItem = param;
      this.selectedItemLabel = this.selectedItem.transcode;
      this.AlertModalStart = true;
      this.form.id = this.selectedItem.id;
    },
    //start
    onStartItem: function() {
      this.$store.commit("setLoading", true);
      api.instance
        .put("wfms/start-transactivity", this.selectedItem)
        .then(resp => {
          this.transActivityList.forEach(element => {
            if (element.id === resp.data.id) {
              element.transtart = resp.data.transtart;
            }
          });

          this.AlertModalStart = false;
          this.$store.commit("setLoading", false);
        })
        .catch(err => {
          api.httpMsg(this, err.status, err.data);
          this.$store.commit("setLoading", false);
        });
    },
    //cancel modal
    onSelecteItemToCancel: function(param) {
      this.selectedItem = param;
      this.selectedItemLabel = this.selectedItem.id;
      this.AlertModal = true;
      this.form.id = this.selectedItem.id;
      this.form.iscancel = this.selectedItem.id ? 1 : "";
    },
    //cancel
    onCancelItem: function() {
      this.$store.commit("setLoading", true);
      api.instance
        .put("wfms/cancel-transactivity", this.form)
        .then(resp => {
          this.transActivityList.forEach(element => {
            if (element.id === resp.data.id) {
              element.iscancel = resp.data.iscancel;
            }
          });
          this.AlertModalStart = false;
          this.$store.commit("setLoading", false);
        })
        .catch(err => {
          api.httpMsg(this, err.status, err.data);
          this.$store.commit("setLoading", false);
        });
    },
    //finish modal
    onSelecteItemToFinish: function(param) {
      this.selectedItem = param;
      this.selectedItemLabel = this.selectedItem.transcode;
      this.AlertModalFinish = true;
      this.form.id = this.selectedItem.id;
    },
    //finish
    onFinishItem: function() {
      let self = this;
      this.$store.commit("setLoading", true);
      api.instance
        .put("wfms/finish-transactivity", self.form)
        .then(resp => {
          self.transActivityList.forEach(element => {
            if (element.id === resp.data.id) {
              element.transfinish = resp.data.transfinish;
            }
          });
          self.AlertModalStart = false;
          self.$store.commit("setLoading", false);
        })
        .catch(err => {
          api.httpMsg(self, err.status, err.data);
          self.$store.commit("setLoading", false);
        });
    }
  },
  created: function() {
    this.initData();
  },
  components: {
    timer: timer
  }
};
</script>

