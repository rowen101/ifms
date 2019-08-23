<template>
  <div v-if="valuedatatype=='TEXT'">
    <input type="text" class="form-control" @input="$emit('input', $event.target.value)" :value="value">
  </div>
  <div v-else-if="valuedatatype=='NUMERIC'">
    <input type="number" class="form-control" @input="$emit('input', $event.target.value)" :value="value">
  </div>
  <div v-else-if="valuedatatype=='BOOLEAN'">
    <input type="checkbox"
           value="foo"
           @change="$emit('input', $event.target.checked)"
           class="checkbox-input">
  </div>
</template>

<script>
export default {
  props: {
    valuedatatype: {
      required: true
    },
    value:{
      required: true
    }
  }
};
</script>

