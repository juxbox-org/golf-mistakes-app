import Vue from 'vue';
import Vuex from 'vuex';
// import hasKey from '@/utils/objects';
import mistakeDefs from './mistake-defs/mistake-defs';
import rounds from './rounds/rounds';
import currentRound from './current-round/current-round';

Vue.use(Vuex);

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
  },
  actions: {
  },
  modules: {
    mistakeDefs,
    rounds,
    currentRound,
  },
});
