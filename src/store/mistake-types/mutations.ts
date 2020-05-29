import { INSERT_MISTAKE } from './mutation-types';
import { MistakeTypesState, MistakeRecord } from './types.d';

const mutations = {
  [INSERT_MISTAKE](state: MistakeTypesState, mistakeRecord: MistakeRecord) {
    state.mistakeTypes.set(mistakeRecord.id, mistakeRecord.data);
  },
};

export default mutations;
