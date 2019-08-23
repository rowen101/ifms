<template>
  <AppHeaderDropdown right no-caret>
    <template slot="header">
      <div class="animated fadeIn">
        <b-col cols="12"></b-col>
        <!--/.col-->
      </div>
    </template>

    <template slot="header">
      <label>Hi! &nbsp; {{ firstname }} &nbsp;</label>
    </template>

    <template slot="dropdown">
      <b-dropdown-header tag="div" class="text-center">
        <strong>Account</strong>
      </b-dropdown-header>
      <!-- <b-dropdown-item  @click="changeSite"><i class="fa fa-globe" /> Change Site</b-dropdown-item> -->
      <!-- <b-dropdown-item  @click="filter"><i class="fa fa-filter" /> Filter</b-dropdown-item>-->
      <b-dropdown-item @click="logout">
        <i class="fa fa-lock" /> Logout
      </b-dropdown-item>
    </template>
  </AppHeaderDropdown>
</template>

<script>
import { HeaderDropdown as AppHeaderDropdown } from "@coreui/vue";
export default {
  name: "DefaultHeaderDropdownAccnt",
  components: {
    AppHeaderDropdown
  },
  data: () => {
    return {
      itemsCount: 42
    };
  },
  computed: {
    firstname: {
      get: function() {
        console.log(this.$store.getters.firstname);
        return this.$store.getters.firstname;
      },
      set: function(value) {}
    }
  },

  methods: {
    logout: function() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    },
    // changeSite: function() {
    //   this.$store.dispatch("changeSite");
    // },
    filter: function() {
      this.$store.dispatch("filter");
    }
  }
};
</script>
