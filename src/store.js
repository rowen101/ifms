import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import createPersistedState from "vuex-persistedstate";
import miniToastr from "mini-toastr";
import api from "./services/api";
miniToastr.init();
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: "",
    token: localStorage.getItem("token") || "",
    user: {},
    apiName: "",
    isWarehouse: false,
    isFilter: false,
    branches: [],
    site: "",
    firstname: "",
    warehousecode: "",
    warehousedesc: "",
    selectedWarehouse: [],
    perPage: 10
  },
  plugins: [createPersistedState()],
  mutations: {
    auth_request(state) {
      state.status = "loading";
    },
    auth_success(state, data) {
      state.status = "success";
      state.token = data.token;
      state.user = data.user;
      state.firstname = data.firstname;
      localStorage.setItem("token", data.token);
    },
    auth_error(state) {
      state.status = "error";
    },
    logout(state) {
      state.status = "";
      state.warehousedesc = "";
      state.token = "";
      (state.user = ""),
        (state.isWarehouse = false),
        (state.branches = ""),
        (state.site = ""),
        (state.firstname = ""),
        (state.selectedWarehouse = {
          serverwarehouseId: 0
        }),
        (state.warehousecode = ""),
        (state.isLoading = false);
    },
    warehouse(state, isWarehouse) {
      state.isWarehouse = isWarehouse;
    },
    filter(state, isFilter) {
      state.isFilter = isFilter;
    },
    branches(state, branches) {
      state.branches = branches;
    },
    site(state, site) {
      state.site = site;
    },
    firstname(state, firstname) {
      state.firstname = firstname;
    },
    accountName(state, accountName) {
      state.accountName = accountName;
    },
    selectedWarehouse(state, selectedWarehouse) {
      state.selectedWarehouse = selectedWarehouse;
      localStorage.setItem(
        "selectedWarehouse",
        selectedWarehouse.serverwarehouseId
      );
    },
    warehousecode(state, warehousecode) {
      state.warehousecode = warehousecode;
      state.warehousedesc = warehousecode.warehousedesc;
    },
    setLoading(state, isLoading) {
      state.isLoading = isLoading;
    }
  },

  actions: {
    login({ commit }, userparam) {
      return new Promise((resolve, reject) => {
        commit("auth_request");

        let user = "";
        let firstname = "";

        axios({
          url: api.baseURL + "access/LoginUser",
          data: userparam,
          method: "POST"
        })
          .then(resp => {
            //authenticate

            user = resp.data.objParam1;
            firstname = resp.data.objParam1.firstname;
            axios.defaults.headers.common["Authorization"] =
              " Basic " + resp.data.stringParam1;

            //authorize
            axios({
              url: api.baseURL + "Authenticate/start",
              method: "GET"
            })
              .then(resp => {
                if (resp.data == "Authorized") {
                  delete axios.defaults.headers.common["Authorization"];
                  let udata = {
                    token: resp.headers.token,
                    user: user,
                    firstname: firstname
                  };
                  commit("auth_success", udata);
                  commit("firstname", firstname);
                  resolve(resp);
                } else {
                  miniToastr.error("Login Failed");
                  commit("auth_error");
                  localStorage.removeItem("token");
                  reject(resp);
                }
              })
              .catch(err => {
                miniToastr.error("Login Failed");
                commit("auth_error");
                localStorage.removeItem("token");
                reject(err);
              });
          })
          .catch(err => {
            miniToastr.error("Login Failed");
            commit("auth_error");
            localStorage.removeItem("token");
            reject(err);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        commit("logout");
        localStorage.removeItem("token");
        localStorage.removeItem("selectedWarehouse");
        delete axios.defaults.headers.common["Authorization"];
        resolve();
      });
    },
    changeSite() {
      this.state.isWarehouse = true;
    },
    filter() {
      this.state.isFilter = true;
    },
    showSuccessMsg() {
      this.showSuccessMsg();
    },
    setLoader({ commit }, isLoading) {
      commit("isLoading", isLoading);
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    apiName: state => state.apiName,
    isWarehouse: state => state.isWarehouse,
    isFilter: state => state.isFilter,
    branches: state => state.branches,
    site: state => state.site,
    firstname: state => state.firstname,
    selectedWarehouse: state => state.selectedWarehouse,
    warehousecode: state => state.warehousecode,
    token: state => state.token,
    isLoading: state => state.isLoading,
    user: state => state.user,
    perPage: state => state.perPage,
    warehousedesc: state => state.warehousedesc
  }
});
