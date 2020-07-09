<template lang="pug">
  v-row(:justify="justify" align="center" class="chip-results")
    div(v-if="hasData")
      v-chip(v-for="result in data" :key="result[0]"
        class="ma-1" color="red" dark :small="smallChips") {{ getResultStr(result) }}
    div(v-else)
      v-chip(v-for="type in resultTypes" :key="type" v-show="results[type]"
          :close="isCloseable" class="ma-1" @click:close="onClose(type)"
          color="red" dark) {{ type }}
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { RESULTS_MAP } from '@/store/consts';

@Component({
  name: 'ResultsChips',

  props: {
    isCloseable: Boolean,
    results: Object,
    data: Array,
    justify: String,
    hasData: Boolean,
    smallChips: Boolean,
  },
})
export default class ResultsChips extends Vue {
  hasData!: boolean;

  results!: Map<string, boolean | number>;

  isCloseable!: boolean;

  data!: Array<Iterator<number>>;

  justify!: string;

  smallChips!: boolean;

  resultTypes = [...RESULTS_MAP.keys()];

  getResultStr(result: Array<Iterator<number>>) {
    return `${result[0]} \xa0\xa0${result[1]}%`;
  }

  onClose(type: string) {
    this.$emit('chip-closed', type);
  }
}
</script>
