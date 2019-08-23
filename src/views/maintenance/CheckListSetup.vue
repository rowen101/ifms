<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12" class="mt-1">
        <div class="dispatch-list row">
          <b-button variant="none" @click="back">
            <i class="fa fa-chevron-left"></i> Back
          </b-button>
        </div>
        <b-card :header="appendtext + ' Indicator Setup'">
          <b-alert :show="isShowAlert" variant="success" isShowAlert="false">
            <p>
              Successfully {{appendtext}}
              <b-button v-show="buttonishow" variant="primary" @click="reload" size="sm">
                <i class="fa fa-plus-circle"></i>&nbsp;Indicator
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
            <b-form-group label="ShortName*">
              <b-form-input placeholder="ShortName" v-model.trim="form.shortname"></b-form-input>
            </b-form-group>
            <b-form-group label="Description*">
              <b-form-input placeholder="Description" v-model.trim="form.description"></b-form-input>
            </b-form-group>
            <b-form-group>
              <b-form-checkbox-group
                stacked
                id="basicCustomCheckboxess"
                class="form-group col-md-12"
              >
                <div class="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id="attachactive"
                    value="1"
                    v-model="attachdoption"
                  />
                  <label class="custom-control-label" for="attachactive">Required Attachment</label>
                </div>
              </b-form-checkbox-group>
            </b-form-group>

            <b-form-group label="ValueDataType*">
              <b-form-select
                id="transtype"
                :plain="true"
                :options="valuetypeoption"
                v-model.trim="form.valuedatatype"
              ></b-form-select>
            </b-form-group>

            <b-form-checkbox-group stacked id="basicCustomCheckboxes" class="form-group col-md-12">
              <div class="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  id="isactive"
                  value="1"
                  v-model="checked"
                />
                <label class="custom-control-label" for="isactive">is Active</label>
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
    <!--    <pre>{{$data.form}}</pre>-->
  </div>
</template>

<script>
import api from "../../services/api";
import Vue from "vue";
import miniToastr from "mini-toastr";
miniToastr.init();
export default {
  data() {
    return {
      errors: [],
      isShowAlert: false,
      attachdoption: false,
      checked: true,
      buttonishow: this.$route.params.id == undefined ? true : false,
      appendtext: this.$route.params.id == undefined ? "Create" : "Update",
      optionsgroupcode: [],
      selectgroupcode: {},
      valuetypeoption: [
        { value: "TEXT", text: "Text" },
        { value: "NUMERIC", text: "Numeric" },
        { value: "BOOLEAN", text: "Yes/No" }
      ],
      form: {
        indicatorId:
          this.$route.params.id == undefined ? "" : this.$route.params.id,
        shortname: "",
        description: "",
        attachrequired: false,
        groupId: 1,
        valuedatatype: "",
        status: "",
        created_by:
          this.$store.getters.user.firstname +
          " " +
          this.$store.getters.user.lastname,
        create_date: ""
      }
    };
  },
  methods: {
    checkForm: function(e) {
      if (this.form.shortname && this.form.description && this.form.groupId) {
        return true;
      }

      this.errors = [];
      if (!this.form.shortname) {
        this.errors.push("Shortname required.");
      }
      if (!this.form.description) {
        this.errors.push("description required");
      }
      if (!this.form.groupId) {
        this.errors.push("Group Description required");
      }
    },
    onSubmit: function(evt) {
      evt.preventDefault();

      if (!this.checkForm()) {
        return;
      }

      this.$store.commit("setLoading", true);
      if (this.appendtext == "Create") {
        api.instance
          .post("itsek/add-indicator", this.form)
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
          .put("itsek/edit-indicator", this.form)
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
    reload: function() {
      this.$router.go(this.$router.currentRoute);
    },
    back: function() {
      this.$router.push("/Maintenance/636917825011241771");
    },

    GetgroupCode: function() {
      //get groupCode
      let self = this;
      self.$store.commit("setLoading", true);
      api.instance
        .get(
          "itsek/get-groupId?department=" +
            self.$store.getters.selectedWarehouse
        )
        .then(function(resp) {
          self.optionsgroupcode = resp.data;
          self.$store.commit("setLoading", false);
        })
        .catch(function(err) {
          api.httpMsg(self, err.status, err.data);
          self.$store.commit("setLoading", false);
        });
    },
    getData: function() {
      this.GetgroupCode();
      let self = this;
      if (this.$route.params.id !== undefined) {
        self.$store.commit("setLoading", true);
        api.instance
          .get("itsek/get-indicator-by-id?indicatorId=" + this.$route.params.id)
          .then(resp => {
            self.form = resp.data;
            self.$store.commit("setLoading", false);
            if (self.form.status === "A") {
              self.checked = true;
            } else {
              self.checked = false;
            }
            if (self.form.attachrequired === true) {
              self.attachdoption = true;
            } else {
              self.attachdoption = false;
            }
          })
          .catch(err => {
            api.httpMsg(self, err.status, err.data);
            self.$store.commit("setLoading", false);
          });
      }
    }
  },
  watch: {
    checked: function(val) {
      if (val) {
        this.form.status = "A";
      } else {
        this.form.status = "I";
      }
    },
    attachdoption: function(val) {
      if (val) {
        this.form.attachrequired = true;
      } else {
        this.form.attachrequired = false;
      }
    },
    selectgroupcode: function(param) {
      //select groupcode
      this.form.groupId = param.ID;
    }
  },
  created: function() {
    this.getData();
    this.GetgroupCode();
  }
};
</script>
