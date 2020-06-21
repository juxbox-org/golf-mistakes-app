<template lang="pug">
  v-tab-item(value="Stats" :transition="false" :reverse-transition="false")
    v-list(class="gma-mistake-list")
      v-list-group(v-for="category in categories" :key="category.name" :ripple="false")
        template(v-slot:activator)
          v-list-item-content
            v-list-item-title {{ category.name }}
          v-list-item-action
            div {{ categorySummaryStr(category) }}

        v-list-item(v-for="shot in category.shots" :key="shot.title"
            :ripple="false" color="secondary" @click.stop="openInfoDialog(shot, category.name)")
          v-list-item-content
            v-list-item-title {{ shot.title }}
            v-list-item-subtitle {{ shotSummaryStr(shot) }}
            v-list-item-subtitle {{ resultsSummaryString(shot) }}
          v-list-item-action
            v-btn(icon)
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
          div(class="gma-shot__title") Result:
          div(class="gma-shot__content")
            ResultsChips(v-if="shotInfo.result !== null" :isCloseable="false"
                :data="shotInfo.result" :justify="'start'" :hasData="true")
            span(v-else) (no result recorded)
</template>

<script lang="ts">
/* eslint-disable operator-linebreak */
import Vue from 'vue';
import Component from 'vue-class-component';
import { resultsSummaryForShot } from '@/store/helpers/results';
import { MISTAKES, SHOTS_CATEGORIES_WITH_SUMMARY } from '@/store/mistake-defs/getter-types';
import { MistakeDef, ShotCategoryWithSummary } from '@/store/mistake-defs/types.d';
import { namespace } from 'vuex-class';
import { UPDATE_ALL_SHOTS } from '@/store/mistake-defs/action-types';
import { HAS_UPDATED } from '@/store/rounds/getter-types';
import { SET_HAS_UPDATED } from '@/store/rounds/mutation-types';
import ResultsChips from '@/components/ResultsChips.vue';

const MistakeDefsModule = namespace('mistakeDefs');
const RoundsModule = namespace('rounds');

@Component({
  name: 'StatsSummary',

  components: {
    ResultsChips,
  },
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
    result: {},
  };

  /* eslint-disable class-methods-use-this */
  categorySummaryStr(category: ShotCategoryWithSummary) {
    if (!category.totalShots) {
      return '-';
    }

    return `${category.totalMistakes} / ${category.totalShots} \xa0 (${category.average}%)`;
  }

  shotSummaryStr(shot: MistakeDef) {
    const totalShots = shot.totalShots || 0;
    const totalMistakes = shot.totalMistakes || 0;
    const average = totalShots ? Math.round((totalMistakes / totalShots) * 100) : 0;

    if (!totalShots) {
      return '( no data yet )';
    }

    return `Shots: ${totalShots} \xa0\xa0 Mistakes: ${totalMistakes} \xa0\xa0 (${average}%)`;
  }

  resultsSummaryString(shot: MistakeDef) {
    const resultsSummary = resultsSummaryForShot(shot);

    let summaryStr = '';

    resultsSummary.forEach((value: number, key: string) => {
      const capitalKey = key.charAt(0).toUpperCase() + key.slice(1);
      summaryStr += `${capitalKey}: ${value}% \xa0\xa0`;
    });

    return summaryStr;
  }
  /* eslint-enable class-methods-use-this */

  openInfoDialog(shot: MistakeDef, category: string) {
    this.shotInfo = {
      title: shot.title,
      desc: shot.desc,
      category,
      result: [...resultsSummaryForShot(shot).entries()].sort((a, b) => b[1] - a[1]),
    };

    this.showShotInfo = true;
  }

  /*
  mounted() {
    if (!this.hasUpdated) {
      this.updateAllShots().then(() => {
        this.setHasUpdated();
      });
    }
    }
   */
}
</script>

<style lang="stylus" scoped>
</style>
