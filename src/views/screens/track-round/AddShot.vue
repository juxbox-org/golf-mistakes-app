<template lang="pug">
  v-list(class="gma-mistake-list")
    v-list-group(v-for="category in shotCategories" :key="category.name" :ripple="false")
      template(v-slot:activator)
        v-list-item-content
          v-list-item-title {{ category.name }}

      v-list-item(v-for="shot in category.shots" :key="shot.title"
          :ripple="false" color="secondary")
        v-list-item-content(@click="addShot(shot)")
          v-list-item-title {{ shot.title }}
          v-list-item-subtitle {{ shot.desc }}
        v-list-item-action
          v-btn(icon @click.stop="openInfoDialog(shot.title, shot.desc, category.name)")
            v-icon(color="grey lighten-1") mdi-information

      v-list-item(v-if="!category.shots.length" :ripple="false")
        v-list-item-content
          v-list-item-title(class="gma-list-item__empty") ( no shots )

    v-dialog(v-model="showShotInfo")
      v-card(@click.stop="showShotInfo = false")
        v-card-title Details
        div(class="gma-shot-details")
          div(class="gma-shot__title") Shot Type:
          div(class="gma-shot__content") {{ shotInfo.title }}
          div(class="gma-shot__title") Shot Category:
          div(class="gma-shot__content") {{ shotInfo.category }}
          div(Class="gma-shot__title") Description:
          div(class="gma-shot__content") {{ shotInfo.desc }}
</template>

<script lang="ts">
/* eslint-disable operator-linebreak */
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { MISTAKES, CATEGORIES } from '@/store/mistake-defs/getter-types';
import { MistakeDef, ShotCategory } from '@/store/mistake-defs/types.d';
import { CURRENT_HOLE } from '@/store/current-round/getter-types';
import { ADD_SHOT_TO_HOLE, STOP_ADDING_MISTAKE } from '../../../store/current-round/mutation-types';

const MistakeDefsModule = namespace('mistakeDefs');
const CurrentRoundModule = namespace('currentRound');

declare interface Categories extends ShotCategory {
  active: boolean;
  shots: Array<MistakeDef>;
}

@Component({
  name: 'AddShot',
})
export default class AddShot extends Vue {
  @MistakeDefsModule.Getter(MISTAKES)
  mistakes!: Array<MistakeDef>;

  @MistakeDefsModule.Getter(CATEGORIES)
  categories!: Array<ShotCategory>;

  @CurrentRoundModule.Getter(CURRENT_HOLE)
  currentHole!: number;

  @CurrentRoundModule.Mutation(ADD_SHOT_TO_HOLE)
  addShotToHole!: (arg0: MistakeDef) => void;

  @CurrentRoundModule.Mutation(STOP_ADDING_MISTAKE)
  doneAddingMistake!: () => void;

  showShotInfo = false;

  shotInfo = {
    title: '',
    category: '',
    desc: '',
  };

  get shotCategories() {
    return this.categories.map((category) => {
      const groupedShots =
        this.mistakes.filter((mistake) => mistake.categoryId === category.id);

      return { ...category, shots: groupedShots, active: false };
    });
  }

  addShot(shot: MistakeDef) {
    this.addShotToHole(shot);
    this.$emit('done-add', shot.recordSwing);
  }

  openInfoDialog(title: string, desc: string, category: string) {
    this.shotInfo = {
      title,
      desc,
      category,
    };

    this.showShotInfo = true;
  }
}
</script>

<style lang="stylus" scoped>
</style>
