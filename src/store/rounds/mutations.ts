import { INSERT_ROUND, UPDATE_OVERVIEW_TAB, SET_HAS_UPDATED } from './mutation-types';
import { RoundState, Round } from './types.d';

const mutations = {
  [INSERT_ROUND](state: RoundState, round: Round) {
    // Order rounds from newest to oldest
    state.rounds.unshift(round);
  },
  [UPDATE_OVERVIEW_TAB](state: RoundState, newTab: string) {
    state.currentOverviewTab = newTab;
  },
  [SET_HAS_UPDATED](state: RoundState) {
    state.hasUpdated = true;
  },
};

export default mutations;
