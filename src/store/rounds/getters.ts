import { GET_ALL_ROUNDS, GET_OVERVIEW_TAB } from './getter-types';
import { RoundState } from './types.d';

const getters = {
  [GET_ALL_ROUNDS](state: RoundState) {
    return state.rounds;
  },
  [GET_OVERVIEW_TAB](state: RoundState) {
    return state.currentOverviewTab;
  },
};

export default getters;
