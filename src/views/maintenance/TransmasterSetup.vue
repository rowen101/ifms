<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <div class="dispatch-list row">
          <b-button variant="none" @click="back">
            <i class="fa fa-chevron-left"></i> Back
          </b-button>
        </div>
        <b-card :header="appendtext +' Transmaster Setup'" class="mt-1">
          <b-alert :show="isShowAlert" variant="success" isShowAlert="false">
            <p>
              Successfully {{appendtext}}
              <b-button v-show="buttonishow" variant="primary" @click="reload" size="sm">
                <i class="fa fa-plus-circle"></i>&nbsp;Transmaster
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
            <b-form-group label="Trans Type*">
              <input
                type="Text"
                class="form-control bg-white"
                @click="onTranstype"
                v-model="TranstypeDescription"
                readonly
              />
            </b-form-group>
            <b-form-group label="Trans code *">
              <b-form-input v-model.trim="form.transcode"></b-form-input>
            </b-form-group>
            <b-form-group label="Description *">
              <b-form-input v-model.trim="form.transdescription"></b-form-input>
            </b-form-group>
            <b-form-group label="Barcode ">
              <b-form-input v-model.trim="form.barcode"></b-form-input>
            </b-form-group>
            <b-form-group label="Sort #*">
              <input type="number" v-model.trim="form.sortno" class="form-control" />
            </b-form-group>
            <b-form-group id="exampleGroup4">
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
                    v-model="checkedoption"
                  />
                  <label class="custom-control-label" for="isactive">is Active</label>
                </div>
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
    <!-- modal Transtype -->
    <b-modal v-model.trim="Transtypetmodal" title="Select Transtype">
      <form class="form">
        <div style="height:50vh; overflow-x:auto;">
          <input
            type="text"
            class="form-control mb-2"
            v-model.trim="SearchTranstype"
            placeholder="Search Trucker"
          />
          <span v-if="filterTranstype.length == 0">No available Transtype.</span>
          <b-list-group-item v-for="(item,index) in filterTranstype" :key="index">
            <b-form-radio
              v-model.trim="transtypeModel"
              name="some-radios"
              :value="item"
              @change="onSelectranstype"
            >{{item.description}}</b-form-radio>
          </b-list-group-item>
        </div>
      </form>
    </b-modal>
    <!-- <pre>{{$data.form|JSON}}</pre> -->
  </div>
</template>

<script>
import api from "../../services/api";
export default {
  data() {
    return {
      errors: [],
      transTypeList: [],
      buttonishow: this.$route.params.id == undefined ? true : false,
      isShowAlert: false,
      checkedoption: true,
      TranstypeDescription: "",
      SearchTranstype: "",
      transtypeModel: "",
      Transtypetmodal: false,
      appendtext: this.$route.params.id == undefined ? "Create" : "Update",
      spcebar: " ",
      form: {
        transtype: "",
        transcode: "",
        transdescription: "",

        barcode: "",
        sortno: "",
        isactive: 1,
        brancode: this.$store.getters.selectedWarehouse,
        create_by:
          this.$store.getters.user.firstname +
          " " +
          this.$store.getters.user.lastname,
        create_date: "",
        modify_by:
          this.$store.getters.user.firstname +
          " " +
          this.$store.getters.user.lastname,
        modify_date: ""
      }
    };
  },
  computed: {
    filterTranstype: function() {
      var self = this;
      return self.transTypeList.filter(function(cust) {
        return (
          cust.description
            .toLowerCase()
            .indexOf(self.SearchTranstype.toLowerCase()) >= 0
        );
      });
    }
  },
  methods: {
    checkForm: function(e) {
      if (
        this.form.transtype &&
        this.form.transcode &&
        this.form.transdescription
      ) {
        return true;
      }
      this.errors = [];
      if (!this.form.transtype) {
        this.errors.push("Transtype required.");
      }
      if (!this.form.transcode) {
        this.errors.push("Transcode required");
      }
      if (!this.form.transdescription) {
        this.errors.push("Description required.");
      }

      //e.preventDefault();
    },
    onSubmit: function(evt) {
      if (!this.checkForm()) {
        return;
      }
      this.$store.commit("setLoading", true);
      if (this.appendtext == "Create") {
        evt.preventDefault();

        api.instance
          .post("wfms/add-transmaster", this.form)
          .then(() => {
            this.isShowAlert = true;
            this.$store.commit("setLoading", false);

            this.form.transtype = "Please select an Transtype";
          })
          .catch(function(err) {
            api.httpMsg(this, err.status, err.data);
            this.$store.commit("setLoading", false);
          });
      } else if (this.appendtext == "Update") {
        evt.preventDefault();
        api.instance
          .put("wfms/update-transmaster", this.form)
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
      this.$router.push("/Maintenance/636859984536802183");
    },
    onSelectranstype: function(val) {
      this.form.transtype = val.regtype;
      this.TranstypeDescription = val.description;
    },
    onTranstype() {
      //get type reigster inbound or outbound
      let self = this;
      self.transTypeList = [];
      self.$store.commit("setLoading", true);
      api.instance
        .get("wfms/get-registry-type")
        .then(function(resp) {
          resp.data.forEach(element => {
            self.transTypeList.push({
              description: element.description,
              regtype: element.regtype
            });
          });

          self.Transtypetmodal = true;
          self.$store.commit("setLoading", false);
        })
        .catch(function(err) {
          console.log(err);
          api.httpMsg(self, err.status, err.data);
          self.$store.commit("setLoading", false);
        });
    },
    countDownChanged: function(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert: function() {
      this.dismissCountDown = this.dismissSecs;
    },
    getData: function() {
      let self = this;

      if (this.$route.params.id !== undefined) {
        self.$store.commit("setLoading", true);
        api.instance
          .get("wfms/get-transmaster-by-id/" + this.$route.params.id)
          .then(resp => {
            self.form = resp.data;

            self.TranstypeDescription = resp.data.Transdescription;

            if (self.form.isactive === 1) {
              self.checkedoption = true;
            } else {
              self.checkedoption = false;
            }
            self.$store.commit("setLoading", false);
          })
          .catch(err => {
            api.httpMsg(self, err.status, err.data);
            self.$store.commit("setLoading", false);
          });
      }
    }
  },
  watch: {
    checkedoption: function(val) {
      if (val) {
        this.form.isactive = 1;
      } else {
        this.form.isactive = 0;
      }
    }
  },
  created: function() {
    this.getData();
  }
};
</script>
