<template lang="pug">
  v-layout
    v-flex(v-show="!isStarting")
      v-card(class="d-flex justify-center align-center" elevation="0" height="100%")
        v-btn(dark fab v-show="!hidden" @click="isStarting = true")
          v-icon mdi-plus
    StartRound(v-if="isStarting" v-on:cancel-start="isStarting = false"
      v-on:start-round="onRoundStarted")
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import StartRound from '@/views/screens/track-round/StartRound.vue';

@Component({
  name: 'TrackRound',
  components: { StartRound },
})
export default class TrackRound extends Vue {
  hidden = true;

  isStarting = false;

  onRoundStarted() {
    this.isStarting = false;
  }

  mounted() {
    this.$nextTick(() => {
      this.hidden = false;
    });
  }
}
</script>
