import { INSERT_MISTAKE } from './mutation-types';
import { MistakeDefsState, MistakeRecord } from './types.d';

const mutations = {
  [INSERT_MISTAKE](state: MistakeDefsState, mistakeRecord: MistakeRecord) {
    state.mistakeDefs.set(mistakeRecord.id, mistakeRecord.data);
  },
};

export default mutations;
