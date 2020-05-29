import { INSERT_ROUND } from './mutation-types';
import { RoundsState, RoundRecord } from './types.d';

const mutations = {
  [INSERT_ROUND](state: RoundsState, roundRecord: RoundRecord) {
    state.rounds.set(roundRecord.id, roundRecord.data);
  },
};

export default mutations;
