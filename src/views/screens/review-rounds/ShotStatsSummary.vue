<template lang="pug">
  v-tab-item(value="ShotStats" :transition="false" :reverse-transition="false")
    v-list(class="gma-mistake-list")
      v-list-group(v-for="category in sortedCategories" :key="category.name" :ripple="false")
        template(v-slot:activator)
          v-list-item-content
            v-list-item-title {{ category.name }}
          v-list-item-action
            div {{ categorySummaryStr(category) }}

        v-list-item(v-for="shot in category.shots" :key="shot.mistakeDef.title"
            :ripple="false" color="secondary" @click.stop="openInfoDialog(shot, category.name)"
            v-bind:class="getRiskClass(shot)" inactive)
          v-list-item-content
            v-list-item-title {{ shot.mistakeDef.title }}
            v-list-item-subtitle {{ shotSummaryStr(shot) }}
            v-list-item-subtitle {{ resultsSummaryString(shot) }}
          v-list-item-action
            v-btn(icon)
              v-icon(color="grey") mdi-information

        v-list-item(v-if="!category.shots.length" :ripple="false")
          v-list-item-content
            v-list-item-title(class="gma-list-item__empty") ( no shots )

    v-dialog(v-model="showShotInfo")
      v-card(@click.stop="showShotInfo = false")
        v-card-title Details
        v-card-text
          div(class="gma-shot-details")
            div(class="gma-shot__title") Shot Type:
            div(class="gma-shot__content") {{ shotInfo.title }}
            div(class="gma-shot__title") Shot Category:
            div(class="gma-shot__content") {{ shotInfo.category }}
            div(Class="gma-shot__title") Description:
            div(class="gma-shot__content") {{ shotInfo.desc }}
            div(class="gma-shot__title") Result:
            div(class="gma-shot__content")
              ResultsChips(v-if="shotInfo.result.length" :isCloseable="false"
                  :data="shotInfo.result" :justify="'start'" :hasData="true")
              span(v-else) (no result recorded)

    ShotStatsSortDialog(v-if="showSortDialog" v-on:sort-stats-done="sortStats($event)")
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import bus from '@/event-bus';
import { resultsSummaryForShot } from '@/store/helpers/results';
import { MISTAKES, SHOTS_CATEGORIES_WITH_SUMMARY } from '@/store/mistake-defs/getter-types';
import { MistakeRecord, ShotCategoryWithSummary } from '@/store/mistake-defs/types.d';
import { namespace } from 'vuex-class';
import { UPDATE_ALL_SHOTS } from '@/store/mistake-defs/action-types';
import { HAS_UPDATED } from '@/store/rounds/getter-types';
import { SET_HAS_UPDATED } from '@/store/rounds/mutation-types';
import ResultsChips from '@/components/ResultsChips.vue';
import ShotStatsSortDialog from '@/components/ShotStatsSortDialog.vue';
import statsSorter from '@/store/helpers/stats-sorter';

const MistakeDefsModule = namespace('mistakeDefs');
const RoundsModule = namespace('rounds');

@Component({
  name: 'ShotStatsSummary',

  components: {
    ResultsChips,
    ShotStatsSortDialog,
  },
})
export default class StatsSummary extends Vue {
  @MistakeDefsModule.Getter(MISTAKES)
  mistakes!: Array<MistakeRecord>;

  @MistakeDefsModule.Getter(SHOTS_CATEGORIES_WITH_SUMMARY)
  categories!: Array<ShotCategoryWithSummary>;

  @MistakeDefsModule.Action(UPDATE_ALL_SHOTS)
  updateAllShots!: () => Promise<void>;

  @RoundsModule.Getter(HAS_UPDATED)
  hasUpdated!: boolean;

  @RoundsModule.Mutation(SET_HAS_UPDATED)
  setHasUpdated!: () => void;

  sortedCategories = [] as Array<ShotCategoryWithSummary>;

  showShotInfo = false;

  showSortDialog = false;

  sortCriteria = [] as Array<number>;

  shotInfo = {
    title: '',
    category: '',
    desc: '',
    result: {},
  };

  get dataToDisplay() {
    return this.sortedCategories;
  }

  set dataToDisplay(value) {
    this.sortedCategories = value;
  }

  categorySummaryStr(category: ShotCategoryWithSummary) {
    if (!category.totalShots) {
      return '-';
    }

    return `${category.totalMistakes} / ${category.totalShots} \xa0 (${category.average}%)`;
  }

  shotSummaryStr(shot: MistakeRecord) {
    const totalShots = shot.mistakeDetails.totalShots || 0;
    const totalMistakes = shot.mistakeDetails.totalMistakes || 0;
    const average = totalShots ? Math.round((totalMistakes / totalShots) * 100) : 0;

    if (!totalShots) {
      return '( no data yet )';
    }

    return `Shots: ${totalShots} \xa0\xa0 Mistakes: ${totalMistakes} \xa0\xa0 (${average}%)`;
  }

  resultsSummaryString(shot: MistakeRecord) {
    const resultsSummary = resultsSummaryForShot(shot);

    if (!resultsSummary.size) {
      return '( no result data yet )';
    }

    let summaryStr = '';

    resultsSummary.forEach((value: number, key: string) => {
      const capitalKey = key.charAt(0).toUpperCase() + key.slice(1);
      summaryStr += `${capitalKey}: ${value}% \xa0\xa0`;
    });

    return summaryStr;
  }

  getRiskClass(shot: MistakeRecord) {
    const totalShots = shot.mistakeDetails.totalShots || 0;
    const totalMistakes = shot.mistakeDetails.totalMistakes || 0;
    const average = totalShots ? Math.round((totalMistakes / totalShots) * 100) : 0;

    if (totalShots < 10) {
      return 'gma-no-risk';
    }

    if (average >= 60) {
      return 'gma-high-risk';
    }

    if (average <= 20) {
      return 'gma-low-risk';
    }

    return 'gma-medium-risk';
  }

  openInfoDialog(shot: MistakeRecord, category: string) {
    this.shotInfo = {
      title: shot.mistakeDef.title,
      desc: shot.mistakeDetails.desc,
      category,
      result: [...resultsSummaryForShot(shot).entries()].sort((a, b) => b[1] - a[1]),
    };

    this.showShotInfo = true;
  }

  onShowSortDialog() {
    this.showSortDialog = true;
  }

  sortStats(sortCriteria?: Array<number>) {
    this.showSortDialog = false;

    if (!sortCriteria) {
      return;
    }

    if (sortCriteria.length) {
      this.sortCriteria = sortCriteria;
      this.dataToDisplay = statsSorter([...this.categories], sortCriteria);
    } else {
      this.dataToDisplay = this.categories;
    }
  }

  mounted() {
    bus.$on('sort-shot-stats', this.onShowSortDialog);
    this.sortedCategories = this.categories;
  }

  destroyed() {
    bus.$off('sort-shot-stats', this.onShowSortDialog);
  }
}
</script>

<style lang="stylus" scoped>
</style>
