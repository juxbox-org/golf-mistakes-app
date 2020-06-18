<template lang='pug'>
  v-bottom-navigation(grow app color="primary" dark)
    v-btn(v-if="!isAddingShot || isReviewing || isSummary" @click="navigateTo('track')"
        v-touch-options="{touchHoldTolerance: 100, swipeTolerance: 1000}"
        v-touch:swipe="onSwipeNavigation('track')")
      v-icon mdi-golf
    v-btn(v-else @click="backToCurrentRound"
        v-touch-options="{touchHoldTolerance: 100, swipeTolerance: 1000}"
        v-touch:swipe="backToCurrentRound")
      v-icon mdi-chevron-left
    v-btn(@click="navigateTo('review')"
        v-touch-options="{touchHoldTolerance: 100, swipeTolerance: 1000}"
        v-touch:swipe="onSwipeNavigation('review')")
      v-icon mdi-finance
    v-btn(@click="navigateTo('summary')"
        v-touch-options="{touchHoldTolerance: 100, swipeTolerance: 1000}"
        v-touch:swipe="onSwipeNavigation('summary')")
      v-icon mdi-pencil-outline
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { mapState } from 'vuex';
import { namespace } from 'vuex-class';
import { Route } from '@/store/route';
import { IS_ADDING_MISTAKE } from '@/store/current-round/getter-types';
import { STOP_ADDING_MISTAKE } from '@/store/current-round/mutation-types';

const CurrentRoundModule = namespace('currentRound');

@Component({
  name: 'AppBar',
  computed: {
    ...mapState('route', {
      isReviewing: (state) => (state as Route).path === '/review',
      isSummary: (state) => (state as Route).path === '/summary',
    }),
  },
})
export default class BottomNavigation extends Vue {
  @CurrentRoundModule.Getter(IS_ADDING_MISTAKE)
  isAddingShot!: boolean;

  @CurrentRoundModule.Mutation(STOP_ADDING_MISTAKE)
  doneAddingShot!: () => void;

  navigateTo(to: string): void {
    this.$router.push(`/${to}`).catch(() => null);
  }

  /*
   * On mobile devices, it's easy to press a button and move
   * your finger slightly left or right, so we detect these
   * swipes here and navigate
   */
  onSwipeNavigation(dest: string) {
    return () => {
      this.navigateTo(dest);
    };
  }

  backToCurrentRound() {
    this.doneAddingShot();
  }
}
</script>
