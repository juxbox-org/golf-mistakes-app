<template lang="pug">
  v-tab-item(value="Rounds" :transition="false" :reverse-transition="false")
    div(v-if="!showRoundSummary" class="rounds-col")
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
          v-list-item(inactive :ripple="false" @click="showRound(round.id)")
            v-list-item-content
              v-list-item-title {{ round.course }}
              v-list-item-subtitle {{ roundInfoString(round) }}
              v-list-item-subtitle {{ pastSummaryString(round) }}
            v-list-item-action(v-show="isEditingRounds" @click.stop="onDeleteRound(round)")
              v-icon mdi-delete

    RoundStatsSummary(v-if="showRoundSummary" :roundId="roundId"
        v-on:done-round-summary="showRoundSummary = false")
</template>

<script lang="ts">
import Vue from 'vue';
import bus from '@/event-bus';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import {
  COURSE_DETAILS,
  IN_PROGRESS,
  ROUND_DETAILS,
  SCORING_SUMMARY,
} from '@/store/current-round/getter-types';
import {
  CourseDetails,
  RoundDetails,
  ScoringSummary,
} from '@/store/current-round/types.d';
import { GET_ALL_ROUNDS } from '@/store/rounds/getter-types';
import { Round } from '@/store/rounds/types.d';
import { DELETE_ROUND } from '@/store/current-round/mutation-types';
import { DELETE_STATS } from '@/store/mistake-defs/action-types';
import RoundStatsSummary from '@/views/screens/review-rounds/RoundStatsSummary.vue';

const CurrentRoundModule = namespace('currentRound');
const RoundsModule = namespace('rounds');
const ShotTypesModule = namespace('mistakeDefs');

@Component({
  name: 'RoundsSummary',

  components: {
    RoundStatsSummary,
  },
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

  @CurrentRoundModule.Getter(SCORING_SUMMARY)
  scoringSummary!: ScoringSummary;

  isEditingRounds = false;

  showRoundSummary = false;

  roundId?: number = null;

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

  get currSummaryString2() {
    const summary = this.scoringSummary;

    let summaryStr = `GIR: ${summary.gir} \xa0 `;
    summaryStr += summary.par ? `Par: ${summary.par} \xa0 ` : '';
    summaryStr += summary.birdie ? `Brd: ${summary.birdie} \xa0 ` : '';
    summaryStr += summary.eagle ? `Egl+: ${summary.eagle} \xa0 ` : '';
    summaryStr += summary.bogey ? `Bgy: ${summary.bogey} \xa0 ` : '';
    summaryStr += summary.double ? `Dbl: ${summary.double} \xa0 ` : '';
    summaryStr += summary.triple ? `Tpl+: ${summary.triple} \xa0 ` : '';

    return summaryStr;
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

  onDeleteRound(round: Round) {
    this.deleteStatsForRound(round)
      .then(() => {
        this.deleteRound(round);
      });
  }

  toggleEditingRounds() {
    this.isEditingRounds = !this.isEditingRounds;
  }

  showRound(id: number) {
    this.roundId = id;
    this.showRoundSummary = true;
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
