import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
// import hasKey from '@/utils/objects';
import mistakeDefs from './mistake-defs/mistake-defs';
import rounds from './rounds/rounds';
import currentRound from './current-round/current-round';
import { RootState } from './rootTypes.d';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence<RootState>();

export default new Vuex.Store({
  state: {
    version: 1.0,
    view: '',
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    mistakeDefs,
    rounds,
    currentRound,
  },
  plugins: [vuexLocal.plugin],
});
