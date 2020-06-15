<template lang="pug">
  v-btn(icon fab small :ripple="false" @click="editShots"
      v-bind:class="[{'gma-app-bar-btn--active': isEditing}, 'edit-btn']")
    v-icon mdi-pencil
</template>

<script lang="ts">
import Vue from 'vue';
import bus from '@/event-bus';
import Component from 'vue-class-component';

@Component({
  name: 'EditShotsButtonGroup',
})
export default class EditShotsButtonGroup extends Vue {
  isEditing = false;

  /* eslint-disable class-methods-use-this */
  editShots() {
    this.isEditing = !this.isEditing;
    bus.$emit('edit-shots');
  }
  /* eslint-enable class-methods-use-this */
}
</script>

<style lang="stylus" scoped>
.edit-btn
  margin-right: 0 !important;
</style>
