import { GET_ALL_ROUNDS } from './getter-types';
import { RoundState } from './types.d';

const getters = {
  [GET_ALL_ROUNDS](state: RoundState) {
    return state.rounds;
  },
};

export default getters;
