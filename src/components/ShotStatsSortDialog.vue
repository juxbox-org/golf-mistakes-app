<template lang="pug">
  v-dialog(v-model="active" persistent)
    v-card
      v-card-title Sort Shots Stats
      v-card-text
        v-container
          v-row
            v-col
              span Primary
              v-chip-group(v-model="primarySortCriteria" column active-class="chip-active")
                v-chip(v-for="criteria in sortCriteria" :key="criteria"
                    class="ma-1" filter small) {{ criteria }}
          v-row
            v-col
              span Secondary
              v-chip-group(v-model="secondarySortCriteria" column active-class="chip-active")
                v-chip(v-for="criteria in sortCriteria" :key="criteria"
                    class="ma-1" filter small) {{ criteria }}
      v-card-actions
        v-spacer
        v-btn(class="ma-2" text @click="onCancel") cancel
        v-btn(class="ma-2" text @click="onDone") done
</template>

<script lang="ts">
import _ from 'lodash';
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  name: 'ShotStatsSortDialog',
})
export default class ShotStatsSortDialog extends Vue {
  sortCriteria = ['# shots', '# mistakes', '% mistakes'];

  primarySortCriteria?: number = null;

  secondarySortCriteria?: number = null;

  active = true;

  onDone() {
    const sortCriteria = [];

    if (!_.isNil(this.primarySortCriteria)) {
      sortCriteria.push(this.primarySortCriteria);

      if (!_.isNil(this.secondarySortCriteria)) {
        sortCriteria.push(this.secondarySortCriteria);
      }
    }

    this.$emit('sort-stats-done', sortCriteria);
  }

  onCancel() {
    this.$emit('sort-stats-done');
  }
}
</script>

<style lang="stylus">
.chip-active
  background-color: #434cf7;
  color: white !important;
</style>>
