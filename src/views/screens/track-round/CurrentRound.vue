<template lang="pug">
  v-layout(class="gma-scrolling-layout" ref="shotsList")
    v-list(v-show="!isAddingShot" class="gma-mistake-list")
      v-list-item(v-show="!par || isEditing")
        v-list-item-title(class="gma-list-item__link"
          @click.stop="addPar = true") + {{ !par ? 'add ' : 'change ' }} par
      v-divider(v-show="!par || isEditing" v-bind:class="{'par-action--divider': shots.length}")
      v-list-item-group
        v-list-item(v-for="shot in shots" :key="shot.shotIndex"
            v-bind:class="[ shot.mistake ? 'shot-mistake' : 'shot-success', 'shot-list-item' ]"
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
      v-list-item(id="addItem")
        v-list-item-title(class="gma-list-item__link" @click="addShot") + add a shot
      v-fab-transition
        v-btn(class="btn-info--fab" color="secondary"
              active-class="btn-info--active" small fixed fab
              bottom right v-model="showHoleInfo" @click="onInfoButtonClicked")
          v-icon mdi-golf
          div(class="hole-info")
            div(class="hole-info__content")
              span(class="hole-info-label") {{ holeInfoString }}

      v-btn(fab fixed right bottom v-show="!isAddingShot" small dark @click="addShot")
        v-icon mdi-plus

    AddShot(v-show="isAddingShot" v-on:done-add="onShotAdded" :key="isAddingShot")

    v-dialog(v-model="addPar" max-width="300")
      v-card(class="pars-card")
        v-card-title(class="headline") Select Par
        div(class="d-flex par-actions")
          v-btn(class="ma-2" dark small fab @click="par = 3") 3
          v-btn(class="ma-2" dark small fab @click="par = 4") 4
          v-btn(class="ma-2" dark small fab @click="par = 5") 5

    v-dialog(v-model="showShotInfo" max-width="300")
      v-card(@click.stop="showShotInfo = false")
        v-card-title(class="headline") Shot {{ shotInfo.shotNo }}
        div(class="gma-shot-details")
          div(class="gma-shot__title") Type:
          div(class="gma-shot__content") {{ shotInfo.type }}
          div(class="gma-shot__title") Category:
          div(class="gma-shot__content") {{ shotInfo.category }}
          div(class="gma-shot__title") Description:
          div(class="gma-shot__content") {{ shotInfo.desc }}
          div(class="d-flex")
            span(class="gma-shot__title") Mistake:
            span(class="gma-shot__content-inline") {{ shotInfo.mistake }}
            span(class="gma-shot__title-inline") Penalty:
            span(class="gma-shot__content-inline") {{ shotInfo.penalty }}

  // This isn't working on Android when installed as debug apk, but works when debugging
  // using local web server :(
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
} from '@/store/current-round/getter-types';
import { Hole, CourseDetails } from '@/store/current-round/types.d';
import { MISTAKES, CATEGORIES } from '@/store/mistake-defs/getter-types';
import { MistakeDef, ShotCategory } from '@/store/mistake-defs/types.d';
import { SAVE_ROUND } from '@/store/rounds/action-types';
import { RoundData } from '@/store/rounds/types.d';

const CurrentRoundModule = namespace('currentRound');
const ShotTypesModule = namespace('mistakeDefs');
const RoundsModule = namespace('rounds');

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

  @CurrentRoundModule.Mutation(DELETE_ROUND)
  deleteRound!: () => Promise<void>;

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

  @CurrentRoundModule.Getter(IS_ADDING_MISTAKE)
  isAddingShot!: boolean;

  @CurrentRoundModule.Getter(HOLES)
  holes!: Array<Hole>;

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

  @ShotTypesModule.Getter(CATEGORIES)
  categories!: Array<ShotCategory>;

  @ShotTypesModule.Getter(MISTAKES)
  shotTypes!: Array<MistakeDef>;

  showHoleInfo = false;

  showShotInfo = false;

  addPar = false;

  holeInfoTimeout?: number = null;

  isEditing = false;

  shotInfo = {
    shotNo: '',
    type: '',
    desc: '',
    category: '',
    mistake: '',
    penalty: '',
  };

  /* eslint-disable */
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

  get shots() {
    const index = this.currentHole - 1;

    return this.holes[index].shots.map((shot, shotIndex) => {
      const shotType = this.shotTypes.find((type) => type.id === shot.shotId);
      const shotCategory =
        this.categories.find((category) => category.id === shotType.categoryId);
      return {
        mistake: shot.mistake,
        penalty: shot.addPenalty,
        shotIndex,
        shotType,
        category: shotCategory.name,
      };
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

  onShotAdded() {
    this.scrollToBottom();
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
    return (event: any) => {
      if (event.cancelable) {
        event.preventDefault();
        event.stopPropagation();
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
    };

    this.saveRound(roundDetails)
      .then(() => {
        this.deleteRound();
      })
      .then(() => {
        this.$router.push('/track').catch(() => null);
      });
  }

  addPenalty(shotIndex: number) {
    this.togglePenaltyForHole(shotIndex);
  }

  openShotInfoDialog(shot: any) {
    this.shotInfo = {
      shotNo: shot.shotIndex + 1,
      type: shot.shotType.title,
      desc: shot.shotType.desc,
      category: shot.category,
      mistake: `\xa0${shot.mistake ? 'yes' : 'no'}`,
      penalty: `\xa0${shot.penalty ? 'yes' : 'no'}`,
    };

    this.showShotInfo = true;
  }

  /* eslint-disable class-methods-use-this */
  onContextMenu() {
    // don't show the context menu for long press in browsers
    return false;
  }
  /* eslint-enable class-methods-use-this */

  onToggleEditing() {
    this.isEditing = !this.isEditing;
  }

  mounted() {
    bus.$on('save-round', this.onSaveRound);
    bus.$on('toggle-edit', this.onToggleEditing);
  }

  destroyed() {
    bus.$off('save-round', this.onSaveRound);
    bus.$off('toggle-edit', this.onToggleEditing);
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
