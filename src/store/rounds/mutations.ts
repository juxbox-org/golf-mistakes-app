import { INSERT_ROUND, UPDATE_OVERVIEW_TAB } from './mutation-types';
import { RoundState, Round } from './types.d';

const mutations = {
  [INSERT_ROUND](state: RoundState, round: Round) {
    state.rounds.push(round);
  },
  [UPDATE_OVERVIEW_TAB](state: RoundState, newTab: string) {
    state.currentOverviewTab = newTab;
  },
};

export default mutations;
