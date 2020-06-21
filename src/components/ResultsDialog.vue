<template lang="pug">
  v-dialog(v-model="showResultsDialog" persistent)
    v-card
      v-card-title(class="headline") Mistake Result
      v-card-text
        v-container
          v-row(justify="center" align="center")
            v-card(class="ma-3" elevation="0" @click.stop="onSelect('hook')" :ripple="false")
              v-icon(v-if="results.hook" class="offset-top-icon icon-y-flip"
                  :ripple="false") mdi-share
              v-icon(v-else class="offset-top-icon icon-y-flip" :ripple="false") mdi-share-outline
            v-card(class="ma-3" elevation="0" @click.stop="onSelect('long')" :ripple="false")
              v-icon(v-if="results.long" class="result-icon top-icon") mdi-arrow-up-bold
              v-icon(v-else class="result-icon top-icon") mdi-arrow-up-bold-outline
            v-card(class="ma-3" elevation="0" @click.stop="onSelect('slice')" :ripple="false")
              v-icon(v-if="results.slice" class="offset-top-icon") mdi-share
              v-icon(v-else class="offset-top-icon") mdi-share-outline
          v-row(justify="center" align="center")
            v-card(class="ma-3" elevation="0" @click.stop="onSelect('left')" :ripple="false")
              v-icon(v-if="results.left" class="result-icon") mdi-arrow-left-bold
              v-icon(v-else class="result-icon") mdi-arrow-left-bold-outline
            v-card(class="ma-3" elevation="0")
              div(@click.stop="onSelect('thin')")
                v-btn(v-if="results.thin" class="result-btn result-btn--selected"
                    elevation="0") thin
                v-btn(v-else class="result-btn" outlined) thin
              div(style="margin-top: 5px;" @click.stop="onSelect('top')")
                v-btn(v-if="results.top" class="result-btn result-btn--selected" elevation="0") top
                v-btn(v-else class="result-btn" outlined) top
              div(style="margin-top: 5px;" @click.stop="onSelect('fat')")
                v-btn(v-if="results.fat" class="result-btn result-btn--selected" elevation="0") fat
                v-btn(v-else class="result-btn" outlined) fat
            v-card(class="ma-3" elevation="0" @click.stop="onSelect('right')" :ripple="false")
              v-icon(v-if="results.right" class="result-icon") mdi-arrow-right-bold
              v-icon(v-else class="result-icon") mdi-arrow-right-bold-outline
          v-row(justify="center" align="center")
            v-card(class="ma-3" elevation="0")
              div(class="icon-spacer")
            v-card(class="ma-3" elevation="0" @click.stop="onSelect('short')" :ripple="false")
              v-icon(v-if="results.short" class="result-icon bottom-icon") mdi-arrow-down-bold
              v-icon(v-else class="result-icon bottom-icon") mdi-arrow-down-bold-outline
            v-card(class="ma-3" elevation="0" @click.stop="onSelect('shank')" :ripple="false")
              v-icon(v-if="results.shank" class="offset-bottom-icon icon-x-flip") mdi-share
              v-icon(v-else class="offset-bottom-icon icon-x-flip") mdi-share-outline

          ResultsChips(:results="results" :isCloseable="true" :justify="'center'"
              v-on:chip-closed="onChipClosed($event)")

        v-card-actions
          v-spacer
          v-btn(class="ma-2" text @click="onSkip") skip
          v-btn(class="ma-2" text @click="onDone") done
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { RESULTS_MAP } from '@/store/consts';
import ResultsChips from '@/components/ResultsChips.vue';

interface IndexableResults {
  [key: string]: boolean;
}

@Component({
  name: 'ResultsDialog',

  props: {
    shotId: Number,
    showResultsDialog: Boolean,
  },

  components: {
    ResultsChips,
  },
})
export default class ResultsDialog extends Vue {
  shotId!: number;

  showResultsDialog!: boolean;

  results = {
    slice: false,
    hook: false,
    thin: false,
    fat: false,
    left: false,
    right: false,
    short: false,
    long: false,
    shank: false,
    top: false,
  };

  onSkip() {
    this.$emit('results-done', { shotId: this.shotId, result: null });
  }

  onDone() {
    let resultAccum = 0;

    RESULTS_MAP.forEach((value, key) => {
      if ((this.results as IndexableResults)[key]) {
        resultAccum += value;
      }
    });

    this.$emit('results-done', { shotId: this.shotId, result: resultAccum });
  }

  onChipClosed(type: string) {
    (this.results as IndexableResults)[type] = false;
  }

  onSelect(item: string) {
    switch (item) {
      case 'slice': {
        this.results.slice = !this.results.slice;

        if (this.results.slice) {
          this.results.hook = false;
          this.results.left = false;
          this.results.right = false;
          this.results.shank = false;
          this.results.top = false;
        }

        break;
      }

      case 'hook': {
        this.results.hook = !this.results.hook;

        if (this.results.hook) {
          this.results.slice = false;
          this.results.left = false;
          this.results.right = false;
          this.results.shank = false;
          this.results.top = false;
        }

        break;
      }

      case 'long': {
        this.results.long = !this.results.long;

        if (this.results.long) {
          this.results.short = false;
          this.results.shank = false;
          this.results.fat = false;
          this.results.top = false;
        }

        break;
      }

      case 'short': {
        this.results.short = !this.results.short;

        if (this.results.short) {
          this.results.long = false;
          this.results.shank = false;
        }

        break;
      }

      case 'left': {
        this.results.left = !this.results.left;

        if (this.results.left) {
          this.results.right = false;
          this.results.slice = false;
          this.results.hook = false;
          this.results.shank = false;
          this.results.top = false;
        }

        break;
      }

      case 'right': {
        this.results.right = !this.results.right;

        if (this.results.right) {
          this.results.left = false;
          this.results.slice = false;
          this.results.hook = false;
          this.results.shank = false;
          this.results.top = false;
        }

        break;
      }

      case 'thin': {
        this.results.thin = !this.results.thin;

        if (this.results.thin) {
          this.results.fat = false;
          this.results.shank = false;
          this.results.top = false;
        }

        break;
      }

      case 'fat': {
        this.results.fat = !this.results.fat;

        if (this.results.fat) {
          this.results.thin = false;
          this.results.shank = false;
          this.results.long = false;
          this.results.top = false;
        }

        break;
      }

      case 'shank': {
        this.results.shank = !this.results.shank;

        if (this.results.shank) {
          this.results.hook = false;
          this.results.slice = false;
          this.results.left = false;
          this.results.right = false;
          this.results.long = false;
          this.results.short = false;
          this.results.thin = false;
          this.results.fat = false;
          this.results.top = false;
        }

        break;
      }

      case 'top': {
        this.results.top = !this.results.top;

        if (this.results.top) {
          this.results.hook = false;
          this.results.slice = false;
          this.results.left = false;
          this.results.right = false;
          this.results.long = false;
          this.results.shank = false;
          this.results.thin = false;
          this.results.fat = false;
        }

        break;
      }

      default:
        break;
    }
  }
}
</script>

<style lang="stylus" scoped>
.result-icon
  font-size: 60px;

.offset-top-icon
  margin-bottom: -50px;
  margin-left: -20px;
  margin-right: -20px;
  font-size: 70px;
  height: 70px;

.offset-bottom-icon
  font-size: 70px;
  margin-left: -20px;
  margin-top: -70px;

.top-icon
  margin-bottom: -15px;

.bottom-icon
  margin-top: -30px;

.icon-y-flip
  transform: rotateY(180deg);

.icon-x-flip
  transform: rotateX(180deg);

.icon-spacer
  width: 50px;
  height: 70px;

.result-btn
  width: 50px;
  border-width: 3px;
  color: rgba(0, 0, 0, 0.54);

.result-btn--selected
  background-color: rgba(0, 0, 0, 0.54) !important;
  color: white;

.chip-results
  min-height: 48px;
</style>>
