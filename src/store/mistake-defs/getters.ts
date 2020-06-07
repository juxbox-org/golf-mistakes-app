import { MISTAKES, CATEGORIES } from './getter-types';
import { MistakeDefsState } from './types.d';

const getters = {
  [MISTAKES](state: MistakeDefsState) {
    return state.mistakeDefs;
  },
  [CATEGORIES](state: MistakeDefsState) {
    return state.shotCategories;
  },
};

export default getters;
