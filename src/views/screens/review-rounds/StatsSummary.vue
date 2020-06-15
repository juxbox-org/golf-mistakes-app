<template lang="pug">
  v-tab-item(value="Stats" :transition="false" :reverse-transition="false")
    v-list(class="gma-mistake-list")
      v-list-group(v-for="category in categories" :key="category.name"
          v-model="category.active" :ripple="false")
        template(v-slot:activator)
          v-list-item-content
            v-list-item-title {{ category.name }}
          v-list-item-action
            div {{ categorySummaryStr(category) }}

        v-list-item(v-for="shot in category.shots" :key="shot.title"
            :ripple="false" color="secondary")
          v-list-item-content(@click="addShot(shot.id)")
            v-list-item-title {{ shot.title }}
            v-list-item-subtitle {{ shotSummaryStr(shot) }}
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
import { MISTAKES, SHOTS_CATEGORIES_WITH_SUMMARY } from '@/store/mistake-defs/getter-types';
import { MistakeDef, ShotCategoryWithSummary } from '@/store/mistake-defs/types.d';
import { namespace } from 'vuex-class';
import { UPDATE_ALL_SHOTS } from '../../../store/mistake-defs/action-types';
import { HAS_UPDATED } from '../../../store/rounds/getter-types';
import { SET_HAS_UPDATED } from '../../../store/rounds/mutation-types';

const MistakeDefsModule = namespace('mistakeDefs');
const RoundsModule = namespace('rounds');

@Component({
  name: 'StatsSummary',
})
export default class StatsSummary extends Vue {
  @MistakeDefsModule.Getter(MISTAKES)
  mistakes!: Array<MistakeDef>;

  @MistakeDefsModule.Getter(SHOTS_CATEGORIES_WITH_SUMMARY)
  categories!: Array<ShotCategoryWithSummary>;

  @MistakeDefsModule.Action(UPDATE_ALL_SHOTS)
  updateAllShots!: () => Promise<void>;

  @RoundsModule.Getter(HAS_UPDATED)
  hasUpdated!: boolean;

  @RoundsModule.Mutation(SET_HAS_UPDATED)
  setHasUpdated!: () => void;

  showShotInfo = false;

  shotInfo = {
    title: '',
    category: '',
    desc: '',
  };

  /* eslint-disable class-methods-use-this */
  categorySummaryStr(category: ShotCategoryWithSummary) {
    return `${category.totalMistakes} / ${category.totalShots} \xa0 (${category.average}%)`;
  }

  shotSummaryStr(shot: MistakeDef) {
    const totalShots = shot.totalShots || 0;
    const totalMistakes = shot.totalMistakes || 0;
    const average = totalShots ? (totalMistakes / totalShots) * 100 : 0;
    return `Shots: ${totalShots} \xa0\xa0 Mistakes: ${totalMistakes} \xa0\xa0 (${average}%)`;
  }
  /* eslint-enable class-methods-use-this */

  openInfoDialog(title: string, desc: string, category: string) {
    this.shotInfo = {
      title,
      desc,
      category,
    };

    this.showShotInfo = true;
  }

  mounted() {
    if (!this.hasUpdated) {
      this.updateAllShots().then(() => {
        this.setHasUpdated();
      });
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
