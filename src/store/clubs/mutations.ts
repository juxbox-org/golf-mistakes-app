import { ADD_CLUB, INCREMENT_ID } from './mutation-types';
import { ClubsState, Club } from './types.d';

const mutations = {
  [ADD_CLUB](state: ClubsState, club: Club) {
    state.clubs.push(club);
  },
  [INCREMENT_ID](state: ClubsState) {
    state.id += 1;
  },
};

export default mutations;
