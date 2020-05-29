<template lang="pug">
  v-layout
    div(v-show="!isEditing")
      v-fab-transition
        v-btn(dark absolute bottom right fab v-show="!hidden" @click="isEditing = true")
          v-icon mdi-plus
    EditMistake(v-if="isEditing" v-on:done-edit="isEditing = false")
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import EditMistake from '@/views/screens/summary/EditMistake.vue';

@Component({
  name: 'Summary',
  components: { EditMistake },
})
export default class Summary extends Vue {
  hidden = true;

  isEditing = false;

  mounted() {
    this.$nextTick(() => {
      // trigger the fab transition animation
      this.hidden = false;
    });
  }
}

</script>
