<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <div class="dispatch-list row">
          <b-button variant="none" @click="back">
            <i class="fa fa-chevron-left"></i>
            Back
          </b-button>
        </div>
        <b-card :header="appendtext +' Lane Master Setup'" class="mt-1">
          <b-alert :show="isShowAlert" variant="success" isShowAlert="false">
            <p>
              Successfully {{appendtext}}
              <b-button v-show="buttonishow" variant="primary" @click="reload" size="sm">
                <i class="fa fa-plus-circle"></i>&nbsp;Lane Master
              </b-button>
            </p>
          </b-alert>

          <b-form @submit="onSubmit" v-if="!isShowAlert" autocomplete="off">
            <b-alert :show="errors.length > 0" variant="danger">
              <h6 class="alert-heading">Please fill in all required field!</h6>
              <ul>
                <li v-for="(error,i) in errors" :key="`error-${i}`">{{ error }}</li>
              </ul>
            </b-alert>
            <div class="form-group">
              <label>Lane no*</label>
              <input
                type="text"
                v-model.trim="form.laneno"
                class="form-control text-uppercase"
                placeholder="Lane no"
                :disabled="isDisabled == 1 ? true : false"
              />
            </div>

            <div class="form-group">
              <label>Occupant</label>
              <input
                type="text"
                placeholder="Occupant"
                v-model.trim="form.occupant"
                class="form-control"
              />
            </div>
            <b-form-group label="Transtype *">
              <b-form-select v-model="form.trantype" class="mb-3">
                <option
                  v-for="(selectOption, indexOpt) in transTypeList"
                  :key="indexOpt"
                  :value="selectOption.regtype"
                >{{selectOption.description }}</option>
              </b-form-select>
            </b-form-group>
            <b-form-group label="Lane Type *">
              <b-form-select v-model.trim="form.laneid" class="mb-3">
                <option
                  v-for="(selectOption, indexOpt) in laneTypes"
                  :key="indexOpt"
                  :value="selectOption.drpdata"
                >{{selectOption.drpdisplay }}</option>
              </b-form-select>
            </b-form-group>
            <b-form-group id="exampleGroup4">
              <b-form-checkbox-group id="exampleChecks">
                <b-form-checkbox-group
                  stacked
                  id="basicCustomCheckboxes"
                  class="form-group col-md-12"
                >
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
              </b-form-checkbox-group>
            </b-form-group>
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
  </div>
</template>

            <script>
import api from "../../services/api";
import miniToastr from "mini-toastr";

miniToastr.init();
export default {
  data() {
    return {
      errors: [],
      appendtext: this.$route.params.id == undefined ? "Create" : "Update",
      isDisabled: this.$route.params.id == undefined ? false : true,
      buttonishow: this.$route.params.id == undefined ? true : false,
      transTypeList: [],
      laneTypes: [],
      isShowAlert: false,
      selected: "",
      options: [
        {
          text: "Yes",
          value: "Yes"
        },
        {
          text: "No",
          value: "No"
        }
      ],
      checked: true,
      form: {
        laneid: "",
        id: this.$route.params.id == undefined ? "" : this.$route.params.id,
        brancode: this.$store.getters.selectedWarehouse,
        laneno: "",
        occupant: "",
        trantype: "",
        status: "",
        isoccupied: 0,
        modifiedby:
          this.$store.getters.user.firstname +
          " " +
          this.$store.getters.user.lastname,
        createdby:
          this.$store.getters.user.firstname +
          " " +
          this.$store.getters.user.lastname,
        createdate: "2017-05-11T14:35:31"
      }
    };
  },

  methods: {
    checkForm: function(e) {
      if (this.form.laneno && this.form.trantype) {
        return true;
      }

      this.errors = [];
      if (!this.form.laneno) {
        this.errors.push("Laneno required");
      }

      if (!this.form.trantype) {
        this.errors.push("Trantype required.");
      }

      // e.preventDefault();
    },
    onSubmit: function(evt) {
      evt.preventDefault();
      if (!this.checkForm()) {
        return;
      }
      this.$store.commit("setLoading", true);
      if (this.appendtext == "Create") {
        api.instance
          .post("wfms/add-lane", this.form)
          .then(resp => {
            this.getData();
            this.isShowAlert = true;

            this.$store.commit("setLoading", false);
          })
          .catch(function(err) {
            miniToastr.error(err.data);
            api.httpMsg(this, err.status, err.data);
            this.$store.commit("setLoading", false);
          });
      } else if (this.appendtext == "Update") {
        api.instance
          .put("wfms/edit-lane", this.form)
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
    back: function() {
      this.$router.push("/Maintenance/636917878380103450");
    },
    reload: function() {
      this.$router.go(this.$router.currentRoute);
    },
    onGetFleetregisterType() {
      //get type reigster inbound or outbound
      let self = this;
      self.$store.commit("setLoading", true);
      api.instance
        .get("wfms/get-registry-type")
        .then(function(resp) {
          self.transTypeList = resp.data;
          self.$store.commit("setLoading", false);
        })
        .catch(function(err) {
          console.log(err);
          self.$store.commit("setLoading", false);
        });
    },
    onGetLaneType() {
      //get type reigster inbound or outbound
      let self = this;
      self.$store.commit("setLoading", true);
      api.instance
        .get("dropservice/get-dropdown/?drpids=LANE")
        .then(function(resp) {
          self.laneTypes = resp.data;
          self.$store.commit("setLoading", false);
        })
        .catch(function(err) {
          console.log(err);
          api.httpMsg(self, err.status, err.data);
          self.$store.commit("setLoading", false);
        });
    },

    getData: function() {
      this.onGetFleetregisterType();
      this.onGetLaneType();

      let self = this;
      self.$store.commit("setLoading", true);
      if (this.$route.params.id !== undefined) {
        api.instance
          .get("wfms/get-select-lane-list?id=" + this.$route.params.id)
          .then(resp => {
            self.form = resp.data;
            self.$store.commit("setLoading", false);
            if (self.form.status === 1) {
              self.checked = true;
            } else {
              self.checked = false;
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
        this.form.status = "1";
      } else {
        this.form.status = "0";
      }
    }
  },
  created: function() {
    this.getData();
  }
};
</script>
