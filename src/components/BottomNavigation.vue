<template lang='pug'>
  v-bottom-navigation(grow color="primary" dark fixed)
    v-btn(@click="navigateTo('track')")
      v-icon mdi-golf
    v-btn(@click="navigateTo('review')")
      v-icon mdi-finance
    v-btn(@click="navigateTo('summary')")
      v-icon mdi-pencil-outline
</template>

<script lang="ts">
import Vue from 'vue';
import Compontent from 'vue-class-component';
import { Mutation } from 'vuex-class';
import { UPDATE_SCREEN } from '@/store/index';

@Compontent({
  name: 'AppBar',
})
export default class BottomNavigation extends Vue {
  @Mutation(UPDATE_SCREEN) updateScreen!: (screen: string) => void;

  navigateTo(to: string): void {
    this.updateScreen(to);
    this.$router.push(`/${to}`).catch(() => null);
  }
}

</script>
