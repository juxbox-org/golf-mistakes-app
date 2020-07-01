<template lang="pug">
  v-list(class="gma-mistake-list")
    v-list-group(v-for="category in shotsList" :key="category.name" :ripple="false"
        v-model="category.active")
      template(v-slot:activator)
        v-list-item-content
          v-list-item-title {{ category.name }}

      v-list-item(v-for="shot in category.shots" :key="shot.mistakeDef.title"
        :ripple="false" color="secondary")
        v-list-item-content(@click="addShot(shot)")
          v-list-item-title {{ shot.mistakeDef.title }}
          v-list-item-subtitle {{ shot.mistakeDetails.desc }}
        v-list-item-action
          v-btn(icon @click.stop="openInfoDialog(shot, category.name)")
            v-icon(color="grey lighten-1") mdi-information

      v-list-item(v-if="!category.shots.length" :ripple="false")
        v-list-item-content
          v-list-item-title(class="gma-list-item__empty") ( no shots )

      v-list-item(v-if="showSingleCategory" class="gma-list-item__link" @click="onShowAll")
        v-btn(rounded small outlined) + show all

    v-dialog(v-model="showShotInfo")
      v-card(@click.stop="showShotInfo = false")
        v-card-title Details
        v-card-text
          div(class="gma-shot-details")
            div(class="details-section")
              div(class="gma-shot__title") Shot Type:
              div(class="gma-shot__content") {{ shotInfo.title }}
              div(class="gma-shot__title") Shot Category:
              div(class="gma-shot__content") {{ shotInfo.category }}
              div(Class="gma-shot__title") Description:
              div(class="gma-shot__content") {{ shotInfo.desc }}
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { CATEGORIES_WITH_SHOTS } from '@/store/mistake-defs/getter-types';
import { MistakeDef, MistakeRecord } from '@/store/mistake-defs/types.d';
import { CURRENT_HOLE, SHOT_BY_INDEX } from '@/store/current-round/getter-types';
import { ADD_SHOT_TO_HOLE, STOP_ADDING_MISTAKE } from '@/store/current-round/mutation-types';
import { RoundShot } from '@/store/rounds/types.d';

const MistakeDefsModule = namespace('mistakeDefs');
const CurrentRoundModule = namespace('currentRound');

declare interface ActiveCategories extends MistakeDef {
  active?: boolean;
}

@Component({
  name: 'AddShot',
  props: {
    currentShotIndex: Number,
  },
})
export default class AddShot extends Vue {
  @MistakeDefsModule.Getter(CATEGORIES_WITH_SHOTS)
  shotCategories!: Array<MistakeDef>;

  @CurrentRoundModule.Getter(CURRENT_HOLE)
  currentHole!: number;

  @CurrentRoundModule.Getter(SHOT_BY_INDEX)
  currentShot!: (arg0: number) => RoundShot;

  @CurrentRoundModule.Mutation(ADD_SHOT_TO_HOLE)
  addShotToHole!: (arg0: MistakeRecord) => void;

  @CurrentRoundModule.Mutation(STOP_ADDING_MISTAKE)
  doneAddingMistake!: () => void;

  currentShotIndex!: number;

  get shotsList(): Array<ActiveCategories> {
    if (this.currentShotIndex < 0 && this.showSingleCategory) {
      const teeShots = this.shotCategories.find((category) => category.id === 1);
      this.showSingleCategory = true;

      (teeShots as ActiveCategories).active = true;

      return [teeShots];
    }

    if (this.currentShotIndex >= 0 && this.showSingleCategory &&
        this.currentShot(this.currentShotIndex).categoryId === 0) {
      const putts = this.shotCategories.find((category) => category.id === 0);
      this.showSingleCategory = true;

      (putts as ActiveCategories).active = true;

      return [putts];
    }

    return this.shotCategories.map((category): ActiveCategories =>
      ({ ...category, active: false }));
  }

  showSingleCategory = false;

  showShotInfo = false;

  shotInfo = {
    title: '',
    category: '',
    desc: '',
  };

  addShot(shot: MistakeRecord) {
    this.addShotToHole(shot);
    this.$emit('done-add', shot.mistakeDef.recordSwing);
  }

  openInfoDialog(shot: MistakeRecord, category: string) {
    this.shotInfo = {
      title: shot.mistakeDef.title,
      desc: shot.mistakeDetails.desc,
      category,
    };

    this.showShotInfo = true;
  }

  onShowAll() {
    this.showSingleCategory = false;
  }

  mounted() {
    if (this.currentShotIndex < 0 ||
        this.currentShot(this.currentShotIndex).categoryId === 0) {
      this.showSingleCategory = true;
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
