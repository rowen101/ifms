<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12" class="mt-1">
        <div class="dispatch-list row">
          <b-button variant="none" @click="back">
            <i class="fa fa-chevron-left"></i> Back
          </b-button>
        </div>
        <b-card :header="appendtext +' Checklist Indicator Setup'">
          <b-alert :show="isShowAlert" variant="success" isShowAlert="false">
            <p>
              Successfully {{appendtext}}
              <b-button v-show="buttonishow" variant="primary" @click="reload" size="sm">
                <i class="fa fa-plus-circle"></i>&nbsp;Checklist Indicator
              </b-button>
            </p>
          </b-alert>

          <b-form @submit="onSubmit" v-if="!isShowAlert">
            <b-alert :show="errors.length > 0" variant="danger">
              <h6 class="alert-heading">Please fill in all required field!</h6>
              <ul>
                <li v-for="(error,i) in errors" :key="`error-${i}`">{{ error }}</li>
              </ul>
            </b-alert>
            <b-form-group label="Indicator*">
              <input
                type="Text"
                class="form-control bg-white"
                @click="onIndicatorid"
                v-model="IndicatorDescription"
                readonly
              />
              <!-- <v-select v-model.trim="selectIndicatorid" :options="indicatoroptions" label="description"></v-select> -->
            </b-form-group>

            <b-form-group label="Alias ">
              <b-form-input
                id="plateno"
                type="text"
                v-model.trim="form.checklistalias"
                placeholder="Alias"
              ></b-form-input>
            </b-form-group>

            <b-form-checkbox-group stacked class="form-group col-md-12">
              <div class="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  id="isrequired"
                  value="1"
                  v-model.trim="checkedrequired"
                />
                <label class="custom-control-label" for="isrequired">is Required</label>
              </div>
            </b-form-checkbox-group>
            <b-form-checkbox-group stacked class="form-group col-md-12">
              <div class="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  id="isactive"
                  value="1"
                  v-model="checked"
                />
                <label class="custom-control-label" for="isactive">Status</label>
              </div>
            </b-form-checkbox-group>
            <div class="dispatch-table">
              <b-button type="submit" variant="primary">
                <i class="fa fa-save"></i>
                {{appendtext}}
              </b-button>
            </div>
            <div class="dispatch-list">
              <b-button type="submit" variant="primary" class="btn btn-primary btn-sm btn-block">
                <i class="fa fa-save"></i>
                {{appendtext}}
              </b-button>
            </div>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
    <b-modal v-model.trim="Indicatormodal" title="Select Indicator">
      <form class="form">
        <div style="height:50vh; overflow-x:auto;">
          <input
            type="text"
            class="form-control mb-2"
            v-model.trim="SearchIndicator"
            placeholder="Search Indicator"
          />
          <span v-if="filterIndicator.length == 0">No available Indicator.</span>
          <b-list-group-item v-for="(item,index) in filterIndicator" :key="index">
            <b-form-radio
              name="some-radios"
              :value="item"
              @change="onSelectIndicator"
            >{{item.description}}</b-form-radio>
          </b-list-group-item>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import api from "../../services/api";

export default {
  data() {
    return {
      errors: [],
      isShowAlert: false,
      indicatoroptions: [],
      buttonishow: this.$route.params.id == undefined ? true : false,
      selectIndicatorid: {},
      appendtext: this.$route.params.id == undefined ? "Create" : "Update",
      checkedrequired: false,
      checked: true,
      IndicatorDescription: "",
      SearchIndicator: "",
      Indicatormodal: false,
      form: {
        checklistindicatorId:
          this.$route.params.id == undefined ? "" : this.$route.params.id,
        checklistId: "",
        indicatorId: "",
        checklistalias: "",
        isrequired: false,
        status: "I",

        created_by:
          this.$store.getters.user.firstname +
          " " +
          this.$store.getters.user.lastname,
        create_date: "2017-05-11T14:35:31"
      }
    };
  },
  computed: {
    filterIndicator: function() {
      var self = this;
      return self.indicatoroptions.filter(function(cust) {
        return (
          cust.description
            .toLowerCase()
            .indexOf(self.SearchIndicator.toLowerCase()) >= 0
        );
      });
    }
  },
  methods: {
    checkForm: function(e) {
      if (this.form.indicatorId) {
        return true;
      }

      this.errors = [];

      if (!this.form.IndicatorId) {
        this.errors.push("IndicatorId required");
      }

      //e.preventDefault();
    },
    onSubmit: function(evt) {
      evt.preventDefault();
      if (!this.checkForm()) {
        return;
      }
      this.$store.commit("setLoading", true);
      if (this.appendtext == "Create") {
        api.instance
          .post("itsek/add-checklist-indicator", this.form)
          .then(() => {
            this.isShowAlert = true;
            this.$store.commit("setLoading", false);
          })
          .catch(function(err) {
            api.httpMsg(this, err.status, err.data);
            this.$store.commit("setLoading", false);
          });
      } else if (this.appendtext == "Update") {
        api.instance
          .put("itsek/edit-checklist-indicator", this.form)
          .then(() => {
            this.isShowAlert = true;
            this.$store.commit("setLoading", false);
          })
          .catch(function(err) {
            api.httpMsg(this, err.status, err.data);
            this.$store.commit("setLoading", false);
          });
      }
    },
    onSelectIndicator: function(val) {
      this.IndicatorDescription = val.description;
      this.form.indicatorId = val.indicatorId;
    },
    reload: function() {
      this.$router.go(this.$router.currentRoute);
    },
    back: function() {
      this.$router.push("/Maintenance/636917825233527778");
    },
    getData: function() {
      let self = this;

      if (this.$route.params.id !== undefined) {
        self.$store.commit("setLoading", true);
        api.instance
          .get(
            "itsek/get-checklist-indicator-by-id?checklistindicatorId=" +
              this.$route.params.id
          )
          .then(resp => {
            self.form = resp.data;
            self.IndicatorDescription = resp.data.IndicatorDescription;
            self.$store.commit("setLoading", false);
            if (self.form.status === "A") {
              self.checked = true;
            } else {
              self.checked = false;
            }
            if (self.form.isrequired === true) {
              self.checkedrequired = true;
            } else {
              self.checkedrequired = false;
            }
            self.$store.commit("setLoading", false);
          })
          .catch(err => {
            api.httpMsg(this, err.status, err.data);
            self.$store.commit("setLoading", false);
          });
      }
    },

    onIndicatorid: function() {
      let self = this;
      self.indicatoroptions = [];
      self.$store.commit("setLoading", false);
      api.instance
        .get("itsek/get-indicator-by-status")
        .then(function(resp) {
          resp.data.forEach(element => {
            self.indicatoroptions.push({
              description: element.description,
              indicatorId: element.indicatorId
            });
          });
          self.Indicatormodal = true;
          self.$store.commit("setLoading", false);
        })
        .catch(function(err) {
          api.httpMsg(this, err.status, err.data);
          self.$store.commit("setLoading", false);
        });
    }
  },
  created: function() {
    this.getData();
  },
  watch: {
    checked: function(val) {
      if (val) {
        this.form.status = "A";
      } else {
        this.form.status = "I";
      }
    },
    checkedrequired: function(val) {
      if (val) {
        this.form.isrequired = true;
      } else {
        this.form.isrequired = false;
      }
    }
  }
};
</script>
