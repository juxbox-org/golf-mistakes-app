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

@Compontent({
  name: 'AppBar',
})
export default class BottomNavigation extends Vue {
  navigateTo(to: string): void {
    this.$router.push(`/${to}`).catch(() => null);
  }
}
</script>
