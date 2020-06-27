<template lang="pug">
  v-layout(class="gma-scrolling-layout" ref="shotsList"
      v-touch:swipe.left="onSwipeLeft" v-touch:swipe.right="onSwipeRight")
    v-list(v-show="!isAddingShot" class="gma-mistake-list")
      v-list-item(v-show="!par || isEditing" class="gma-list-item__link"
          @click.stop="addPar = true")
        v-btn(v-if="!par || isEditing" dark rounded small) + {{ !par ? 'add ' : 'change ' }} par
        v-btn(v-else rounded small) + {{ !par ? 'add ' : 'change ' }} par
      v-divider(v-show="!par || isEditing" v-bind:class="{'par-action--divider': shots.length}")
      v-list-item-group
        v-list-item(v-for="shot in shots" :key="shot.shotIndex"
            v-bind:class="[ shot.mistake ? 'gma-high-risk' : 'gma-low-risk', 'shot-list-item' ]"
            @contextmenu.prevent="onContextMenu" :ripple="false" inactive)
          v-list-item-content(v-touch:touchhold="onToggleMistake(shot.shotIndex)")
            v-list-item-title {{ shot.shotType.title }}
            v-list-item-subtitle(class="text--primary") {{ shot.category }}
            v-list-item-subtitle {{ shot.shotType.desc }}
          v-list-item-action
            v-btn(icon x-small fab :ripple="false" :outlined="!shot.penalty"
                v-bind:class="['penalty--icon', {'penalty--active': shot.penalty}]"
                @click.stop="addPenalty(shot.shotIndex)") +1
          v-list-item-action
            v-list-item-action-text Shot {{ shot.shotIndex + 1 }}
            v-btn(v-if="isEditing" icon v-on:click.stop="deleteShot(shot.shotIndex)")
              v-icon(color="red") mdi-close-circle
            v-btn(v-else icon v-on:click.stop="openShotInfoDialog(shot)")
              v-icon(color="grey") mdi-information
      v-divider(v-show="shots.length" class="action--divider")
      v-list-item(id="addItem" class="gma-list-item__link" @click="addShot")
        v-btn(v-if="isEditing || !par" rounded small outlined) + add a shot
        v-btn(v-else dark rounded small) + add a shot
      v-fab-transition
        v-btn(color="secondary" small
            active-class="btn-info--active" fixed fab
            bottom right v-model="showHoleInfo" @click="onInfoButtonClicked")
          v-icon mdi-golf
          div(class="hole-info")
            div(class="hole-info__content")
              span(class="hole-info-label") {{ holeInfoString }}

    // Having the "add shot" button as a fab doesn't seem to be helpful - I never use it, anyways
      v-btn(fab fixed right bottom v-show="!isAddingShot" small dark @click="addShot")
        v-icon mdi-plus

    AddShot(v-show="isAddingShot" v-on:done-add="onShotAdded($event)" :key="isAddingShot")

    v-dialog(v-model="addPar" max-width="300")
      v-card(class="pars-card")
        v-card-title(class="headline") Select Par
        div(class="d-flex par-actions")
          div(v-for="n in 3")
            v-btn(class="ma-2" dark elevation="0" small fab @click="par = n + 2") {{ n + 2 }}

    ShotInfoDialog(v-if="showShotInfo" :visible="showShotInfo" :shotInfo="shotInfo"
        @close="showShotInfo = false" v-on:edit-swing="onEditSwing($event)"
        v-on:edit-result="onEditResult")

    ResultsDialog(v-if="showResultsDialog" :shotId="currentShot" :existingShot="existingShot"
        :showResultsDialog="showResultsDialog" v-on:results-done="onResultsDone($event)")

    AddShotStatsDialog(v-if="showAddStatsDialog" :shotId="currentShot"
        v-on:stats-done="onAddSwingDone" :existingShot="existingShot")

  // This isn't working on Android when installed as apk, but works when debugging
  // using local web server :( Needs further investigation.
    v-speed-dial(fixed right bottom v-show="!isAddingShot" v-model="edit")
      template(v-slot:activator)
        v-btn(dark small fab)
          v-icon(v-if="edit") mdi-close
          v-icon(v-else) mdi-file-edit-outline
      v-btn(fab small dark @click="addShot(false)")
        v-icon mdi-plus
      v-btn(fab small color="secondary" @click="addPar = true")
        v-icon mdi-pencil
</template>

<script lang="ts">
/* eslint-disable operator-linebreak */
import Vue from 'vue';
import Component from 'vue-class-component';
import store from '@/store/index';
import bus from '@/event-bus';
import AddShot from '@/views/screens/track-round/AddShot.vue';
import { namespace } from 'vuex-class';
import {
  START_ADDING_MISTAKE,
  DELETE_SHOT_FROM_HOLE,
  ADD_PAR_TO_HOLE,
  ADD_MISTAKES_TO_HOLE,
  DELETE_ROUND,
  TOGGLE_PENALTY_FOR_HOLE,
  UPDATE_CURRENT_HOLE,
  ADD_RESULT_TO_SHOT,
  ADD_CLUB_DATA_TO_SHOT,
} from '@/store/current-round/mutation-types';
import {
  IS_ADDING_MISTAKE,
  HOLES,
  CURRENT_HOLE,
  PAR_CURRENT_HOLE,
  MISTAKES_FOR_HOLE,
  PENALTIES_FOR_HOLE,
  PUTTS_FOR_HOLE,
  COURSE_DETAILS,
  IS_EDITING_HOLE,
  SHOTS_WITH_CATEGORIES,
} from '@/store/current-round/getter-types';
import {
  CourseDetails,
  ShotInfo,
  ResultData,
  ClubData,
} from '@/store/current-round/types.d';
import { MISTAKES } from '@/store/mistake-defs/getter-types';
import { MistakeDef, Results } from '@/store/mistake-defs/types.d';
import { SAVE_ROUND } from '@/store/rounds/action-types';
import { RoundHole, RoundData } from '@/store/rounds/types.d';
import { UPDATE_STATS } from '@/store/mistake-defs/action-types';
import { getKeysForResult } from '@/store/helpers/results';
import ResultsDialog from '@/components/ResultsDialog.vue';
import AddShotStatsDialog from '@/components/AddShotStatsDialog.vue';
import ShotInfoDialog from '@/components/ShotInfoDialog.vue';
import { UPDATE_CLUB_STATS } from '@/store/clubs/action-types';

interface Indexable {
  [key: string]: boolean;
}

const CurrentRoundModule = namespace('currentRound');
const ShotTypesModule = namespace('mistakeDefs');
const RoundsModule = namespace('rounds');
const ClubsModule = namespace('clubs');

const TRACK_BASE_PATH = '/track';
const TRACK_HOLE_PATH = '/track/hole';

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
]);

@Component({
  name: 'CurrentRound',

  components: {
    AddShot,
    ResultsDialog,
    AddShotStatsDialog,
    ShotInfoDialog,
  },

  beforeRouteLeave(to, from, next) {
    next();
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      (vm as CurrentRound).scrollToBottom();
    });
  },

  watch: {
    $route(to /* , from */) {
      /*
       * The $route handler is called on each route change whether component
       * is visible or not, so skip if route is not relevant to the component
       */
      if (to.path.substr(0, 5) !== TRACK_BASE_PATH) {
        return;
      }

      const currRoundState = store.state.currentRound;
      const toHole = parseInt(to.params.hole_no, 10);

      if (!currRoundState.inProgress) {
        this.$router.push(TRACK_BASE_PATH).catch(() => null);
      } else if (Number.isNaN(toHole) || toHole < 1 || toHole > 18) {
        this.$router.push(`${TRACK_HOLE_PATH}/${currRoundState.currentHole}`);
      }
    },
  },
})
export default class CurrentRound extends Vue {
  @RoundsModule.Action(SAVE_ROUND)
  saveRound!: (arg0: RoundData) => Promise<void>;

  @ShotTypesModule.Action(UPDATE_STATS)
  updateStats!: (arg0: RoundData) => Promise<void>;

  @ClubsModule.Action(UPDATE_CLUB_STATS)
  updateClubStats!: (arg0: RoundData) => Promise<void>;

  @CurrentRoundModule.Mutation(DELETE_ROUND)
  endRound!: () => Promise<void>;

  @CurrentRoundModule.Mutation(START_ADDING_MISTAKE)
  startAddingShot!: () => void;

  @CurrentRoundModule.Mutation(DELETE_SHOT_FROM_HOLE)
  deleteShotFromHole!: (arg0: number) => void;

  @CurrentRoundModule.Mutation(ADD_PAR_TO_HOLE)
  addParToHole!: (arg0: number) => void;

  @CurrentRoundModule.Mutation(ADD_MISTAKES_TO_HOLE)
  toggleMistakeForHole!: (arg0: number) => void;

  @CurrentRoundModule.Mutation(TOGGLE_PENALTY_FOR_HOLE)
  togglePenaltyForHole!: (arg0: number) => void;

  @CurrentRoundModule.Mutation(UPDATE_CURRENT_HOLE)
  updateCurrentHole!: (arg0: number) => void;

  @CurrentRoundModule.Mutation(ADD_RESULT_TO_SHOT)
  addResultToShot!: (arg0: ResultData) => void;

  @CurrentRoundModule.Mutation(ADD_CLUB_DATA_TO_SHOT)
  addClubDataToShot!: (arg0: ClubData) => void;

  @CurrentRoundModule.Getter(IS_ADDING_MISTAKE)
  isAddingShot!: boolean;

  @CurrentRoundModule.Getter(HOLES)
  holes!: Array<RoundHole>;

  @CurrentRoundModule.Getter(CURRENT_HOLE)
  currentHole!: number;

  @CurrentRoundModule.Getter(PAR_CURRENT_HOLE)
  parForCurrentHole!: number;

  @CurrentRoundModule.Getter(MISTAKES_FOR_HOLE)
  mistakesForCurrentHole!: number;

  @CurrentRoundModule.Getter(PENALTIES_FOR_HOLE)
  penaltiesForCurrentHole!: number;

  @CurrentRoundModule.Getter(PUTTS_FOR_HOLE)
  numPutts!: number;

  @CurrentRoundModule.Getter(COURSE_DETAILS)
  courseDetails!: CourseDetails;

  @CurrentRoundModule.Getter(IS_EDITING_HOLE)
  isEditing!: boolean;

  @CurrentRoundModule.Getter(SHOTS_WITH_CATEGORIES)
  shots!: Array<ShotInfo>;

  @ShotTypesModule.Getter(MISTAKES)
  shotTypes!: Array<MistakeDef>;

  showHoleInfo = false;

  showShotInfo = false;

  showResultsDialog = false;

  showAddStatsDialog = false;

  addPar = false;

  holeInfoTimeout?: number = null;

  currentShot?: number = null;

  existingShot = false;

  shotInfo = {
    shotId: 0,
    shotNo: 0,
    club: 0,
    swing: 0,
    distance: 0,
    type: '',
    desc: '',
    category: '',
    mistake: '',
    penalty: '',
    result: {},
    isMistake: false,
    recordSwing: false,
  };

  get holeInfoString() {
    const penaltiesStr = this.penaltiesForCurrentHole ? `+${this.penaltiesForCurrentHole}` : null;
    return `Par: ${this.par || '?'} \xa0Shots: ${this.shots.length}${penaltiesStr || ''} \xa0`
      + `Mistakes: ${this.mistakesForCurrentHole} \xa0Putts: ${this.numPutts}`;
  }

  get par() {
    return this.parForCurrentHole;
  }

  set par(value) {
    this.addParToHole(value);
    this.addPar = false;

    this.$nextTick(() => {
      this.expandHoleInfo();
    });
  }

  addShot() {
    this.startAddingShot();
  }

  deleteShot(shotIndex: number) {
    this.deleteShotFromHole(shotIndex);
  }

  scrollToBottom() {
    this.$nextTick(() => {
      const el = this.$el.querySelector('#addItem');
      el.scrollIntoView();
    });
  }

  onShotAdded(recordSwing: boolean) {
    this.currentShot = this.shots.length - 1;
    this.scrollToBottom();
    if (recordSwing) {
      this.showAddStatsDialog = true;
    }
  }

  onInfoButtonClicked() {
    if (!this.showHoleInfo) {
      this.expandHoleInfo();
    } else {
      this.showHoleInfo = false;
    }
  }

  expandHoleInfo() {
    this.showHoleInfo = true;

    if (this.holeInfoTimeout) {
      clearTimeout(this.holeInfoTimeout);
    }

    this.holeInfoTimeout = setTimeout(() => {
      this.showHoleInfo = false;
      this.holeInfoTimeout = null;
    }, 8000);
  }

  onToggleMistake(shotIndex: number) {
    return (event: TouchEvent) => {
      if (event.cancelable) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (!this.shots[shotIndex].mistake) {
        this.currentShot = shotIndex;
        this.showResultsDialog = true;
      } else {
        // Clear the mistake result(s) from the shot
        this.addResultToShot({ shotId: shotIndex, result: 0 });
        this.expandHoleInfo();
      }

      this.toggleMistakeForHole(shotIndex);

      return true;
    };
  }

  onSaveRound() {
    const roundDetails = {
      course: this.courseDetails.course,
      date: this.courseDetails.date,
      holes: this.holes,
    } as RoundData;

    if (this.courseDetails.slope) {
      roundDetails.slope = this.courseDetails.slope;
    }

    if (this.courseDetails.rating) {
      roundDetails.rating = this.courseDetails.rating;
    }

    if (this.courseDetails.tees) {
      roundDetails.tees = this.courseDetails.tees;
    }

    this.saveRound(roundDetails)
      .then(() => {
        this.updateStats(roundDetails);
      })
      .then(() => {
        this.updateClubStats(roundDetails);
      })
      .then(() => {
        this.endRound();
      })
      .then(() => {
        this.$router.push('/review');
      });
  }

  addPenalty(shotIndex: number) {
    this.togglePenaltyForHole(shotIndex);

    this.expandHoleInfo();
  }

  openShotInfoDialog(shot: ShotInfo) {
    this.shotInfo = {
      shotId: shot.shotIndex,
      shotNo: shot.shotIndex + 1,
      type: shot.shotType.title,
      desc: shot.shotType.desc,
      category: shot.category,
      mistake: `\xa0${shot.mistake ? 'yes' : 'no'}`,
      penalty: `\xa0${shot.penalty ? 'yes' : 'no'}`,
      isMistake: shot.mistake,
      result: null,
      club: shot.club,
      swing: shot.swing,
      distance: shot.distance,
      recordSwing: shot.recordSwing,
    };

    if (shot.mistake) {
      const resultFields = getKeysForResult(shot.result);
      if (resultFields.length) {
        this.shotInfo.result = {} as Results;

        resultFields.forEach((field) => {
          (this.shotInfo.result as Indexable)[field] = true;
        });
      }
    }

    this.showShotInfo = true;
  }

  onResultsDone(resultData: ResultData) {
    this.showResultsDialog = false;
    this.existingShot = false;

    if (resultData.result) {
      this.addResultToShot(resultData);
    }

    this.expandHoleInfo();
  }

  onAddSwingDone(swingData: ClubData) {
    this.showAddStatsDialog = false;
    this.existingShot = false;

    if (swingData) {
      this.addClubDataToShot(swingData);
    }
  }

  onEditSwing() {
    this.showShotInfo = false;
    this.existingShot = true;
    this.currentShot = this.shotInfo.shotId;
    this.showAddStatsDialog = true;
  }

  onEditResult() {
    this.showShotInfo = false;
    this.existingShot = true;
    this.currentShot = this.shotInfo.shotId;
    this.showResultsDialog = true;
  }

  /* eslint-disable class-methods-use-this */
  onContextMenu() {
    // don't show the context menu for long press in browsers
    return false;
  }
  /* eslint-enable class-methods-use-this */

  /* eslint-disable class-methods-use-this */
  onSwipeLeft() {
    if (this.currentHole === 18) {
      return;
    }

    const toHole = this.currentHole + 1;
    this.updateCurrentHole(toHole);
    this.$router.push(`/track/hole/${toHole}`);
  }

  onSwipeRight() {
    if (this.currentHole === 1) {
      return;
    }

    const toHole = this.currentHole - 1;
    this.updateCurrentHole(toHole);
    this.$router.push(`/track/hole/${toHole}`);
  }

  mounted() {
    bus.$on('save-round', this.onSaveRound);
  }

  destroyed() {
    bus.$off('save-round', this.onSaveRound);
  }
}
</script>

<style lang="stylus">
.info-snack--bottom
  width: 200px;
  right: 100px;
  bottom: 65px;

.btn-info--fab
  display: flex;
  right: 72px !important;

.hole-info
  position: absolute;
  right: 0;
  top: auto !important;
  left: auto !important;
  width: 100%;
  padding: 50% 0;
  transform: none !important;
  opacity: 1 !important;
  z-index: 0;

.hole-info__content
  position: absolute;
  display: flex;
  justify-content: center;
  align-content: center;
  right: 0;
  top: 0;
  height: 100%;
  border-radius: 56px;
  transition: all .3s cubic-bezier(.25,.8,.5,1);
  min-height: 100%;
  min-width: 100%;

.btn-info--active .hole-info__content
  background-color: #272727;

.hole-info-label
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 0;
  overflow: hidden;
  transition: all .3s cubic-bezier(.25,.8,.5,1);
  padding: 0;

.btn-info--active .hole-info-label
  padding-left: 16px;
  padding-right: 16px;
  max-width: none;

.par-actions
  align-items: center;
  justify-content: center;

.pars-card
  padding-bottom: 16px;

.shot-success
  color: #4CAF50 !important;
  background-color: #4CAF5010;
  caret-color: #4CAF50;
  border: solid #4CAF50 1px;
  border-radius: 2px;
  margin-bottom: 3px;

.shot-success .v-list-item__title
  color: #4CAF50 !important;

.shot-mistake
  color: #F44336 !important;
  caret-color: #F44336 !important;
  background-color: #F4433610;
  border: solid #F44336 1px;
  border-radius: 2px;
  margin-bottom: 3px;

.shot-mistake .v-list-item__title
  color: #F44336 !important;

.shot-list-item
  user-select: none;
  -webkit-user-select: none;

.action--divider
  margin-top: 10px;

.par-action--divider
  margin-bottom: 10px;

.penalty--icon
  height: 24px !important;
  width: 24px !important;

.penalty--icon span
  color: grey;
  font-size: 12px;

.penalty--active
  background-color: #ffce44;

.penalty--active span
  color: white;
  font-weight: bold;
</style>
