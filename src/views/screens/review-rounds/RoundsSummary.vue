<template lang="pug">
  v-tab-item(value="Rounds" :transition="false" :reverse-transition="false")
    div(class="rounds-col")
      v-list(class="gma-mistake-list")
        v-list-item(v-if="roundInProgress" to="/track" :ripple="false")
          v-list-item-content
            v-list-item-title {{ courseDetails.course }}
            v-list-item-subtitle In progress (through {{ holesPlayed }} holes)
            v-list-item-subtitle {{ currSummaryString }}
            v-list-item-subtitle {{ currSummaryString2 }}
        v-divider(v-show="roundInProgress")
        v-list-item(v-if="!roundInProgress && !pastRounds.length"
            class="gma-list-item__empty") (no rounds)
      v-list(class="gma-mistake-list")
        v-list-item-group(v-for="round in pastRounds" :key="round.id")
          v-list-item(inactive :ripple="false")
            v-list-item-content
              v-list-item-title {{ round.course }}
              v-list-item-subtitle {{ roundInfoString(round) }}
              v-list-item-subtitle {{ pastSummaryString(round) }}
            v-list-item-action(v-show="isEditingRounds" @click.stop="onDeleteRound(round)")
              v-icon mdi-delete
</template>

<script lang="ts">
import Vue from 'vue';
import bus from '@/event-bus';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { COURSE_DETAILS, IN_PROGRESS, ROUND_DETAILS } from '@/store/current-round/getter-types';
import { CourseDetails, RoundDetails } from '@/store/current-round/types.d';
import { GET_ALL_ROUNDS } from '@/store/rounds/getter-types';
import { Round } from '@/store/rounds/types.d';
import { DELETE_ROUND } from '@/store/current-round/mutation-types';
import { DELETE_STATS } from '@/store/mistake-defs/action-types';

const CurrentRoundModule = namespace('currentRound');
const RoundsModule = namespace('rounds');
const ShotTypesModule = namespace('mistakeDefs');

@Component({
  name: 'RoundsSummary',
})
export default class RoundsSummary extends Vue {
  @RoundsModule.Action(DELETE_ROUND)
  deleteRound!: (arg0: Round) => Promise<void>;

  @ShotTypesModule.Action(DELETE_STATS)
  deleteStatsForRound!: (arg0: Round) => Promise<void>;

  @CurrentRoundModule.Getter(COURSE_DETAILS)
  courseDetails!: CourseDetails;

  @CurrentRoundModule.Getter(ROUND_DETAILS)
  roundDetails!: RoundDetails;

  @CurrentRoundModule.Getter(IN_PROGRESS)
  roundInProgress!: boolean;

  @RoundsModule.Getter(GET_ALL_ROUNDS)
  pastRounds!: Array<Round>

  isEditingRounds = false;

  get holesPlayed() {
    return this.roundDetails.holesPlayed;
  }

  get currSummaryString() {
    const penaltiesStr = `(+${this.roundDetails.penalties})`;
    return `Shots: ${this.roundDetails.shots}`
      + ` ${this.roundDetails.penalties ? penaltiesStr : ''}`
      + ` \xa0\xa0 Mistakes: ${this.roundDetails.mistakes}`
      + ` \xa0\xa0 Putts: ${this.roundDetails.putts}`
      + ` \xa0\xa0 Score: ${this.roundDetails.score > 0 ? '+' : ''}${this.roundDetails.score}`;
  }

  /* eslint-disable class-methods-use-this */
  get currSummaryString2() {
    return 'GIR: 6 \xa0 Par: 8 \xa0 Brd: 2 \xa0 Bgy: 5 \xa0 Dbl: 7 \xa0 Tpl+: 3 \xa0 Egl+: 2';
  }

  roundInfoString(round: Round) {
    return `${round.date} \xa0\xa0 Par: ${round.par}`;
  }

  pastSummaryString(round: Round) {
    const penaltiesStr = `(+${round.totalPenalties})`;
    const score = round.totalShots + round.totalPenalties - round.par;
    return `Shots: ${round.totalShots}`
      + ` ${round.totalPenalties ? penaltiesStr : ''}`
      + ` \xa0\xa0 Mistakes: ${round.totalMistakes}`
      + ` \xa0\xa0 Putts: ${round.totalPutts}`
      + ` \xa0\xa0 Score: ${score > 0 ? '+' : ''}${score}`;
  }
  /* eslint-enable class-methods-use-this */

  onDeleteRound(round: Round) {
    this.deleteStatsForRound(round)
      .then(() => {
        this.deleteRound(round);
      });
  }

  toggleEditingRounds() {
    this.isEditingRounds = !this.isEditingRounds;
  }

  mounted() {
    bus.$on('edit-rounds', this.toggleEditingRounds);
  }

  destroyed() {
    bus.$off('edit-rounds', this.toggleEditingRounds);
  }
}
</script>

<style lang="stylus" scoped>
.rounds-col
  width: 100%;
  flex-basis: 0;
  flex-grow: 1;
  max-width: 100%;
  align-items: start;
</style>
