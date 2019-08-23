<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <b-card header="Transaction Rigistrar" class="mt-1">
          <b-form @submit="onSubmit" @reset="onReset" :autocomplete="false">
            <b-alert show variant="success" v-model="showDismissibleAlert">
              <p>
                Transaction Registrar save complete do you want to open
                <router-link
                  tag="button"
                  :to="'/Activity/636859985185080849/select-tranActivity-entry/transActivity/' + transOutput.transregistryId  "
                  class="btn btn-primary btn-sm btn-square"
                >Trans Activity</router-link>
              </p>
            </b-alert>
            <b-form-group
              label="Fleet Owner"
              label-for="basicSelect"
              :label-cols="4"
              :horizontal="false"
            >
              <v-select
                v-model="selectedFleetId"
                :options="fleetOwnerOptions"
                :value="fleetownerId"
                label="ownername"
                required
              ></v-select>
            </b-form-group>
            <b-form-group label="Fleet Reference">
              <v-select
                v-model="selectedTranRef"
                :options="TransRefOptions"
                :value="fh"
                label
                required
              ></v-select>
            </b-form-group>

            <b-form-group label="Reference No">
              <b-input-group>
                <b-form-input v-model.trim="form.referenceno" required></b-form-input>
              </b-input-group>
            </b-form-group>
            <b-form-group label="Document No">
              <b-input-group>
                <b-form-input v-model.trim="form.documentno" required></b-form-input>
              </b-input-group>
            </b-form-group>
            <b-form-group label="Container Van No">
              <b-input-group>
                <b-form-input v-model.trim="form.containervanno" required></b-form-input>
              </b-input-group>
            </b-form-group>
            <b-form-group label="Status">
              <b-form-select
                id="month1"
                :plain="true"
                :options="statusoptions"
                v-model="form.status"
              ></b-form-select>
            </b-form-group>
            <b-button type="submit" size="sm" variant="primary">
              <i class="fa fa-save"></i> Submit
            </b-button>&nbsp;
            <b-button type="reset" size="sm" variant="danger">
              <i class="fa fa-ban"></i> Reset
            </b-button>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import api from "../../../services/api";
export default {
  data: function() {
    return {
      fleetOwnerOptions: [],
      TransRefOptions: [],
      showDismissibleAlert: false,
      TransTypeoptions: [],
      statusoptions: [
        { value: null, text: "Please select an status" },
        { value: "O", text: "OPEN" },
        { value: "C", text: "CLOSE" },
        { value: "X", text: "CANCEL" }
      ],
      selectedFleetId: {},
      selectTrastype: {},
      selectedPlateno: {},
      selectedLicenseno: {},

      form: {
        brancode: self.$store.getters.selectedWarehouse,
        fleetownerId: "",
        mode: 2,
        fleetregistryId: "",
        checklistId: 8,
        transtype: "",
        referenceno: "",
        documentno: "",
        containervanno: "",
        status: null,
        created_by:
          this.$store.getters.user.firstname +
          " " +
          this.$store.getters.user.lastname,
        create_date: "",
        modified_by:
          this.$store.getters.user.firstname +
          " " +
          this.$store.getters.user.lastname,
        modify_date: ""
      },
      transOutput: {}
    };
  },

  computed: {
    hrlist: function() {
      let hrlist = [];
      for (let hr = 1; hr <= 12; hr++) {
        hrlist.push(hr);
      }
      return hrlist;
    },
    mmlist: function() {
      let mmArray = [];
      for (let mm = 0; mm <= 60; mm++) {
        mmArray.push(mm);
      }
      return mmArray;
    }
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();

      api.instance
        .post("wfms/add-trans-registry", this.form)
        .then(resp => {
          this.showDismissibleAlert = true;
          this.transOutput = resp.data;
        })
        .catch(function(err) {
          api.httpMsg(this, err.status, err.data);
        });
    },
    onReset(evt) {
      evt.preventDefault();
      /* Reset our form values */
    },
    onGetActiveFleetOwner() {
      //get truker
      let self = this;
      api.instance
        .get(
          "wfms/get-available-fleet-register-arrival?param=&brancode=" +
            self.$store.getters.selectedWarehouse
        )
        .then(function(resp) {
          self.fleetOwnerOptions = resp.data;
        })
        .catch(function(err) {
          api.httpMsg(self, err.status, err.data);
        });
    },
    onGetActiveTransRef() {
      //get truker
      let self = this;
      api.instance
        .get(
          "wfms/get-available-fleet-register-arrival?param=&brancode=" +
            self.$store.getters.selectedWarehouse
        )
        .then(function(resp) {
          self.fleetOwnerOptions = resp.data;
        })
        .catch(function(err) {
          api.httpMsg(self, err.status, err.data);
        });
    },
    onGetFleetregisterType() {
      //get type reigster inbound or outbound
      let self = this;
      api.instance
        .get("wfms/get-trans-type-list")
        .then(function(resp) {
          self.TransTypeoptions = resp.data;
        })
        .catch(function(err) {
          api.httpMsg(self, err.status, err.data);
        });
    }
  },

  created: function() {
    this.onGetActiveFleetOwner();
    this.onGetFleetregisterType();
    this.onGetActiveTransRef();
  },
  watch: {
    selectedFleetId: function(param) {
      this.form.fleetownerId = param.fleetownerId;
      this.form.fleetregistryId = param.fleetregistryId;
    },
    selectTrastype: function(param) {
      this.form.transtype = param.value;
    },
    selectedTranRef: function(param) {
      this.form.fleetregistryId = param.plateno;
    }
  }
};
</script>
