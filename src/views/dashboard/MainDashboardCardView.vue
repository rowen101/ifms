<template>
  <b-row>
    <b-col sm="6" lg="3" v-for="(item,index) in data" :key="index">
      <b-card no-body v-bind:style="{background:item.cardBgcolor,color:item.cardFontColor }">
        <b-card-body :class="item.cardIcon" class=" fa-4x">
          <div class="float-right font-card">
            <h1>{{parseQty(item.cardQty)}}</h1>
          </div>
          <div class="font-card">
            <h6 class="text-right">{{item.cardTitle}}</h6>
          </div>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>
<script>
export default {
  props: {
    data: Array
  },methods:{
    parseQty:function(val){
      return (val === undefined ? 0 : val).toLocaleString()
    }
  }
};
</script>
