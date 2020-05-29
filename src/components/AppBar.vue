<template lang='pug'>
  v-app-bar(app color="primary" dark)
    v-toolbar-title {{ title }}
    v-spacer
</template>

<script lang="ts">
import Vue from 'vue';
import SaveRoundButton from '@/components/SaveRoundButton.vue';
import { mapState } from 'vuex';
import { Route } from '@/store/route';

export default Vue.extend({
  name: 'AppBar',

  components: {
    SaveRoundButton,
  },

  computed: {
    ...mapState('route', {
      isTracking: (state) => (state as Route).path === '/track',
      isReviewing: (state) => (state as Route).path === '/review',
      isSummary: (state) => (state as Route).path === '/summary',
    }),

    title(): string {
      if (this.isTracking) {
        return 'Current Round';
      }

      if (this.isReviewing) {
        return 'Review Rounds';
      }

      if (this.isSummary) {
        return 'Mistakes';
      }

      return '(Unknown)';
    },
  },

});

</script>
