<template lang="pug">
  v-layout(class="gma-scrolling-layout" ref="shotsList")
    v-list(v-if="!isAddingShot" class="gma-mistake-list")
      v-list-item(v-show="!par")
        v-list-item-title(class="gma-list-item__link" @click.stop="addPar = true") + add par
      v-divider(v-show="!par")
      v-list-item-group(multiple active-class="shot-mistake--active"
            v-model="selected")
        v-list-item(v-for="shot in shots" :key="shot.shotIndex" class="shot-success")
          v-list-item-content
            v-list-item-title {{ shot.shotType.title }}
            v-list-item-subtitle(class="text--primary") {{ shot.category }}
            v-list-item-subtitle {{ shot.shotType.desc }}
          v-list-item-action
            v-list-item-action-text Shot {{ shot.shotIndex + 1 }}
            v-btn(icon v-on:click.stop="deleteShot(shot.shotIndex)")
              v-icon(color="grey") mdi-delete-circle
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
              span(class="hole-info-label") Par: {{ par || '?' }}
      v-fab-transition
        v-btn(dark fixed small right bottom fab v-show="!isAddingShot"
            @click="addShot")
          v-icon mdi-pencil

    AddShot(v-if="isAddingShot" v-on:done-add="onShotAdded")

    v-dialog(v-model="addPar" max-width="300")
      v-card(class="pars-card")
        v-card-title(class="headline") Select Par
        div(class="d-flex par-actions")
          v-btn(class="ma-2" dark small fab @click="par = 3") 3
          v-btn(class="ma-2" dark small fab @click="par = 4") 4
          v-btn(class="ma-2" dark small fab @click="par = 5") 5
</template>

<script lang="ts">
/* eslint-disable operator-linebreak */
import Vue from 'vue';
import Component from 'vue-class-component';
import store from '@/store/index';
import AddShot from '@/views/screens/track-round/AddShot.vue';
import { namespace } from 'vuex-class';
import {
  START_ADDING_MISTAKE,
  DELETE_SHOT_FROM_HOLE,
  ADD_PAR_TO_HOLE,
  ADD_MISTAKES_TO_HOLE,
} from '@/store/current-round/mutation-types';
import {
  IS_ADDING_MISTAKE,
  HOLES,
  CURRENT_HOLE,
  PAR_CURRENT_HOLE,
  MISTAKES_FOR_HOLE,
} from '@/store/current-round/getter-types';
import { Hole } from '@/store/current-round/types.d';
import { MISTAKES, CATEGORIES } from '@/store/mistake-defs/getter-types';
import { MistakeDef, ShotCategory } from '@/store/mistake-defs/types.d';

const CurrentRoundModule = namespace('currentRound');
const ShotTypesModule = namespace('mistakeDefs');

const TRACK_BASE_PATH = '/track';
const TRACK_HOLE_PATH = '/track/hole';

Component.registerHooks([
  'beforeRouteEnter',
]);

@Component({
  name: 'CurrentRound',

  components: {
    AddShot,
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
  @CurrentRoundModule.Mutation(START_ADDING_MISTAKE)
  startAddingShot!: () => void;

  @CurrentRoundModule.Mutation(DELETE_SHOT_FROM_HOLE)
  deleteShotFromHole!: (arg0: number) => void;

  @CurrentRoundModule.Mutation(ADD_PAR_TO_HOLE)
  addParToHole!: (arg0: number) => void;

  @CurrentRoundModule.Mutation(ADD_MISTAKES_TO_HOLE)
  addMistakesToHole!: (arg0: Array<number>) => void;

  @CurrentRoundModule.Getter(IS_ADDING_MISTAKE)
  isAddingShot!: boolean;

  @CurrentRoundModule.Getter(HOLES)
  holes!: Array<Hole>;

  @CurrentRoundModule.Getter(CURRENT_HOLE)
  currentHole!: number;

  @CurrentRoundModule.Getter(PAR_CURRENT_HOLE)
  parForCurrentHole!: number;

  @CurrentRoundModule.Getter(MISTAKES_FOR_HOLE)
  mistakesForCurrentHole!: Array<number>;

  @ShotTypesModule.Getter(CATEGORIES)
  categories!: Array<ShotCategory>;

  @ShotTypesModule.Getter(MISTAKES)
  shotTypes!: Array<MistakeDef>;

  showHoleInfo = false;

  addPar = false;

  holeInfoTimeout?: number = null;

  get selected() {
    return this.mistakesForCurrentHole;
  }

  set selected(value) {
    this.addMistakesToHole(value);
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
  padding-right: 60px;
  max-width: none;

.par-actions
  align-items: center;
  justify-content: center;

.pars-card
  padding-bottom: 16px;

.shot-success {
  color: #4CAF50 !important;
  background-color: #4CAF5010;
  caret-color: #4CAF50;
  border: solid 2px;
  border-radius: 2px;
  margin-bottom: 3px;
}

.shot-mistake--active {
  color: #F44336 !important;
  caret-color: #F44336 !important;
  background-color: #F4433610;
  border: solid 2px;
  border-radius: 2px;
  margin-bottom: 3px;
}

.action--divider {
  margin-top: 10px;
}

</style>
