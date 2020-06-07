<template lang="pug">
  v-app
    AppBar
    v-content(class="gma-content")
      v-container(class="gma-container" fluid fill-height)
        keep-alive
          router-view
    BottomNavigation
</template>

<script lang="ts">
import Vue from 'vue';
import AppBar from '@/components/AppBar.vue';
import BottomNavigation from '@/components/BottomNavigation.vue';

export default Vue.extend({
  name: 'App',

  components: {
    AppBar,
    BottomNavigation,
  },
});
</script>
