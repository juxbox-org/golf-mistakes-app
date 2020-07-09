<template lang="pug">
  v-tab-item(value="ShotStats" :transition="false" :reverse-transition="false")
    v-switch(v-model="showByCategory" label="view by category" class="ma-1" color="blue darken-2"
        :ripple="false")
    v-list(class="gma-mistake-list")
      v-list-group(v-if="showByCategory" v-for="category in sortedCategories" :key="category.name"
          :ripple="false")
        template(v-slot:activator)
          v-list-item-content
            v-list-item-title {{ category.name }}
          v-list-item-action
            div {{ categorySummaryStr(category) }}

        ShotSummaryList(:data="category.shots" v-on:click="openInfoDialog($event)"
            :categoryName="category.name")

      ShotSummaryList(v-if="!showByCategory" :data="sortedShots"
          v-on:click="openInfoDialog($event)")

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
import { sortByCategory, sortByShot } from '@/store/helpers/stats-sorter';
import ShotSummaryList from '@/components/ShotSummaryList.vue';

const MistakeDefsModule = namespace('mistakeDefs');
const RoundsModule = namespace('rounds');

interface ShotData {
  shot: MistakeRecord;
  categoryName: string;
}

@Component({
  name: 'ShotStatsSummary',

  components: {
    ResultsChips,
    ShotStatsSortDialog,
    ShotSummaryList,
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

  sortedShots = [] as Array<MistakeRecord>;

  showShotInfo = false;

  showSortDialog = false;

  sortCriteria = [] as Array<number>;

  showByCategory = true;

  shotInfo = {
    title: '',
    category: '',
    desc: '',
    result: {},
  };

  get shots() {
    const shots = [] as Array<MistakeRecord>;

    this.categories.forEach((category) => {
      category.shots.forEach((shot) => {
        const shotData = { ...shot, categoryName: category.name };
        shots.push(shotData);
      });
    });

    return shots;
  }

  openInfoDialog(shotData: ShotData) {
    this.shotInfo = {
      title: shotData.shot.mistakeDef.title,
      desc: shotData.shot.mistakeDetails.desc,
      category: shotData.categoryName,
      result: [...resultsSummaryForShot(shotData.shot).entries()].sort((a, b) => b[1] - a[1]),
    };

    this.showShotInfo = true;
  }

  onShowSortDialog() {
    this.showSortDialog = true;
  }

  categorySummaryStr(category: ShotCategoryWithSummary) {
    if (!category.totalShots) {
      return '-';
    }

    return `${category.totalMistakes} / ${category.totalShots} \xa0 (${category.average}%)`;
  }


  sortStats(sortCriteria?: Array<number>) {
    this.showSortDialog = false;

    if (!sortCriteria) {
      return;
    }

    if (sortCriteria.length) {
      this.sortCriteria = sortCriteria;
      if (this.showByCategory) {
        this.sortedCategories = sortByCategory([...this.categories], sortCriteria);
      } else {
        this.sortedShots = sortByShot(this.shots, sortCriteria);
      }
    }
  }

  mounted() {
    bus.$on('sort-shot-stats', this.onShowSortDialog);
    this.sortedCategories = this.categories;
    this.sortedShots = this.shots;
  }

  destroyed() {
    bus.$off('sort-shot-stats', this.onShowSortDialog);
  }
}
</script>

<style lang="stylus" scoped>
</style>
