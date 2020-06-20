<template lang="pug">
  v-flex
    v-radio-group(v-show="!isExistingShot" row v-model="type")
      v-radio(label="Shot" value="shot")
      v-radio(label="Category" value="category")

    v-form(ref="shotsForm")
      div(v-show="type === 'shot'")
        v-text-field(label="Shot type" name="title" v-model="shotTitle") {{ shotTitle }}
        v-select(:items="categoryNames" label="Shot category" v-model="shotCategory"
            no-data-text="(no categories)")
        v-textarea(filled label="Describe what a mistake is for this shot type" name="desc"
          v-model="shotDesc") {{ shotDesc }}
      div(v-show="type === 'category'")
        v-text-field(label="Shot category" name="category"
            v-model="categoryName") {{ categoryName }}
      v-btn(class="ma-2" dark @click="onSave") Save
      v-btn(v-show="isExistingShot" class="ma-2" outlined @click="onDelete") Delete
      v-btn(class="ma-2" outlined @click="onCancel") Cancel
</template>

<script lang="ts">
/* eslint-disable operator-linebreak */
import Vue from 'vue';
import { namespace } from 'vuex-class';
import Component from 'vue-class-component';
import {
  CREATE_MISTAKE,
  CREATE_CATEGORY,
  SAVE_MISTAKE,
  DELETE_MISTAKE,
} from '@/store/mistake-defs/action-types';
import { CATEGORIES, MISTAKES } from '@/store/mistake-defs/getter-types';
import {
  CreateMistakeAction,
  CreateCategoryAction,
  ShotCategory,
  MistakeDef,
  DeleteMistakeAction,
} from '@/store/mistake-defs/types.d';

const DONE_EVENT = 'done-edit';

const MistakeDefsModule = namespace('mistakeDefs');

@Component({
  name: 'EditShot',

  props: {
    shotId: Number,
    categoryId: Number,
  },
})
export default class EditShot extends Vue {
  @MistakeDefsModule.Action(CREATE_MISTAKE)
  createMistake!: CreateMistakeAction;

  @MistakeDefsModule.Action(SAVE_MISTAKE)
  saveMistake!: CreateMistakeAction;

  @MistakeDefsModule.Action(CREATE_CATEGORY)
  createCategory!: CreateCategoryAction;

  @MistakeDefsModule.Action(DELETE_MISTAKE)
  deleteMistake!: DeleteMistakeAction;

  @MistakeDefsModule.Getter(CATEGORIES)
  categories!: Array<ShotCategory>;

  @MistakeDefsModule.Getter(MISTAKES)
  mistakes!: Array<MistakeDef>;

  shotId!: number;

  categoryId!: number;

  shotTitle = '';

  shotDesc = '';

  shotCategory = '';

  categoryName = '';

  type = 'shot';

  get categoryNames() {
    return this.categories.map((category) => category.name);
  }

  get isExistingShot() {
    return this.shotId || this.shotId === 0;
  }

  get hasExistingCategory() {
    return this.categoryId || this.categoryId === 0;
  }

  onSave() {
    if (this.type === 'shot' && this.shotTitle.length && this.shotDesc.length
       && this.shotCategory.length) {
      const mistakeData: MistakeDef = { title: this.shotTitle, desc: this.shotDesc };

      const categoryObj =
        this.categories.find((category) => category.name === this.shotCategory);

      if (!categoryObj) {
        throw Error(`Category for category name, ${this.shotCategory}, doesn't exist`);
      }

      mistakeData.categoryId = categoryObj.id;

      if (this.isExistingShot) {
        mistakeData.id = this.shotId;
        this.saveMistake(mistakeData)
          .then(() => {
            this.$emit(DONE_EVENT);
          });
      } else {
        this.createMistake(mistakeData)
          .then(() => {
            this.$emit(DONE_EVENT, categoryObj.id);
          });
      }
    } else if (this.type === 'category' && this.categoryName.length) {
      this.createCategory(this.categoryName)
        .then(() => {
          this.$emit(DONE_EVENT);
        });
    }
  }

  onDelete() {
    if (this.isExistingShot) {
      this.deleteMistake(this.shotId);
      this.$emit(DONE_EVENT);
    } else {
      throw Error('Trying to delete a shot that hasn\'t been created yet');
    }
  }

  onCancel() {
    this.$emit(DONE_EVENT);
  }

  mounted() {
    if (this.isExistingShot) {
      const shot = this.mistakes.find((item) => item.id === this.shotId);
      if (!shot) {
        throw Error(`Shot for ID, ${this.shotId}, doesn't exist`);
      }

      const category = this.categories.find((item) => item.id === shot.categoryId);
      if (!category) {
        throw Error(`Category for categoryId, ${category.id}, doesn't exist`);
      }

      this.shotTitle = shot.title;
      this.shotDesc = shot.desc;
      this.shotCategory = category.name;
    } else if (this.hasExistingCategory) {
      const category = this.categories.find((item) => item.id === this.categoryId);
      if (!category) {
        throw Error(`Category for categoryId, ${category.id}, doesn't exist`);
      }

      this.shotCategory = category.name;
    }
  }
}
</script>

<style lang="stylus" scoped>
.form-content {
  width: 100%;
}
</style>
