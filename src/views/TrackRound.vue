<template lang="pug">
  v-layout(justify-center align-center)
    v-fab-transition
      v-btn(dark fab v-show="!hidden" @click="isTracking = true")
        v-icon mdi-plus
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  name: 'TrackRound',
})
export default class TrackRound extends Vue {
  hidden = true;

  isTracking = false;

  mounted() {
    this.$nextTick(() => {
      this.hidden = false;
    });
  }
}
</script>
