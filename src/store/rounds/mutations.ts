import { INSERT_ROUND } from './mutation-types';
import { RoundState, Round } from './types.d';

const mutations = {
  [INSERT_ROUND](state: RoundState, round: Round) {
    state.rounds.push(round);
  },
};

export default mutations;
