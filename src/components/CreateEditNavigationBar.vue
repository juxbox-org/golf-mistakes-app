<template lang="pug">
  v-tabs(fixed-tabs v-model="currentTab")
    v-tab(href="#ShotTypes" :ripple="false") Shot Types
    v-tab(href="#Clubs" :ripple="false") Clubs
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { UPDATE_EDITING_TAB } from '@/store/mistake-defs/mutation-types';
import { CURRENT_EDITING_TAB } from '@/store/mistake-defs/getter-types';

const ShotTypesModule = namespace('mistakeDefs');

@Component({
  name: 'CreateEditNavigationBar',
})
export default class CreateEditNavigationBar extends Vue {
  @ShotTypesModule.Mutation(UPDATE_EDITING_TAB)
  updateEditingTab!: (arg0: string) => void;

  @ShotTypesModule.Getter(CURRENT_EDITING_TAB)
  currentEditingTab!: string;

  set currentTab(value) {
    this.updateEditingTab(value);
  }

  get currentTab() {
    return this.currentEditingTab;
  }
}
</script>
