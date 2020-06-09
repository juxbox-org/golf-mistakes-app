<template lang="pug">
  v-btn(icon class="ma-2" @click="editShots")
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
  /* eslint-disable class-methods-use-this */
  editShots() {
    bus.$emit('edit-shots');
  }
  /* eslint-enable class-methods-use-this */
}
</script>>
