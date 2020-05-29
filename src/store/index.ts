import Vue from 'vue';
import Vuex from 'vuex';
import hasKey from '@/utils/objects';
import mistakeDefs from './mistake-defs/mistake-defs';
import rounds from './rounds/rounds';
import { RootState, ScreenData } from './rootTypes.d';

Vue.use(Vuex);

export const UPDATE_SCREEN = 'update_screen';
export const UPDATE_VIEW = 'update_view';

export default new Vuex.Store({
  state: {
    version: 1.0,
    view: '',
    screen: {
      summary: '',
      review: '',
      track: '',
    },
  },
  mutations: {
    [UPDATE_VIEW](state: RootState, view: string) {
      state.view = view;
    },
    [UPDATE_SCREEN](state: RootState, screenData: ScreenData) {
      if (hasKey(state.screen, screenData.type)) {
        state.screen[screenData.type] = screenData.view;
      }
    },
  },
  actions: {
  },
  modules: {
    mistakeDefs,
    rounds,
  },
});
