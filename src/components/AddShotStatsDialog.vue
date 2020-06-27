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
                  v-chip(v-for="club in clubs" :key="club.id" class="ma-1" filter) {{ club.type }}
          v-row
            v-col
              fieldset(class="chips--fieldset")
                legend Which swing did you use?
                v-chip-group(v-model="swingSelection" column active-class="chip--active")
                  v-chip(v-for="swing in swings" :key="swing" class="ma-1" filter) {{ swing }}
          v-row
            v-col(class="slider--col")
              v-subheader(class="pl-0 slider--header") How far did your shot go?
              v-slider(v-model="sliderDistance" thumb-label="always" min="0" max="350" step="5"
                  :thumb-size="42" :color="sliderClass" class="distance--slider"
                  tick-size="5")
      v-card-actions
        v-spacer
        v-btn(class="ma-2" text @click="onSkip") skip
        v-btn(class="ma-2" text @click="onDone") done
</template>

<script lang="ts">
import _ from 'lodash';
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { CLUBS } from '@/store/clubs/getter-types';
import { Club } from '@/store/clubs/types.d';
import { SWING_NAMES } from '@/store/consts';
import { ClubData } from '@/store/current-round/types.d';
import { SHOT_BY_INDEX } from '@/store/current-round/getter-types';
import { RoundShot } from '@/store/rounds/types.d';

const ACTIVE_SLIDER_CLASS = 'green darken-2';
const INACTIVE_SLIDER_CLASS = 'grey lighten-1';

const ClubsModule = namespace('clubs');
const CurrentRoundModule = namespace('currentRound');

@Component({
  name: 'AddShotStatsDialog',

  props: {
    shotId: Number,
    existingShot: Boolean,
    swingData: Object,
  },
})
export default class AddShotStatsDialog extends Vue {
  @ClubsModule.Getter(CLUBS)
  clubs!: Array<Club>

  @CurrentRoundModule.Getter(SHOT_BY_INDEX)
  getShotByIndex!: (arg0: number) => RoundShot;

  existingShot!: boolean;

  shotId!: number;

  swingData!: ClubData;

  swings = SWING_NAMES;

  active = true;

  distance = 0;

  get sliderDistance() {
    return this.distance;
  }

  set sliderDistance(value) {
    this.sliderClass = value ? ACTIVE_SLIDER_CLASS : INACTIVE_SLIDER_CLASS;
    this.distance = value;
  }

  clubSelection?: number = null;

  swingSelection?: number = null;

  sliderClass = INACTIVE_SLIDER_CLASS;

  onSkip() {
    this.$emit('stats-done');
  }

  onDone() {
    let clubData = {
      shotId: this.shotId,
    } as ClubData;

    if (!_.isNil(this.clubSelection)) {
      clubData.club = this.clubs[this.clubSelection].id;
    }

    if (!_.isNil(this.swingSelection)) {
      clubData = { ...clubData, swing: this.swingSelection };
    }

    if (this.distance) {
      clubData.distance = this.distance;
    }

    this.$emit('stats-done', clubData);
  }

  mounted() {
    if (this.existingShot) {
      const shot = this.getShotByIndex(this.shotId);

      if (!_.isNil(shot.swing)) {
        this.swingSelection = shot.swing;
      }

      if (!_.isNil(shot.distance)) {
        this.sliderDistance = shot.distance;
      }

      if (!_.isNil(shot.club)) {
        const index = this.clubs.findIndex((club) => club.id === shot.club);

        if (index < 0) {
          throw Error(`AddShotStatsDialog: mounted: Can't find club with id: ${shot.club}`);
        }

        this.clubSelection = index;
      }
    }
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
