<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center loginForm">
        <div class="form-elegant">
          <div class="card border-none">
            <div class="card-body mx-4">
              <b-form>
                <!--Header-->
                <h3 class="dark-grey-text mb-2">
                  <strong class="ng-binding">Sign in</strong>
                </h3>
                <div class="row my-3">
                  <!--Itsek-->
                  <img
                    src="../assets/img/itsek.png"
                    class="mr-md-3 animated zoomIn imgicon"
                    data-toggle="tooltip"
                    title="Itsek"
                  />
                  <!--PISM-->
                  <img
                    src="../assets/img/paloup.png"
                    class="mr-md-3 animated zoomIn imgicon"
                    data-toggle="tooltip"
                    title="Paloup"
                  />
                  <!--PISO-->
                  <img
                    src="../assets/img/piso.png"
                    class="mr-md-3 animated zoomIn imgicon"
                    data-toggle="tooltip"
                    title="PISO"
                  />
                  <!--Paloup-->
                  <img
                    src="../assets/img/pism.png"
                    class="mr-md-3 animated zoomIn imgicon"
                    data-toggle="tooltip"
                    title="PISM"
                  />
                  <!--PMS-->
                  <img
                    src="../assets/img/pms.png"
                    class="mr-md-3 animated zoomIn imgicon"
                    data-toggle="tooltip"
                    title="PMS"
                  />
                </div>

                <!-- Fast Application -->
                <!--Body-->
                <div class="md-form">
                  <b-input-group class="mb-3">
                    <b-input-group-prepend>
                      <b-input-group-text>
                        <i class="icon-user"></i>
                      </b-input-group-text>
                    </b-input-group-prepend>
                    <b-form-input
                      type="text"
                      v-model="loginname"
                      class="form-control"
                      placeholder="Username"
                      autocomplete="username email"
                      @blur.native="getBranch"
                    />
                  </b-input-group>
                </div>

                <div class="md-form pb-3 password">
                  <b-input-group class="mb-4">
                    <b-input-group-prepend>
                      <b-input-group-text>
                        <i class="icon-lock"></i>
                      </b-input-group-text>
                    </b-input-group-prepend>
                    <b-form-input
                      type="password"
                      class="form-control"
                      placeholder="Password"
                      autocomplete="current-password"
                      v-model="password"
                    />
                  </b-input-group>

                  <b-input-group class="mb-4">
                    <select v-model="selectedWarehouse" class="form-control">
                      <option
                        v-for="option in options"
                        :value="option.SiteCode"
                        v-bind:selected="option == selectedWarehouse.serverwarehouseId"
                        v-bind:key="option.SiteCode"
                      >{{ option.SiteDescription }}</option>
                    </select>
                  </b-input-group>
                  <p class="font-small blue-text d-flex justify-content-end">
                    <router-link :to="'#'">Forgot Password?</router-link>
                  </p>
                </div>

                <div class="row d-flex align-items-center mb-4">
                  <!--Grid column-->
                  <div class="text-center mb-3 col-md-12">
                    <b-button
                      variant="primary"
                      class="btn btn-primary btn-block btn-rounded z-depth-1 waves-effect waves-light ng-hide"
                      @click="login"
                      :disabled="warehousecode == options"
                    >Login</b-button>
                  </div>
                  <!--Grid column-->
                </div>
              </b-form>
            </div>

            <!--Footer-->
            <div class="modal-footer mx-5 pt-3 mb-1">
              <p class="font-small grey-text d-flex justify-content-end">
                Not yet register?
                <router-link :to="'#'">Request</router-link>
              </p>
            </div>
          </div>
        </div>
      </b-row>
    </div>
  </div>
</template>

                    <script>
import axios from "axios";
import { router } from "@/router";
import vSelect from "vue-select";
import miniToastr from "mini-toastr";
import api from "./../services/api";
const warehouse = [
  {
    serverwarehouseId: 0,
    description: "Please Select Warehouse"
  }
];
miniToastr.init();
export default {
  name: "Login",
  components: {
    vSelect
  },
  data: function() {
    return {
      isdisable: 0,
      loginname: "",
      password: "",
      branch: "",
      options: this.$store.getters.branches,
      warehousecode: ""
    };
  },

  computed: {
    selectedWarehouse: {
      get: function() {
        if (this.$store.getters.selectedWarehouse == undefined) {
          return this.options[0];
        }
        return this.$store.getters.selectedWarehouse;
      },
      set: function(value) {
        if (value != undefined) {
          console.log(value);
          this.$store.commit("selectedWarehouse", value);
          // this.$store.commit("warehousecode", value);
        }
      }
    }
  },
  methods: {
    login: function() {
      if (this.selectedWarehouse.serverwarehouseId == 0) {
        miniToastr.error("Please select warehouse");
        return;
      }
      let loginname = this.loginname;
      let password = this.password;
      this.$store
        .dispatch("login", { loginname, password })
        .then(resp => {
          let warehousedesc = "";
          //get selected warehouse name
          this.options.forEach(element => {
            if (element.SiteCode === this.selectedWarehouse) {
              warehousedesc = element.SiteDescription;
            }
          });
          let warehouseJsonData = {
            warehousecode: this.selectedWarehouse,
            warehousedesc: warehousedesc
          };
          this.$store.commit("warehousecode", warehouseJsonData);
          this.$router.push("/Dashboard");
        })
        .catch(err => {
          miniToastr.error("Login Failed");
          reject(err);
        });
    },
    getBranch: async function() {
      let self = this;
      let response = await axios.request({
        url: api.baseURL + "wfms/GetLoginSites?email=" + self.loginname,
        method: "get",
        headers: {
          Token:
            "MTMwMzgzMDo4ODkyZDgyNS1jZTQyLTQ0OGEtOTNlOS04ZTI1MWI4YWU3ZDd0c2Fm"
        }
      });
      self.options = response.data.sitesList;
      self.$store.commit("branches", this.options);
    },
    setBranch: function() {
      self.options = this.getBranch();
      self.$store.commit("branches", this.options);
    }
  }
};
</script>
                    <style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
