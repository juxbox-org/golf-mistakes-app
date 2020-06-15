import {
  GET_ALL_ROUNDS,
  GET_OVERVIEW_TAB,
  HAS_UPDATED, GET_ID,
} from './getter-types';
import { RoundState } from './types.d';

const getters = {
  [GET_ALL_ROUNDS](state: RoundState) {
    return state.rounds;
  },
  [GET_OVERVIEW_TAB](state: RoundState) {
    return state.currentOverviewTab;
  },
  [HAS_UPDATED](state: RoundState) {
    return state.hasUpdated;
  },
  [GET_ID](state: RoundState) {
    return state.id;
  },
};

export default getters;
