<template lang="pug">
  #reviewtabs(class="gma-tabs-container" v-touch:swipe="onSwipe")
    v-tabs-items(v-model="currentTab")
      RoundsSummary
      StatsSummary
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { GET_OVERVIEW_TAB } from '@/store/rounds/getter-types';
import { UPDATE_OVERVIEW_TAB } from '@/store/rounds/mutation-types';
import RoundsSummary from '@/views/screens/review-rounds/RoundsSummary.vue';
import StatsSummary from '@/views/screens/review-rounds/StatsSummary.vue';

const RoundsModule = namespace('rounds');

@Component({
  name: 'ViewRounds',
  components: {
    RoundsSummary,
    StatsSummary,
  },
})
export default class ViewRounds extends Vue {
  @RoundsModule.Mutation(UPDATE_OVERVIEW_TAB)
  updateOverviewTab!: (arg0: string) => void;

  @RoundsModule.Getter(GET_OVERVIEW_TAB)
  getOverviewTab!: string;

  set currentTab(value) {
    this.updateOverviewTab(value);
  }

  get currentTab() {
    return this.getOverviewTab;
  }

  onSwipe(direction: string) {
    if (direction === 'left' && this.currentTab === 'Rounds') {
      this.currentTab = 'Stats';
    } else if (direction === 'right' && this.currentTab === 'Stats') {
      this.currentTab = 'Rounds';
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
