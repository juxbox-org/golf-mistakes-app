<template lang="pug">
  div
    v-btn(text @click="onBack" color="blue") < back
    v-row
      v-col
        span(class="ma-2") {{ categorySummary.course }} on {{ categorySummary.date }}
    v-data-table(:headers="categoryHeaders" :items="categoryStats" mobile-breakpoint="400"
        show-expand :single-expand="true" item-key="categoryName")
      template(v-slot:expanded-item="{ headers, item }")
        td(:colspan="headers.length")
          ResultsChips(v-if="item.results.size" :data="Array.from(item.results)"
              :hasData="true" :justify="'start'" :smallChips="true")
          div(v-else class="empty-results") ( no mistakes )
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { GET_CATEGORY_STATS_FOR_ROUND } from '@/store/rounds/getter-types';
import { CategorySummary } from '@/store/rounds/types.d';
import ResultsChips from '@/components/ResultsChips.vue';

const RoundsModule = namespace('rounds');

@Component({
  name: 'RoundStatsSummary',

  props: {
    roundId: Number,
  },

  components: {
    ResultsChips,
  },
})
export default class RoundStatsSummary extends Vue {
  @RoundsModule.Getter(GET_CATEGORY_STATS_FOR_ROUND)
  getCategorySummary!: (arg0: number) => CategorySummary;

  roundId!: number;

  categoryHeaders = [
    {
      text: 'Category',
      align: 'start',
      sortable: false,
      value: 'categoryName',
    },
    { text: 'Shots', value: 'totalShots' },
    { text: 'Mistakes', value: 'totalMistakes' },
    { text: 'Mistakes (%)', value: 'averageMistakes' },
    { text: '', value: 'data-table-expand' },
  ];

  get categorySummary() {
    return this.getCategorySummary(this.roundId);
  }

  get categoryStats() {
    return this.categorySummary.stats;
  }

  onBack() {
    this.$emit('done-round-summary');
  }
}
</script>

<style lang="stylus" scoped>
.empty-results
  display: flex;
  align-items: center;
  justify-content: center;
</style>
