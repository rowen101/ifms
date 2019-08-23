<template>
  <div>
    <span>{{params.runningDT}}</span>
  </div>
</template>

<script>
var moment = require("moment");
export default {
  props: { params: Object },
  data: function() {
    return {
      runDT: null
    };
  },
  methods: {
    runIntervals() {
      let self = this;

      if (self.params.transtart !== null && self.params.transfinish !== null) {
        window.clearInterval(self.runDT);
        var then = moment(self.params.transtart);
        var now = moment(self.params.transfinish);
        self.params.runningDT = moment
          .utc(
            moment(now, "DD/MM/YYYY HH:mm:ss").diff(
              moment(then, "DD/MM/YYYY HH:mm:ss")
            )
          )
          .format("HH:mm:ss");
      } else {
        var then = moment(self.params.transtart);

        self.runDT = setInterval(function() {
          var now = moment();
          self.params.runningDT = moment
            .utc(
              moment(now, "DD/MM/YYYY HH:mm:ss").diff(
                moment(then, "DD/MM/YYYY HH:mm:ss")
              )
            )
            .format("HH:mm:ss");
        }, 1000);
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.runDT);
  },
  created: function() {
    this.runIntervals();
  },
  watch: {
    "params.transtart": function() {
      this.runIntervals();
    },
    "params.transfinish": function() {
      this.runIntervals();
    }
  }
};
</script>

