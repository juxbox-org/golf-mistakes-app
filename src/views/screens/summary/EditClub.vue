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
import { ADD_CLUB, SAVE_CLUB, DELETE_CLUB } from '@/store/clubs/action-types';
import { Club } from '@/store/clubs/types.d';
import { CLUBS } from '@/store/clubs/getter-types';

const ClubsModule = namespace('clubs');

@Component({
  name: 'EditClub',

  props: {
    clubId: Number,
  },
})
export default class EditClub extends Vue {
  @ClubsModule.Getter(CLUBS)
  clubs!: Array<Club>;

  @ClubsModule.Action(ADD_CLUB)
  addClub!: (arg0: Club) => Promise<void>;

  @ClubsModule.Action(SAVE_CLUB)
  saveClub!: (arg0: Club) => Promise<void>;

  @ClubsModule.Action(DELETE_CLUB)
  deleteClub!: (arg0: number) => Promise<void>;

  clubId!: number;

  isExistingClub = false;

  clubType = '';

  brandName = '';

  onSave() {
    if (this.isExistingClub) {
      this.saveClub({
        id: this.clubId,
        type: this.clubType,
        brand: this.brandName,
        active: true,
      }).then(() => {
        this.$emit('done-edit');
      });
    } else {
      this.addClub({
        type: this.clubType,
        brand: this.brandName,
        active: true,
      }).then(() => {
        this.$emit('done-edit');
      });
    }
  }

  onCancel() {
    this.$emit('done-edit');
  }

  onDelete() {
    this.deleteClub(this.clubId)
      .then(() => {
        this.$emit('done-edit');
      });
  }

  mounted() {
    if (this.clubId) {
      const club = this.clubs.find((item) => item.id === this.clubId);

      if (!club) {
        throw Error(`EditClub:mounted: unable to find club with ID: ${this.clubId}`);
      }

      this.clubType = club.type;
      this.brandName = club.brand;

      this.isExistingClub = true;
    }
  }
}
</script>
