<template lang='pug'>
  v-app-bar(app color="primary" dark)
    v-toolbar-title {{ title }}
    v-spacer
    SaveRoundButtonGroup(v-show="isTrackingStarted")
    EditShotsButtonGroup(v-show="isSummary")
    EditRoundsButtonGroup(v-show="isReviewing")
    template(v-if="isTrackingStarted" v-slot:extension)
      HoleNavigationBar
    template(v-else-if="isReviewing" v-slot:extension)
      ReviewNavigationBar
    template(v-else-if="isSummary" v-slot:extension)
      CreateEditNavigationBar
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { mapState } from 'vuex';
import { Route } from '@/store/route';
import HoleNavigationBar from '@/components/HoleNavigationBar.vue';
import SaveRoundButtonGroup from '@/components/SaveRoundButtonGroup.vue';
import EditShotsButtonGroup from '@/components/EditShotsButtonGroup.vue';
import ReviewNavigationBar from '@/components/ReviewNavigationBar.vue';
import EditRoundsButtonGroup from '@/components/EditRoundsButtonGroup.vue';
import CreateEditNavigationBar from '@/components/CreateEditNavigationBar.vue';

@Component({
  name: 'AppBar',
  components: {
    HoleNavigationBar,
    SaveRoundButtonGroup,
    EditShotsButtonGroup,
    ReviewNavigationBar,
    EditRoundsButtonGroup,
    CreateEditNavigationBar,
  },
  computed: {
    ...mapState('route', {
      isTrackingNotStarted: (state) => (state as Route).path === '/track',
      isTrackingStarted: (state) => (state as Route).path.substr(0, 11) === '/track/hole',
      isReviewing: (state) => (state as Route).path === '/review',
      isSummary: (state) => (state as Route).path === '/summary',
    }),
  },
})
export default class AppBar extends Vue {
  isTrackingStarted!: boolean;

  isTrackingNotStarted!: boolean;

  isReviewing!: boolean;

  isSummary!: boolean;

  get title(): string {
    if (this.isTrackingStarted || this.isTrackingNotStarted) {
      return 'Current Round';
    }

    if (this.isReviewing) {
      return 'Review Rounds';
    }

    if (this.isSummary) {
      return 'Edit';
    }

    return '(Unknown)';
  }
}
</script>

<style lang="stylus" scoped>
</style>
