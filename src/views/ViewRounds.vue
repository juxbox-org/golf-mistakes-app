<template lang="pug">
  v-layout
    v-list(class="gma-mistake-list")
      v-list-item(v-if="roundInProgress" to="/track")
        v-list-item-content
          v-list-item-title {{ inProgressTitleString }}
          v-list-item-subtitle In progress (through {{ holesPlayed }} holes)
          v-list-item-subtitle {{ summaryString }}
      v-list-item(v-if="!roundInProgress" class="gma-list-item__empty") (no rounds)

</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { COURSE_DETAILS, IN_PROGRESS, ROUND_DETAILS } from '@/store/current-round/getter-types';
import { CourseDetails, RoundDetails } from '@/store/current-round/types.d';

const CurrentRoundModule = namespace('currentRound');

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

  get holesPlayed() {
    return this.roundDetails.holesPlayed;
  }

  get inProgressTitleString() {
    return `${this.courseDetails.course}`;
  }

  get summaryString() {
    return `Shots: ${this.roundDetails.shots} \xa0\xa0 Mistakes: ${this.roundDetails.mistakes}`
    + ` \xa0\xa0 Putts: ${this.roundDetails.putts}`
    + ` \xa0\xa0 Score: ${this.roundDetails.score > 0 ? '+' : ''}${this.roundDetails.score}`;
  }
}
</script>
