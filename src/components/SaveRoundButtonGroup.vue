<template lang="pug">
  div
    v-btn(icon @click="onDeleteRound")
      v-icon mdi-delete
    v-btn(icon @click="onSaveRound")
      v-icon mdi-content-save
    v-btn(icon fab small :ripple="false" v-bind:class="{active: active}" @click="onEditRound")
      v-icon mdi-pencil
</template>

<script lang="ts">
import Vue from 'vue';
import bus from '@/event-bus';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { DELETE_ROUND } from '../store/current-round/mutation-types';

const CurrentRoundModule = namespace('currentRound');

@Component({
  name: 'SaveRoundButtonGroup',
})
export default class SaveRoundButtonGroup extends Vue {
  @CurrentRoundModule.Mutation(DELETE_ROUND)
  deleteRound!: () => void;

  active = false;

  onDeleteRound() {
    this.deleteRound();
    this.$router.push('/track');
  }

  /* eslint-disable class-methods-use-this */
  onSaveRound() {
    bus.$emit('save-round');
  }

  onEditRound() {
    bus.$emit('toggle-edit');
    this.active = !this.active;
  }
  /* eslint-enable class-methods-use-this */
}
</script>

<style lang="stylus" scoped>
.active {
  background-color: #ffffff;
}

.active i {
 color: #9e9e9e !important;
}
</style>
