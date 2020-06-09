<template lang="pug">
  div(class="d-flex nav-bar")
    template(v-if="!isAddingMistake")
      div(class="flex-grow-0 flex-shrink-0 nav-button")
        v-btn(v-show="currentHole > 1" icon=true @click="previousHole")
          v-icon mdi-chevron-left
      div(class="d-flex flex-grow-1 nav-title")
        v-btn(text @click.stop="jumpToHole = true" :ripple="false") Hole {{ currentHole }}
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

    v-dialog(v-model="jumpToHole" max-width="300" transition=false)
      v-card(class="pars-card")
        v-card-title(class="headline") Jump to Hole
        div(class="d-flex par-actions")
          v-btn(class="ma-2" dark small fab @click="navigateToHole(1)") 1
          v-btn(class="ma-2" dark small fab @click="navigateToHole(2)") 2
          v-btn(class="ma-2" dark small fab @click="navigateToHole(3)") 3
          v-btn(class="ma-2" dark small fab @click="navigateToHole(4)") 4
          v-btn(class="ma-2" dark small fab @click="navigateToHole(5)") 5
        div(class="d-flex par-actions")
          v-btn(class="ma-2" dark small fab @click="navigateToHole(6)") 6
          v-btn(class="ma-2" dark small fab @click="navigateToHole(7)") 7
          v-btn(class="ma-2" dark small fab @click="navigateToHole(8)") 8
          v-btn(class="ma-2" dark small fab @click="navigateToHole(9)") 9
          v-btn(class="ma-2" dark small fab @click="navigateToHole(10)") 10
        div(class="d-flex par-actions")
          v-btn(class="ma-2" dark small fab @click="navigateToHole(11)") 11
          v-btn(class="ma-2" dark small fab @click="navigateToHole(12)") 12
          v-btn(class="ma-2" dark small fab @click="navigateToHole(13)") 13
          v-btn(class="ma-2" dark small fab @click="navigateToHole(14)") 14
          v-btn(class="ma-2" dark small fab @click="navigateToHole(15)") 15
        div(class="d-flex par-actions")
          v-btn(class="ma-2" dark small fab @click="navigateToHole(16)") 16
          v-btn(class="ma-2" dark small fab @click="navigateToHole(17)") 17
          v-btn(class="ma-2" dark small fab @click="navigateToHole(18)") 18
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

  jumpToHole = false;

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

  navigateToHole(hole: number) {
    this.updateHole(hole);
    this.jumpToHole = false;
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
.nav-bar
  width: 100%;

.nav-title
  justify-content: center;
  align-items: center;

.nav-button
  width: 48px;

</style>
