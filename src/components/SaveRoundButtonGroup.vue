<template lang="pug">
  div(class="app-bar-btn-group")
    v-btn(icon @click="onDeleteRound")
      v-icon mdi-delete
    v-btn(icon @click="onSaveRound")
      v-icon mdi-content-save
    v-btn(v-show="!isAddingMistake" icon fab small :ripple="false"  @click="onEditRound"
        v-bind:class="{'gma-app-bar-btn--active': isEditingHole}")
      v-icon mdi-pencil
</template>

<script lang="ts">
import Vue from 'vue';
import bus from '@/event-bus';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { DELETE_ROUND, EDIT_HOLE } from '@/store/current-round/mutation-types';
import { IS_EDITING_HOLE, IS_ADDING_MISTAKE } from '@/store/current-round/getter-types';

const CurrentRoundModule = namespace('currentRound');

@Component({
  name: 'SaveRoundButtonGroup',
})
export default class SaveRoundButtonGroup extends Vue {
  @CurrentRoundModule.Mutation(DELETE_ROUND)
  deleteRound!: () => void;

  @CurrentRoundModule.Mutation(EDIT_HOLE)
  editHole!: (arg0: boolean) => void;

  @CurrentRoundModule.Getter(IS_EDITING_HOLE)
  isEditingHole!: boolean;

  @CurrentRoundModule.Getter(IS_ADDING_MISTAKE)
  isAddingMistake!: boolean;

  onDeleteRound() {
    this.deleteRound();
    this.$router.push('/track');
  }

  onSaveRound() {
    bus.$emit('save-round');
  }

  onEditRound() {
    this.editHole(!this.isEditingHole);
  }
}
</script>

<style lang="stylus" scoped>
</style>
