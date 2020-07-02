<template lang="pug">
  div
    v-btn(text @click="onBack" color="blue") < back
    v-row
      v-col
        span(class="ma-2") {{ categorySummary.course }} on {{ categorySummary.date }}
    v-data-table(:headers="categoryHeaders" :items="categoryStats" mobile-breakpoint="400")
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { GET_CATEGORY_STATS_FOR_ROUND } from '@/store/rounds/getter-types';
import { CategorySummary } from '@/store/rounds/types.d';

const RoundsModule = namespace('rounds');

@Component({
  name: 'RoundStatsSummary',

  props: {
    roundId: Number,
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
    { text: 'Total Shots', value: 'totalShots' },
    { text: 'Total Mistakes', value: 'totalMistakes' },
    { text: 'Mistakes (%)', value: 'averageMistakes' },
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
