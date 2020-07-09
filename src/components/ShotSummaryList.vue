<template lang="pug">
  #shotSummaryList
    v-list-item(v-for="shot in data" :key="shot.id"
        :ripple="false" color="secondary" @click.stop="onClick(shot)"
        v-bind:class="getRiskClass(shot)" inactive)
      v-list-item-content
        v-list-item-title {{ shot.mistakeDef.title }}
        v-list-item-subtitle(v-if="!categoryName") {{ shot.categoryName }}
        v-list-item-subtitle {{ shotSummaryStr(shot) }}
        v-list-item-subtitle {{ resultsSummaryString(shot) }}
      v-list-item-action
        v-btn(icon)
          v-icon(color="grey") mdi-information

    v-list-item(v-if="!data.length" :ripple="false")
      v-list-item-content
        v-list-item-title(class="gma-list-item__empty") ( no shots )
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { resultsSummaryForShot } from '@/store/helpers/results';
import { MistakeRecord } from '@/store/mistake-defs/types.d';

@Component({
  name: 'ShotSummaryList',

  props: {
    data: Array,
    categoryName: String,
  },
})
export default class ShotSummaryList extends Vue {
  data!: Array<MistakeRecord>;

  categoryName!: string;

  onClick(shot: MistakeRecord) {
    const shotData = {
      shot,
      categoryName: this.categoryName || shot.categoryName,
    };

    this.$emit('click', shotData);
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
}
</script>
