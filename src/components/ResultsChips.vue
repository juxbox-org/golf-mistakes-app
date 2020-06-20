<template lang="pug">
  v-row(justify="center" align="center" class="chip-results")
    v-chip(v-for="type in resultTypes" :key="type" v-show="results[type]"
        :close="isCloseable" class="ma-2" @click:close="onClose(type)") {{ type }}
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
  },
})
export default class ResultsChips extends Vue {
  results!: Map<string, boolean>;

  isCloseable!: boolean;

  resultTypes = [...RESULTS_MAP.keys()];

  onClose(type: string) {
    this.$emit('chip-closed', type);
  }
}
</script>
