<template lang="pug">
  v-dialog(v-model="active" persistent)
    v-card
      v-card-title Add Shot Info
      v-card-text(class="shot-info--text")
        v-container(class="shot-info--container")
          v-row
            v-col
              fieldset(class="chips--fieldset")
                legend Which club did you use?
                v-chip-group(v-model="clubSelection" column active-class="chip--active")
                  v-chip(v-for="club in clubs" class="ma-1" filter) {{ club.type }}
          v-row
            v-col
              fieldset(class="chips--fieldset")
                legend Which swing did you use?
                v-chip-group(v-model="swingSelection" column active-class="chip--active")
                  v-chip(v-for="swing in swings" class="ma-1" filter) {{ swing }}
          v-row
            v-col(class="slider--col")
              v-subheader(class="pl-0 slider--header") How far did your shot go?
              v-slider(v-model="distance" thumb-label="always" min="0" max="350" step="5"
                  :thumb-size="42" color="green darken-2" class="distance--slider"
                  tick-size="5")
      v-card-actions
        v-spacer
        v-btn(class="ma-2" text @click="onSkip") skip
        v-btn(class="ma-2" text @click="onDone") done
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { CLUBS } from '@/store/clubs/getter-types';
import { Club } from '@/store/clubs/types.d';
import { SWING_NAMES } from '@/store/consts';

const ClubsModule = namespace('clubs');

@Component({
  name: 'AddShotStatsDialog',

  props: {
    shotId: Number,
  },
})
export default class AddShotStatsDialog extends Vue {
  @ClubsModule.Getter(CLUBS)
  clubs!: Array<Club>

  shotId!: number;

  swings = SWING_NAMES;

  active = true;

  distance = 0;

  clubSelection: Array<string> = [];

  swingSelection: Array<string> = [];

  onSkip() {
    this.$emit('stats-done');
  }

  onDone() {
    this.$emit('stats-done');
  }
}
</script>

<style lang="stylus">
.chips--fieldset
  padding: 4px 4px;
  border: 1px solid;
  border-radius: 3px;

.slider--header
  margin-bottom: 40px;

.shot-info--container
  padding-top: 0;
  padding-bottom: 0;

.shot-info--text
  padding-bottom: 0 !important;

.slider--col
  padding-bottom: 0;

.chip--active
  background-color: green;
  color: white !important;

.distance--slider .v-slider__thumb-label
  font-size: 1rem !important;
</style>
