<template lang="pug">
  v-tab-item(value="ClubStats" :transition="false" :reverse-transition="false")
    v-list(class="gma-mistake-list")
      v-list-group(v-for="club in clubs" :key="club.id" :ripple="false")
        template(v-slot:activator)
          v-list-item-content
            v-list-item-title {{ club.type }}
          v-list-item-action
            div(v-if="dataForSwingType(club, 0)") {{ dataForSwingType(club, 0).average }} yds
        v-list-item(v-for="swing in club.swings" :key="swing.type")
          v-list-item-content
            v-list-item-title {{ swingName(swing.type) }}
            v-list-item-subtitle {{ swingSummaryString(swing) }}
        v-list-item(v-if="!club.swings.length")
          v-list-item-content
            v-list-item-title(class="gma-list-item__empty") (no swing data yet)

      v-list-item(v-if="!clubs.length" :ripple="false")
        v-list-item-content
          v-list-item-title(class="gma-list-item__empty") ( no clubs )
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { CLUBS } from '@/store/clubs/getter-types';
import { Club, Swing } from '@/store/clubs/types.d';
import { SWING_NAMES } from '@/store/consts';

const ClubsModule = namespace('clubs');

@Component({
  name: 'ClubStatsSummary',
})
export default class ClubStatsSummary extends Vue {
  @ClubsModule.Getter(CLUBS)
  clubs!: Array<Club>;

  swingSummaryString(swing: Swing) {
    if (!swing) return '';

    return `Average: ${swing.average} \xa0 Longest: ${swing.longest} \xa0 Shortest: ${swing.shortest}`
      + `\xa0 Shots: ${swing.shots}`;
  }

  swingName(swingType: number) {
    return SWING_NAMES[swingType];
  }

  dataForSwingType(club: Club, swingType: number) {
    if (!club.swings || !club.swings.length) {
      return null;
    }

    const swingData = club.swings.find((swing) => swing.type === swingType);

    if (swingData && !swingData.average) {
      return null;
    }

    return swingData;
  }
}
</script>
