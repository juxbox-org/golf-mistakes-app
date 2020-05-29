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
import { Action, Mutation } from 'vuex-class';
import { UPDATE_VIEW } from '@/store/index';
import Component from 'vue-class-component';
import { CREATE_MISTAKE } from '@/store/mistake-types/action-types';
import { CreateMistakeAction } from '@/store/mistake-types/types.d';

@Component
export default class EditMistake extends Vue {
  @Action(CREATE_MISTAKE) createMistake!: CreateMistakeAction;

  @Mutation(UPDATE_VIEW) updateView!: (arg0: object) => void;

  name = 'EditMistake';

  title = '';

  desc = '';

  onSave() {
    if (this.title.length && this.desc.length) {
      this.createMistake({ title: this.title, desc: this.desc })
        .then(() => {
          this.$emit('done-edit');
          this.updateView({ type: 'summary', view: 'edit_mistake' });
        });
    }
  }

  onCancel() {
    this.$emit('done-edit');
  }

  destroyed() {
    this.updateView({ type: 'summary', view: '' });
  }

  mounted() {
    this.updateView({ type: 'summary', view: 'edit_mistake' });
  }
}
</script>
