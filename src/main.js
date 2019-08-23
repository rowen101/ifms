// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "./polyfill";
// import cssVars from 'css-vars-ponyfill'
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import App from "./App";
import router from "./router/index";
import store from "./store";
import Axios from "axios";
import VueSelect from "vue-select";
import DisableAutocomplete from "vue-disable-autocomplete";
import VueFormWizard from "vue-form-wizard";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import VueSignaturePad from "vue-signature-pad";
import VueBase64FileUpload from "vue-base64-file-upload";
import VueRouterBackButton from "vue-router-back-button";

Vue.use(VueRouterBackButton, { router });
Vue.use(VueSignaturePad);
Vue.use(VueFormWizard);
// todo
// cssVars()

Vue.prototype.$http = Axios;

const token = localStorage.getItem("user-token");
if (token) {
  Vue.prototype.$http.defaults.headers.common["Authorization"] = token;
}

Vue.prototype.$apiName = Vue.config.productionTip
  ? "http://coreapi.fastlogistics.com.ph"
  : "http://localhost:59293";
Vue.use(require("vue-moment"));
Vue.use(BootstrapVue);
Vue.component("v-select", VueSelect);
Vue.component("vue-base64-file-upload", VueBase64FileUpload);
Vue.use(DisableAutocomplete);
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: {
    App
  }
});
