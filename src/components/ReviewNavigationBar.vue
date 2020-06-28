<template lang="pug">
  v-tabs(fixed-tabs v-model="currentOverViewTab")
    v-tab(href="#Rounds" :ripple="false") Rounds
    v-tab(href="#ShotStats" :ripple="false") Shot Stats
    v-tab(href="#ClubStats" :ripple="false") Club Stats
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { UPDATE_OVERVIEW_TAB } from '@/store/rounds/mutation-types';
import { GET_OVERVIEW_TAB } from '@/store/rounds/getter-types';

const RoundsModule = namespace('rounds');

@Component({
  name: 'ReviewNavigationBar',
})
export default class ReviewNavigationBar extends Vue {
  @RoundsModule.Mutation(UPDATE_OVERVIEW_TAB)
  updateOverviewTab!: (arg0: string) => void;

  @RoundsModule.Getter(GET_OVERVIEW_TAB)
  getOverviewTab!: string;

  set currentOverViewTab(value) {
    this.updateOverviewTab(value);
  }

  get currentOverViewTab() {
    return this.getOverviewTab;
  }
}
</script>>
