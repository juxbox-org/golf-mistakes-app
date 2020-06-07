import {
  INSERT_MISTAKE,
  INSERT_CATEGORY,
  UPDATE_MISTAKE,
  REMOVE_MISTAKE,
} from './mutation-types';
import { MistakeDefsState, MistakeDef, ShotCategory } from './types.d';

const mutations = {
  [INSERT_MISTAKE](state: MistakeDefsState, mistakeDef: MistakeDef) {
    state.mistakeDefs.push(mistakeDef);
  },
  [INSERT_CATEGORY](state: MistakeDefsState, categoryRecord: ShotCategory) {
    state.shotCategories.push(categoryRecord);
  },
  [UPDATE_MISTAKE](state: MistakeDefsState, mistakeDef: MistakeDef) {
    const shot = state.mistakeDefs.find((mistake) => mistake.id === mistakeDef.id);
    Object.assign(shot, {
      title: mistakeDef.title,
      desc: mistakeDef.desc,
      categoryId: mistakeDef.categoryId,
    });
  },
  [REMOVE_MISTAKE](state: MistakeDefsState, id: number) {
    const index = state.mistakeDefs.findIndex((mistake) => mistake.id === id);

    if (index >= 0) {
      state.mistakeDefs.splice(index, 1);
    }
  },
};

export default mutations;
