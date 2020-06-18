<template lang="pug">
  v-card
    v-card-title(class="headline") Mistake Result
    v-card-text
      v-container
        v-row(justify="center" align="center")
          v-card(class="ma-3" elevation="0" @click.stop="onSelect('hook')" :ripple="false")
            v-icon(v-if="hook" class="offset-top-icon icon-y-flip" :ripple="false") mdi-share
            v-icon(v-else class="offset-top-icon icon-y-flip" :ripple="false") mdi-share-outline
          v-card(class="ma-3" elevation="0" @click.stop="onSelect('long')" :ripple="false")
            v-icon(v-if="long" class="result-icon") mdi-arrow-up-bold
            v-icon(v-else class="result-icon") mdi-arrow-up-bold-outline
          v-card(class="ma-3" elevation="0" @click.stop="onSelect('slice')" :ripple="false")
            v-icon(v-if="slice" class="offset-top-icon") mdi-share
            v-icon(v-else class="offset-top-icon") mdi-share-outline
        v-row(justify="center" align="center")
          v-card(class="ma-3" elevation="0" @click.stop="onSelect('left')" :ripple="false")
            v-icon(v-if="left" class="result-icon") mdi-arrow-left-bold
            v-icon(v-else class="result-icon") mdi-arrow-left-bold-outline
          v-card(class="ma-3" elevation="0")
            div(@click.stop="onSelect('thin')")
              v-btn(v-if="thin" class="result-btn result-btn--selected" elevation="0") thin
              v-btn(v-else class="result-btn" outlined) thin
            div(style="margin-top: 10px;" @click.stop="onSelect('fat')")
              v-btn(v-if="fat" class="result-btn result-btn--selected" elevation="0") fat
              v-btn(v-else class="result-btn" outlined) fat
          v-card(class="ma-3" elevation="0" @click.stop="onSelect('right')" :ripple="false")
            v-icon(v-if="right" class="result-icon") mdi-arrow-right-bold
            v-icon(v-else class="result-icon") mdi-arrow-right-bold-outline
        v-row(justify="center" align="center")
          v-card(class="ma-3" elevation="0")
            div(class="icon-spacer")
          v-card(class="ma-3" elevation="0" @click.stop="onSelect('short')" :ripple="false")
            v-icon(v-if="short" class="result-icon") mdi-arrow-down-bold
            v-icon(v-else class="result-icon") mdi-arrow-down-bold-outline
          v-card(class="ma-3" elevation="0" @click.stop="onSelect('shank')" :ripple="false")
            v-icon(v-if="shank" class="offset-bottom-icon icon-x-flip") mdi-share
            v-icon(v-else class="offset-bottom-icon icon-x-flip") mdi-share-outline
        v-row(justify="center" align="center" class="chip-results")
          v-chip(v-show="slice" class="ma-2") slice
          v-chip(v-show="hook" class="ma-2") hook
          v-chip(v-show="thin" class="ma-2") thin
          v-chip(v-show="fat" class="ma-2") fat
          v-chip(v-show="left" class="ma-2") left
          v-chip(v-show="right" class="ma-2") right
          v-chip(v-show="short" class="ma-2") short
          v-chip(v-show="long" class="ma-2") long
          v-chip(v-show="shank" class="ma-2") shank
    v-card-actions
        v-spacer
        v-btn(class="ma-2" text @click="onSkip") skip
        v-btn(class="ma-2" text @click="onDone") done
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  name: 'ResultsDialog',

  props: {
    shotId: Number,
  },
})
export default class ResultsDialog extends Vue {
  slice = false;

  hook = false;

  thin = false;

  fat = false;

  left = false;

  right = false;

  short = false;

  long = false;

  shank = false;

  onSkip() {
    this.$emit('results-done');
  }

  onDone() {
    this.$emit('results-done');
  }

  onSelect(item: string) {
    switch (item) {
      case 'slice': {
        this.slice = !this.slice;

        if (this.slice) {
          this.hook = false;
          this.left = false;
          this.right = false;
          this.shank = false;
        }

        break;
      }

      case 'hook': {
        this.hook = !this.hook;

        if (this.hook) {
          this.slice = false;
          this.left = false;
          this.right = false;
          this.shank = false;
        }

        break;
      }

      case 'long': {
        this.long = !this.long;

        if (this.long) {
          this.short = false;
          this.shank = false;
          this.fat = false;
        }

        break;
      }

      case 'short': {
        this.short = !this.short;

        if (this.short) {
          this.long = false;
          this.shank = false;
        }

        break;
      }

      case 'left': {
        this.left = !this.left;

        if (this.left) {
          this.right = false;
          this.slice = false;
          this.hook = false;
          this.shank = false;
        }

        break;
      }

      case 'right': {
        this.right = !this.right;

        if (this.right) {
          this.left = false;
          this.slice = false;
          this.hook = false;
          this.shank = false;
        }

        break;
      }

      case 'thin': {
        this.thin = !this.thin;

        if (this.thin) {
          this.fat = false;
          this.shank = false;
        }

        break;
      }

      case 'fat': {
        this.fat = !this.fat;

        if (this.fat) {
          this.thin = false;
          this.shank = false;
          this.long = false;
        }

        break;
      }

      case 'shank': {
        this.shank = !this.shank;

        if (this.shank) {
          this.hook = false;
          this.slice = false;
          this.left = false;
          this.right = false;
          this.long = false;
          this.short = false;
          this.thin = false;
          this.fat = false;
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

.offset-bottom-icon
  font-size: 70px;
  margin-left: -20px;
  margin-top: -50px;

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
