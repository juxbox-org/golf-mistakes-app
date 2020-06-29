<template lang="pug">
  v-tab-item(value="ShotTypes" class="gma-scrolling-layout" :transition="false"
      :reverse-transition="false")
    div(v-show="!isEditing && !isAdding" class="gma-mistake-list")
      v-list
        v-list-group(v-for="category in categoriesForDisplay" :key="category.name"
            v-model="category.active" :ripple="false")
          template(v-slot:activator)
            v-list-item-content
              v-list-item-title {{ category.name }}
            v-list-item-action(v-show="isEditingShots" @click.stop="onDeleteCategory(category.id)")
              v-icon mdi-delete

          v-list-item(v-for="shot in category.shots" :key="shot.mistakeDef.title"
              @click="editShot(shot.mistakeDef.id)" :ripple="false")
            v-list-item-content
              v-list-item-title {{ shot.mistakeDef.title }}
              v-list-item-subtitle {{ shot.mistakeDetails.desc }}
            v-list-item-action
              v-btn(icon @click="editShot(shot.mistakeDef.id)")
                v-icon(color="grey lighten-1") mdi-pencil-circle
          v-divider(v-show="category.shots.length")
          v-list-item(class='gma-list-item__link' @click="createShot()")
            v-btn(small rounded outlined elevation="0") + create a shot for {{ category.name }}

    v-fab-transition
      v-btn(dark fixed small bottom right fab v-show="!hideFab && !isEditing && !isAdding"
          @click="createShot")
        v-icon mdi-plus

    EditShot(v-if="isEditing || isAdding" v-on:done-edit="doneEditing" :shotId="shotToEdit"
        :categoryId="activeCategoryId")
</template>

<script lang="ts">
/* eslint-disable operator-linebreak */
import _ from 'lodash';
import Vue from 'vue';
import bus from '@/event-bus';
import Component from 'vue-class-component';
import EditShot from '@/views/screens/summary/EditShot.vue';
import { namespace } from 'vuex-class';
import { MISTAKES, CATEGORIES } from '@/store/mistake-defs/getter-types';
import { MistakeDef, ShotCategory, MistakeRecord } from '@/store/mistake-defs/types.d';
import { DELETE_CATEGORY } from '@/store/mistake-defs/action-types';

const MistakeDefsModule = namespace('mistakeDefs');

Component.registerHooks([
  'beforeRouteLeave',
]);

declare interface Categories extends ShotCategory {
  active: boolean;
  shots: Array<MistakeRecord>;
}

@Component({
  name: 'ShotTypes',
  components: { EditShot },
  beforeRouteLeave(to, from, next) {
    (this as ShotTypes).refreshCategories();
    next();
  },
})
export default class ShotTypes extends Vue {
  @MistakeDefsModule.Getter(MISTAKES)
  mistakes!: Array<MistakeRecord>;

  @MistakeDefsModule.Getter(CATEGORIES)
  categories!: Array<ShotCategory>;

  @MistakeDefsModule.Action(DELETE_CATEGORY)
  deleteCategory!: (arg0: number) => Promise<void>;

  hideFab = true;

  isEditing = false;

  isAdding = false;

  active = true;

  shotToEdit?: number = null;

  savedCategoryId?: number = null;

  categoriesWithShots: Array<Categories> = [];

  isEditingShots = false;

  get activeCategoryId() {
    const index = this.categoriesWithShots.findIndex((category) => category.active);

    if (index < 0) {
      return null;
    }

    return this.categoriesWithShots[index].id;
  }

  get categoriesForDisplay() {
    return this.categoriesWithShots;
  }

  set categoriesForDisplay(categories) {
    this.categoriesWithShots = categories;
  }

  editShot(id: number) {
    this.shotToEdit = id;
    this.savedCategoryId = this.activeCategoryId;
    this.isEditing = true;
  }

  createShot() {
    this.shotToEdit = null;
    this.isAdding = true;
  }

  doneEditing(categoryId?: number) {
    this.refreshCategories();
    if (this.isAdding) {
      if (!_.isNil(categoryId)) {
        this.openTabForCategory(categoryId);
      }
      this.isAdding = false;
    } else {
      this.openTabForCategory(this.savedCategoryId);
      this.isEditing = false;
    }
  }

  openTabForCategory(id: number) {
    const match = this.categoriesWithShots.find((category) => category.id === id);

    match.active = true;
  }

  onDeleteCategory(id: number) {
    this.deleteCategory(id).then(() => {
      this.refreshCategories();
    });
  }

  refreshCategories() {
    const update = this.categories.map((category) => {
      const groupedShots =
        this.mistakes.filter((mistake) => mistake.mistakeDef.categoryId === category.id);

      return { ...category, shots: groupedShots, active: false };
    });

    this.categoriesForDisplay = update;
  }

  toggleEditingShots() {
    this.isEditingShots = !this.isEditingShots;
  }

  mounted() {
    bus.$on('edit-shots', this.toggleEditingShots);

    this.refreshCategories();

    this.$nextTick(() => {
      // trigger the fab transition animation
      this.hideFab = false;
    });
  }

  destroyed() {
    bus.$off('edit-shots', this.toggleEditingShots);
  }
}
</script>

<style lang="stylus">
.panel-content
  transition: none !important;

</style>
