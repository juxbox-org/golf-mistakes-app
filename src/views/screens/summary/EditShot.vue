<template lang="pug">
  v-row
    v-col
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
          div(v-if="isExistingShot" class="textarea-select")
            v-checkbox(v-model="updateDesc" label="save as a new description" color="blue darken-2"
               :ripple="false")
          v-switch(v-model="recordSwing" class="ma-2" label="record swing on each shot"
              color="blue darken-2" :ripple="false")
        div(v-show="type === 'category'")
          v-text-field(label="Shot category" name="category"
              v-model="categoryName") {{ categoryName }}
        v-btn(class="ma-2" dark @click="onSave") Save
        v-btn(v-show="isExistingShot" class="ma-2" outlined @click="onDelete") Delete
        v-btn(class="ma-2" outlined @click="onCancel") Cancel
</template>

<script lang="ts">
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
  MistakeDetails,
  MistakeRecord,
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
  mistakes!: Array<MistakeRecord>;

  shotId!: number;

  categoryId!: number;

  shotTitle = '';

  shotDesc = '';

  shotCategory = '';

  categoryName = '';

  recordSwing = false;

  type = 'shot';

  date?: Date = null;

  updateDesc = false;

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
      const mistakeDef: MistakeDef = { title: this.shotTitle };

      const categoryObj =
        this.categories.find((category) => category.name === this.shotCategory);

      if (!categoryObj) {
        throw Error(`Category for category name, ${this.shotCategory}, doesn't exist`);
      }

      mistakeDef.categoryId = categoryObj.id;

      mistakeDef.recordSwing = this.recordSwing;

      const mistakeDetails: MistakeDetails = {
        desc: this.shotDesc,
        date: this.date,
      };

      const mistakeRecord = {
        mistakeDef,
        mistakeDetails,
        updateDetailsVersion: this.updateDesc,
      };

      if (this.isExistingShot) {
        mistakeRecord.mistakeDef.id = this.shotId;
        mistakeRecord.mistakeDetails.mistakeId = this.shotId;
        this.saveMistake(mistakeRecord)
          .then(() => {
            this.$emit(DONE_EVENT);
          });
      } else {
        this.createMistake(mistakeRecord)
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
      const shot = this.mistakes.find((item) => item.mistakeDef.id === this.shotId);
      if (!shot) {
        throw Error(`Shot for ID, ${this.shotId}, doesn't exist`);
      }

      const category = this.categories.find((item) => item.id === shot.mistakeDef.categoryId);
      if (!category) {
        throw Error(`Category for categoryId, ${category.id}, doesn't exist`);
      }

      this.shotTitle = shot.mistakeDef.title;
      this.shotDesc = shot.mistakeDetails.desc;
      this.shotCategory = category.name;
      this.recordSwing = shot.mistakeDef.recordSwing;
      this.date = shot.mistakeDetails.date;
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
.form-content
  width: 100%;

.textarea-select
  margin-top: -40px;

</style>
