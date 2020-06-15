<template lang="pug">
  div(class="app-bar-btn-group")
    v-btn(icon @click="onDeleteRound")
      v-icon mdi-delete
    v-btn(icon @click="onSaveRound")
      v-icon mdi-content-save
    v-btn(icon fab small :ripple="false"  @click="onEditRound"
        v-bind:class="{'gma-app-bar-btn--active': isEditingHole}")
      v-icon mdi-pencil
</template>

<script lang="ts">
import Vue from 'vue';
import bus from '@/event-bus';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { DELETE_ROUND, EDIT_HOLE } from '@/store/current-round/mutation-types';
import { IS_EDITING_HOLE } from '@/store/current-round/getter-types';

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

  onDeleteRound() {
    this.deleteRound();
    this.$router.push('/track');
  }

  /* eslint-disable class-methods-use-this */
  onSaveRound() {
    bus.$emit('save-round');
  }

  onEditRound() {
    this.editHole(!this.isEditingHole);
  }
  /* eslint-enable class-methods-use-this */
}
</script>

<style lang="stylus" scoped>
</style>
