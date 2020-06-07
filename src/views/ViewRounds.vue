<template lang="pug">
  div
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  name: 'ViewRounds',
})
export default class ViewRounds extends Vue {
  platformId = '';

  onClick() {
    this.platformId = this.$cordova.platformId;
  }
}
</script>
