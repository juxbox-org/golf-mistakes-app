<template lang="pug">
  v-layout
    div(class="rounds-col")
      v-list(class="gma-mistake-list")
        v-list-item(v-if="roundInProgress" to="/track")
          v-list-item-content
            v-list-item-title {{ inProgressTitleString }}
            v-list-item-subtitle In progress (through {{ holesPlayed }} holes)
            v-list-item-subtitle {{ summaryString }}
        v-list-item(v-if="!roundInProgress && !pastRounds.length"
            class="gma-list-item__empty") (no rounds)
      v-list(class="gma-mistake-list")
        v-list-item-group(v-for="round in pastRounds"  :key="round.course")
          v-list-item
            v-list-item-content
              v-list-item-title {{ round.course }}
              v-list-item-subtitle {{ round.date }}
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { COURSE_DETAILS, IN_PROGRESS, ROUND_DETAILS } from '@/store/current-round/getter-types';
import { CourseDetails, RoundDetails } from '@/store/current-round/types.d';
import { GET_ALL_ROUNDS } from '@/store/rounds/getter-types';
import { Round } from '../store/rounds/types.d';

const CurrentRoundModule = namespace('currentRound');
const RoundsModule = namespace('rounds');

@Component({
  name: 'ViewRounds',
})
export default class ViewRounds extends Vue {
  @CurrentRoundModule.Getter(COURSE_DETAILS)
  courseDetails!: CourseDetails;

  @CurrentRoundModule.Getter(ROUND_DETAILS)
  roundDetails!: RoundDetails;

  @CurrentRoundModule.Getter(IN_PROGRESS)
  roundInProgress!: boolean;

  @RoundsModule.Getter(GET_ALL_ROUNDS)
  pastRounds!: Array<Round>

  get holesPlayed() {
    return this.roundDetails.holesPlayed;
  }

  get inProgressTitleString() {
    return `${this.courseDetails.course}`;
  }

  get summaryString() {
    const penaltiesStr = `(+${this.roundDetails.penalties})`;
    return `Shots: ${this.roundDetails.shots} `
      + `${this.roundDetails.penalties ? penaltiesStr : ''}`
      + ` \xa0\xa0 Mistakes: ${this.roundDetails.mistakes}`
      + ` \xa0\xa0 Putts: ${this.roundDetails.putts}`
      + ` \xa0\xa0 Score: ${this.roundDetails.score > 0 ? '+' : ''}${this.roundDetails.score}`;
  }
}
</script>

<style lang="stylus" scoped>
.rounds-col
  width: 100%;
  flex-basis: 0;
  flex-grow: 1;
  max-width: 100%;
</style>
