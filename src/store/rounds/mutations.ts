import { INCREMENT_ID } from '@/store/mistake-defs/mutation-types';
import {
  INSERT_ROUND,
  UPDATE_OVERVIEW_TAB,
  SET_HAS_UPDATED,
  REMOVE_ROUND,
} from './mutation-types';
import { RoundState, Round } from './types.d';

const mutations = {
  [INSERT_ROUND](state: RoundState, round: Round) {
    // Order rounds from newest to oldest
    state.rounds.unshift(round);
  },
  [REMOVE_ROUND](state: RoundState, round: Round) {
    const index = state.rounds.findIndex((item) => item.id === round.id);
    state.rounds.splice(index, 1);
  },
  [UPDATE_OVERVIEW_TAB](state: RoundState, newTab: string) {
    state.currentOverviewTab = newTab;
  },
  [SET_HAS_UPDATED](state: RoundState) {
    state.hasUpdated = true;
  },
  [INCREMENT_ID](state: RoundState) {
    state.id += 1;
  },
};

export default mutations;
