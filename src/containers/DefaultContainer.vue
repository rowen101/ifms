<template>
  <div class="app">
    <AppHeader fixed>
      <div class="vld-parent">
        <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="fullPage"></loading>
      </div>

      <b-modal title="Select Warehouse" size="sm" v-model="showWarehouse" @ok="updateSite">
        <select v-model="selectedWarehouse" class="form-control">
          <option
            v-for="option in options"
            :value="option.SiteCode"
            v-bind:selected="option == selectedWarehouse.serverwarehouseId"
            v-bind:key="option.SiteCode"
          >{{ option.SiteDescription }}</option>
        </select>
      </b-modal>

      <SidebarToggler class="d-lg-none" display="md" mobile />

      <b-link class="navbar-brand" to="#">
        <img
          class="navbar-brand-full"
          src="../assets/img/iFMS.png"
          width="80"
          height="50"
          alt="Integrated Fleet Monitoring System"
        />
        <img
          class="navbar-brand-minimized"
          src="../assets/img/iFMS.png"
          width="30"
          height="30"
          alt="Integrated Fleet Monitoring System"
        />
      </b-link>

      <SidebarToggler class="d-md-down-none" display="lg" />

      <b-navbar-nav class="ml-auto">
        <DefaultHeaderDropdownAccnt />
      </b-navbar-nav>
    </AppHeader>
    <div class="app-body">
      <AppSidebar fixed>
        <SidebarHeader />
        <SidebarForm />
        <SidebarNav :navItems="navItems"></SidebarNav>
        <SidebarFooter />
        <SidebarMinimizer />
      </AppSidebar>
      <main class="main">
        <div class="mb-1 subtitle-row">
          <span class="subtitle-text font-weight-bold text-center">{{this.branchtitle}}</span>
        </div>
        <div class="dispatch-table">
          <Breadcrumb id="breadview" :list="list" />
        </div>

        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
    </div>
    <TheFooter>www.fastlogistics.com.ph &nbsp; Build version: 1.6.1</TheFooter>
  </div>
</template>

<script>
import nav from "@/_nav";
import {
  Header as AppHeader,
  SidebarToggler,
  Sidebar as AppSidebar,
  SidebarFooter,
  SidebarForm,
  SidebarHeader,
  SidebarMinimizer,
  SidebarNav,
  Aside as AppAside,
  AsideToggler,
  Footer as TheFooter,
  Breadcrumb
} from "@coreui/vue";
import DefaultAside from "./DefaultAside";
import DefaultHeaderDropdown from "./DefaultHeaderDropdown";
import DefaultHeaderDropdownAccnt from "./DefaultHeaderDropdownAccnt";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import { all } from "q";
import miniToastr from "mini-toastr";
import api from "../services/api";
export default {
  name: "DefaultContainer",
  components: {
    AppHeader,
    AppSidebar,
    AppAside,
    TheFooter,
    Breadcrumb,
    DefaultAside,
    DefaultHeaderDropdown,
    DefaultHeaderDropdownAccnt,
    SidebarForm,
    SidebarFooter,
    SidebarToggler,
    SidebarHeader,
    SidebarNav,
    SidebarMinimizer,
    Loading
  },

  data() {
    return {
      branchtitle: this.$store.getters.warehousedesc,
      navItems: this.$store.getters.nav,
      fullPage: true,
      options: this.$store.getters.branches,
      tempWarehouse: 0,
      tempWarehouseCode: 0
    };
  },
  computed: {
    name() {
      return this.$route.name;
    },
    list() {
      return this.$route.matched.filter(
        route => route.name || route.meta.label
      );
    },
    isLoading: {
      get: function() {
        return this.$store.getters.isLoading;
      },
      set: function(value) {
        this.$store.commit("isLoading", value);
      }
    },
    showWarehouse: {
      get: function() {
        return this.$store.getters.isWarehouse;
      },
      set: function(value) {
        this.$store.commit("warehouse", value);
      }
    },
    selectedWarehouse: {
      get: function() {
        return this.$store.getters.selectedWarehouse;
      },
      set: function(value) {
        this.$store.commit("selectedWarehouse", value);
      }
    }
  },
  methods: {
    updateSite: function() {
      let self = this;
      let warehousedesc = "";
      //get selected warehouse name
      self.options.forEach(element => {
        if (element.SiteCode === self.selectedWarehouse) {
          warehousedesc = element.SiteDescription;
        }
      });
      let warehouseJsonData = {
        warehousecode: self.selectedWarehouse,
        warehousedesc: warehousedesc
      };
      this.$store.commit("warehousecode", warehouseJsonData);
      this.showWarehouse = false;
      location.reload();
    },
    onGetMenu: function() {
      let self = this;
      var stores = this.$store.getters;
      api.instance
        .get("account/get-app-menu-v2/?sysid=26&userid=" + stores.user.userId)
        .then(resp => {
          let menuData = [];

          menuData.push({
            name: "Dashboard",
            url: "/dashboard",
            icon: "cui-bar-chart icons",
            badge: {
              variant: "primary"
            }
          });
          //check mother menu
          resp.data.forEach(element => {
            let childMenu = [];
            //get child menu
            element.pages.forEach(child => {
              childMenu.push({
                name: child.name,
                url: "/" + element.name + "/" + child.stage
                // icon: "icon-puzzle"
              });
            });

            menuData.push({
              name: element.name,
              url: "/" + element.name,
              icon: "icon-puzzle",
              children: childMenu
            });
          });

          self.navItems = menuData;
          this.$store.commit("setNav", menuData);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created: function() {
    this.onGetMenu();
  }
};
</script>
