import Vue from 'vue';
import Vuex from 'vuex';
import hasKey from '@/utils/objects';
import mistakeTypes from './mistake-types/mistake-types';
import { RootState, ViewData } from './rootTypes.d';

Vue.use(Vuex);

export const UPDATE_SCREEN = 'update_screen';
export const UPDATE_VIEW = 'update_view';

export default new Vuex.Store({
  state: {
    version: 1.0,
    screen: '',
    view: {
      summary: '',
      review: '',
      track: '',
    },
  },
  mutations: {
    [UPDATE_SCREEN](state: RootState, screen: string) {
      state.screen = screen;
    },
    [UPDATE_VIEW](state: RootState, viewData: ViewData) {
      if (hasKey(state.view, viewData.type)) {
        state.view[viewData.type] = viewData.view;
      }
    },
  },
  actions: {
  },
  modules: {
    mistakeTypes,
  },
});
