<template lang="pug">
  v-btn(icon fab small :ripple="false" @click="editRounds"
      v-bind:class="[{'gma-app-bar-btn--active': isEditing}, 'edit-btn']")
    v-icon mdi-pencil
</template>

<script lang="ts">
import Vue from 'vue';
import bus from '@/event-bus';
import Component from 'vue-class-component';

@Component({
  name: 'EditRoundsButtonGroup',
})
export default class EditRoundsButtonGroup extends Vue {
  isEditing = false;

  /* eslint-disable class-methods-use-this */
  editRounds() {
    this.isEditing = !this.isEditing;
    bus.$emit('edit-rounds');
  }
  /* eslint-enable class-methods-use-this */
}
</script>

<style lang="stylus" scoped>
.edit-btn
  margin-right: 0 !important;
</style>
