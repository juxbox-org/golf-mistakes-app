<template lang="pug">
  v-flex
    v-form(ref="startRound")
      v-text-field(label="Course" name="course" v-model="course") {{ course }}
      v-menu(offset-y transition="scale-transition" min-width="290")
        template(v-slot:activator="{ on }")
          v-text-field(label="Date", name="date", v-model="date" v-on="on" readonly)
        v-date-picker(no-title v-model="date" :min="nowDate" scrollable)
      v-btn(class="ma-2" dark @click="onCreate") Start
      v-btn(class="ma-2" outlined @click="onCancel") Cancel
</template>

<script lang="ts">
import Vue from 'vue';
import { Mutation, namespace } from 'vuex-class';
import { UPDATE_SCREEN } from '@/store/index';
import Component from 'vue-class-component';
import { CREATE_ROUND } from '@/store/rounds/action-types';
import { CreateRoundAction } from '@/store/rounds/types.d';

const TRACKING_VIEW = 'tracking';
const START_ROUND_SCREEN = 'start_round';
const CANCEL_EVENT = 'cancel-start';
const START_EVENT = 'start-round';

const RoundsModule = namespace('rounds');

@Component({
  name: 'StartRound',
})
export default class StartRound extends Vue {
  @RoundsModule.Action(CREATE_ROUND) createRound!: CreateRoundAction;

  @Mutation(UPDATE_SCREEN) updateScreen!: (arg0: object) => void;

  course = '';

  nowDate = new Date().toISOString().substr(0, 10);

  date = new Date().toISOString().substr(0, 10);

  onCreate() {
    if (this.course.length) {
      this.createRound({ course: this.course, date: this.date })
        .then(() => {
          this.$emit(START_EVENT);
          this.updateScreen({ type: TRACKING_VIEW, screen: START_ROUND_SCREEN });
        });
    }
  }

  onCancel() {
    this.$emit(CANCEL_EVENT);
  }

  destroyed() {
    this.updateScreen({ type: TRACKING_VIEW, screen: '' });
  }

  mounted() {
    this.updateScreen({ type: TRACKING_VIEW, view: START_ROUND_SCREEN });
  }
}
</script>
