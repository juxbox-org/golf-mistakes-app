<template lang="pug">
  div(class="d-flex nav-bar")
    template(v-if="!isAddingMistake")
      div(class="flex-grow-0 flex-shrink-0 nav-button")
        v-btn(v-show="currentHole > 1" icon=true @click="previousHole")
          v-icon mdi-chevron-left
      div(class="d-flex flex-grow-1 nav-title") Hole {{ currentHole }}
      div(class="flex-grow-0 flex-shrink-0 nav-button")
        v-btn(v-show="currentHole < 18" icon=true @click="nextHole")
          v-icon mdi-chevron-right
    template(v-if="isAddingMistake")
      div(class="flex-grow-0 flex-shrink-0 nav-button")
        v-btn(icon @click="onBackFromAddShot")
          v-icon mdi-chevron-left
      div(class="d-flex flex-grow-1 nav-title")
        span Select a Shot Type
      div(class="flex-grow-0 flex-shrink-0 nav-button")
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { UPDATE_CURRENT_HOLE, STOP_ADDING_MISTAKE } from '@/store/current-round/mutation-types';
import { IS_ADDING_MISTAKE, CURRENT_HOLE } from '@/store/current-round/getter-types';

const FIRST_HOLE = 1;
const LAST_HOLE = 18;

const CurrentRoundModule = namespace('currentRound');

@Component({
  name: 'HoleNavigationBar',
})
export default class HoleNavigationBar extends Vue {
  @CurrentRoundModule.Mutation(UPDATE_CURRENT_HOLE)
  updateCurrentHole!: (arg0: number) => void;

  @CurrentRoundModule.Mutation(STOP_ADDING_MISTAKE)
  doneAddingMistake!: () => void;

  @CurrentRoundModule.Getter(IS_ADDING_MISTAKE)
  isAddingMistake!: boolean;

  @CurrentRoundModule.Getter(CURRENT_HOLE)
  currentHole!: number;

  showHoleInfo = false;

  previousHole() {
    if (this.currentHole === FIRST_HOLE) {
      return;
    }

    this.updateHole(this.currentHole - 1);
  }

  nextHole() {
    if (this.currentHole === LAST_HOLE) {
      return;
    }

    this.updateHole(this.currentHole + 1);
  }

  updateHole(toHole: number) {
    this.updateCurrentHole(toHole);
    this.$router.push(`/track/hole/${toHole}`);
  }

  onBackFromAddShot() {
    this.doneAddingMistake();
  }
}
</script>

<style lang="stylus" scoped>
  .nav-bar {
    width: 100%;
  }

  .nav-title {
    justify-content: center;
    align-items: center;
  }

  .nav-button {
    width: 48px;
  }
</style>
