<template lang="pug">
  div
    v-btn(icon=true class="md-2")
      v-icon mdi-delete
    v-btn(icon=true class="md-2")
      v-icon mdi-content-save
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  name: 'SaveRoundButton',
})
export default class SaveRoundButton extends Vue {
}
</script>
