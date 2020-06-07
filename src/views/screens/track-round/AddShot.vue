<template lang="pug">
  v-list(two-line class="gma-mistake-list")
    v-list
      v-list-group(v-for="category in shotCategories" :key="category.name")
        template(v-slot:activator)
          v-list-item-content
            v-list-item-title {{ category.name }}

        v-list-item(v-for="shot in category.shots" :key="shot.title" @click="addShot(shot.id)")
          v-list-item-content
            v-list-item-title {{ shot.title }}
            v-list-item-subtitle {{ shot.desc }}
          v-btn(icon)
            v-icon(color="grey lighten-1") mdi-information

        v-list-item(v-if="!category.shots.length")
          v-list-item-content
            v-list-item-title(class="gma-list-item__empty") ( no shots )
</template>

<script lang="ts">
/* eslint-disable operator-linebreak */
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { MISTAKES, CATEGORIES } from '@/store/mistake-defs/getter-types';
import { MistakeDef, ShotCategory } from '@/store/mistake-defs/types.d';
import { CURRENT_HOLE } from '@/store/current-round/getter-types';
import { ADD_SHOT_TO_HOLE } from '../../../store/current-round/mutation-types';

const MistakeDefsModule = namespace('mistakeDefs');
const CurrentRoundModule = namespace('currentRound');

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
  addShotToHole!: (arg0: number) => void;

  get shotCategories() {
    return this.categories.map((category) => {
      const groupedShots =
        this.mistakes.filter((mistake) => mistake.categoryId === category.id);

      return { ...category, shots: groupedShots, active: false };
    });
  }

  addShot(id: number) {
    this.addShotToHole(id);
    this.$emit('done-add');
  }
}
</script>

<style lang="stylus" scoped>
  .mistakes-list {
    width: 100%;
  }
</style>
