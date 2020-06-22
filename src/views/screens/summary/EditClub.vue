<template lang="pug">
  v-row
    v-col
      v-form(ref="clubsForm")
        v-text-field(label="Club type" name="type" v-model="clubType") {{ clubType }}
        v-text-field(label="Brand (optional)" name="brand" v-model="brandName") {{ brandName }}
        v-btn(class="ma-2" dark @click="onSave") Save
        v-btn(v-show="isExistingClub" class="ma-2" outlined @click="onDelete") Delete
        v-btn(class="ma-2" outlined @click="onCancel") Cancel
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { ADD_CLUB } from '@/store/clubs/action-types';
import { Club } from '@/store/clubs/types.d';

const ClubsModule = namespace('clubs');

@Component({
  name: 'EditClub',
})
export default class EditClub extends Vue {
  @ClubsModule.Action(ADD_CLUB)
  addClub!: (arg0: Club) => Promise<void>;

  isExistingClub = false;

  clubType = '';

  brandName = '';

  onSave() {
    this.addClub({ type: this.clubType, brand: this.brandName })
      .then(() => {
        this.$emit('done-add');
      });
  }

  onCancel() {
    this.$emit('done-add');
  }

  onDelete() {
    this.$emit('done-add');
  }
}
</script>
