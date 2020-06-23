<template lang="pug">
  v-dialog(v-model="isVisible" max-width="300")
    v-card(@click.stop="onClose()")
      v-card-title(class="headline") Shot {{ shotInfo.shotNo }}
      div(class="gma-shot-details")
        div(class="gma-shot__title") Type:
        div(class="gma-shot__content") {{ shotInfo.type }}
        div(class="gma-shot__title") Category:
        div(class="gma-shot__content") {{ shotInfo.category }}
        div(class="gma-shot__title") Description:
        div(class="gma-shot__content") {{ shotInfo.desc }}
        div(class="d-flex")
          span(class="gma-shot__title") Mistake:
          span(class="gma-shot__content-inline") {{ shotInfo.mistake }}
          span(class="gma-shot__title-inline") Penalty:
          span(class="gma-shot__content-inline") {{ shotInfo.penalty }}
        div(v-if="shotInfo.isMistake")
          div(class="gma-shot__title") Result:
          div(class="gma-shot__content")
            ResultsChips(v-if="shotInfo.result !== null" :isCloseable="false"
                :results="shotInfo.result" :justify="'start'")
            span(v-else) (no result recorded)
        div(class="d-flex")
          span(class="gma-shot__title") Club:
          span(class="gma-shot__content-inline") {{ clubName }}

</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import ResultsChips from '@/components/ResultsChips.vue';
import { ShotInfo } from '@/store/current-round/types.d';
import { namespace } from 'vuex-class';
import { SWING_NAMES } from '@/store/consts';
import { CLUBS } from '@/store/clubs/getter-types';
import { Club } from '@/store/clubs/types.d';

const ClubsModule = namespace('clubs');

@Component({
  name: 'ShotInfoDialog',

  props: {
    shotInfo: Object,
    visible: Boolean,
  },

  components: {
    ResultsChips,
  },
})
export default class ShotInfoDialog extends Vue {
  @ClubsModule.Getter(CLUBS)
  clubs!: Array<Club>;

  shotInfo!: ShotInfo;

  visible!: boolean;

  get isVisible() {
    return this.visible;
  }

  set isVisible(value) {
    if (!value) {
      this.$emit('close');
    }
  }

  get clubName() {
    const club = this.clubs.find((item) => item.id === this.shotInfo.club);

    if (!club) {
      throw Error(`shotInfoDialog: clubName: unable to find club with id: ${this.shotInfo.club}`);
    }

    return `\xa0${club.type}`;
  }

  onClose() {
    this.$emit('close-info');
  }
}
</script>>
