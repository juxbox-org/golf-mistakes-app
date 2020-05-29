<template lang="pug">
  v-flex
    v-form(ref="editMistake")
      v-text-field(label="Title" name="title" v-model="title") {{ title }}
      v-textarea(filled label="Description" name="desc" v-model="desc") {{ desc }}
      v-btn(class="ma-2" dark @click="onSave") Save
      v-btn(class="ma-2" outlined @click="onCancel") Cancel
</template>

<script lang="ts">
import Vue from 'vue';
import { Mutation, namespace } from 'vuex-class';
import { UPDATE_SCREEN } from '@/store/index';
import Component from 'vue-class-component';
import { CREATE_MISTAKE } from '@/store/mistake-defs/action-types';
import { CreateMistakeAction } from '@/store/mistake-defs/types.d';

const SUMMARY_VIEW = 'summary';
const EDIT_MISTAKE_SCREEN = 'edit_mistake';
const DONE_EVENT = 'done-edit';

const MistakeTypesModule = namespace('mistakeDefs');

@Component({
  name: 'EditMistake',
})
export default class EditMistake extends Vue {
  @MistakeTypesModule.Action(CREATE_MISTAKE) createMistake!: CreateMistakeAction;

  @Mutation(UPDATE_SCREEN) updateScreen!: (arg0: object) => void;

  title = '';

  desc = '';

  onSave() {
    if (this.title.length && this.desc.length) {
      this.createMistake({ title: this.title, desc: this.desc })
        .then(() => {
          this.$emit(DONE_EVENT);
          this.updateScreen({ type: SUMMARY_VIEW, screen: EDIT_MISTAKE_SCREEN });
        });
    }
  }

  onCancel() {
    this.$emit(DONE_EVENT);
  }

  destroyed() {
    this.updateScreen({ type: SUMMARY_VIEW, screen: '' });
  }

  mounted() {
    this.updateScreen({ type: SUMMARY_VIEW, screen: EDIT_MISTAKE_SCREEN });
  }
}
</script>
