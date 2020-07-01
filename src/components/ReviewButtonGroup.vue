<template lang="pug">
  div
    v-btn(v-show="roundsOverviewTab === 'Rounds'" icon fab small :ripple="false" @click="editRounds"
        v-bind:class="[{'gma-app-bar-btn--active': isEditing}, 'edit-btn']")
      v-icon mdi-pencil
    v-btn(v-show="roundsOverviewTab === 'ShotStats'" icon fab small :ripple="false"
        @click="sortStats")
      v-icon mdi-sort
</template>

<script lang="ts">
import Vue from 'vue';
import bus from '@/event-bus';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { GET_OVERVIEW_TAB } from '@/store/rounds/getter-types';

const RoundsModule = namespace('rounds');

@Component({
  name: 'ReviewButtonGroup',
})
export default class ReviewButtonGroup extends Vue {
  @RoundsModule.Getter(GET_OVERVIEW_TAB)
  roundsOverviewTab!: string;

  isEditing = false;

  editRounds() {
    this.isEditing = !this.isEditing;
    bus.$emit('edit-rounds');
  }

  sortStats() {
    bus.$emit('sort-shot-stats');
  }
}
</script>

<style lang="stylus" scoped>
.edit-btn
  margin-right: 0 !important;
</style>
