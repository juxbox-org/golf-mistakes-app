<template lang="pug">
  div
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ViewRounds',

  data() {
    return {
      platformId: '' as string,
    };
  },

  methods: {
    onClick(): void {
      this.platformId = this.$cordova.platformId;
    },
  },
});
</script>
